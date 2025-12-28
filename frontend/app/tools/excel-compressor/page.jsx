"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Table, Upload, Download, Loader2, Check, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { API_BASE_URL } from '@/lib/api-client';

export default function ExcelCompressorPage() {
    const [file, setFile] = useState(null);
    const [compressing, setCompressing] = useState(false);
    const [compressed, setCompressed] = useState(null);
    const [stats, setStats] = useState(null);
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            const validTypes = [
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'application/vnd.ms-excel'
            ];
            if (!validTypes.includes(selectedFile.type)) {
                setError('Please select an Excel file (.xlsx)');
                return;
            }
            setFile(selectedFile);
            setError('');
            setCompressed(null);
        }
    };

    const handleCompress = async () => {
        if (!file) return;

        setCompressing(true);
        setError('');

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(`${API_BASE_URL}/api/tools/excel/compress`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Compression failed');

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            setCompressed(url);
            setStats({
                original: file.size,
                compressed: blob.size,
                reduction: ((1 - blob.size / file.size) * 100).toFixed(1)
            });
        } catch (err) {
            setError('Failed to compress Excel file. Please try again.');
            console.error(err);
        } finally {
            setCompressing(false);
        }
    };

    const downloadCompressed = () => {
        if (!compressed) return;
        const link = document.createElement('a');
        link.href = compressed;
        link.download = 'compressed.xlsx';
        link.click();
    };

    const reset = () => {
        setFile(null);
        setCompressed(null);
        setStats(null);
        setError('');
    };

    const formatSize = (bytes) => {
        return (bytes / 1024 / 1024).toFixed(2) + ' MB';
    };

    return (
        <div className="min-h-screen bg-background pt-24 pb-12">
            <div className="container mx-auto px-6 max-w-3xl">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-teal-500 to-green-500 flex items-center justify-center">
                        <Table className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold mb-3">Excel Compressor</h1>
                    <p className="text-muted-foreground text-lg">
                        Compress Excel files to save storage space
                    </p>
                </motion.div>

                {!file ? (
                    <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-border rounded-xl cursor-pointer bg-card hover:bg-accent/50 transition-all">
                        <Upload className="w-12 h-12 mb-4 text-muted-foreground" />
                        <p className="mb-2 text-lg font-semibold">Click to upload Excel file</p>
                        <p className="text-sm text-muted-foreground">XLSX files supported</p>
                        <input
                            type="file"
                            className="hidden"
                            accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                            onChange={handleFileChange}
                        />
                    </label>
                ) : (
                    <div className="space-y-6">
                        <div className="p-6 rounded-xl bg-card border border-border">
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-3">
                                    <Table className="w-10 h-10 text-teal-500" />
                                    <div>
                                        <h3 className="font-semibold mb-1">{file.name}</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Original size: {formatSize(file.size)}
                                        </p>
                                    </div>
                                </div>
                                <Button size="sm" variant="ghost" onClick={reset}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        <Button onClick={handleCompress} disabled={compressing} className="w-full h-12">
                            {compressing ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Compressing...
                                </>
                            ) : (
                                'Compress Excel File'
                            )}
                        </Button>

                        {stats && compressed && (
                            <div className="p-6 rounded-xl bg-green-500/10 border border-green-500/50">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-3">
                                        <Check className="w-6 h-6 text-green-600" />
                                        <div>
                                            <h3 className="font-semibold text-green-600 mb-2">Compression Complete!</h3>
                                            <p className="text-sm text-muted-foreground">
                                                Compressed size: <span className="font-semibold">{formatSize(stats.compressed)}</span>
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                Reduction: <span className="font-semibold text-green-600">{stats.reduction}%</span>
                                            </p>
                                        </div>
                                    </div>
                                    <Button onClick={downloadCompressed} className="bg-green-600 hover:bg-green-700">
                                        <Download className="w-4 h-4 mr-2" />
                                        Download
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {error && (
                    <div className="mt-6 p-4 rounded-lg bg-red-500/10 border border-red-500/50 text-red-600">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
}
