"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Upload, Download, Loader2, Check, X, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PDFCompressorPage() {
    const [file, setFile] = useState(null);
    const [compressing, setCompressing] = useState(false);
    const [compressed, setCompressed] = useState(null);
    const [stats, setStats] = useState(null);
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            if (selectedFile.type !== 'application/pdf') {
                setError('Please select a PDF file');
                return;
            }
            setFile(selectedFile);
            setError('');
            setCompressed(null);
            setStats(null);
        }
    };

    const handleCompress = async () => {
        if (!file) return;

        setCompressing(true);
        setError('');

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:8080/api/tools/pdf/compress', {
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
            setError('Failed to compress PDF. Please try again.');
            console.error(err);
        } finally {
            setCompressing(false);
        }
    };

    const downloadCompressed = () => {
        if (!compressed) return;
        const link = document.createElement('a');
        link.href = compressed;
        link.download = 'compressed.pdf';
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
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                        <FileText className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold mb-3">PDF Compressor</h1>
                    <p className="text-muted-foreground text-lg">
                        Reduce PDF file size without losing quality
                    </p>
                </motion.div>

                {!file ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <label
                            htmlFor="pdf-upload"
                            className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-border rounded-xl cursor-pointer bg-card hover:bg-accent/50 transition-all"
                        >
                            <Upload className="w-12 h-12 mb-4 text-muted-foreground" />
                            <p className="mb-2 text-lg font-semibold">Click to upload PDF</p>
                            <p className="text-sm text-muted-foreground">Maximum file size: 10MB</p>
                            <input
                                id="pdf-upload"
                                type="file"
                                className="hidden"
                                accept=".pdf,application/pdf"
                                onChange={handleFileChange}
                            />
                        </label>
                    </motion.div>
                ) : (
                    <div className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="p-6 rounded-xl bg-card border border-border"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-start gap-3">
                                    <FileText className="w-10 h-10 text-red-500" />
                                    <div>
                                        <h3 className="font-semibold mb-1">{file.name}</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Original size: {formatSize(file.size)}
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={reset}
                                    className="text-red-500 hover:text-red-600"
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Remove
                                </Button>
                            </div>
                        </motion.div>

                        <Button
                            onClick={handleCompress}
                            disabled={compressing}
                            className="w-full h-12 text-lg"
                        >
                            {compressing ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Compressing...
                                </>
                            ) : (
                                'Compress PDF'
                            )}
                        </Button>

                        {stats && compressed && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-6 rounded-xl bg-green-500/10 border border-green-500/50"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-start gap-3">
                                        <Check className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                                        <div>
                                            <h3 className="font-semibold text-green-600 mb-2">
                                                Compression Complete!
                                            </h3>
                                            <div className="space-y-1 text-sm">
                                                <p className="text-muted-foreground">
                                                    Compressed size: <span className="font-semibold text-foreground">{formatSize(stats.compressed)}</span>
                                                </p>
                                                <p className="text-muted-foreground">
                                                    Reduction: <span className="font-semibold text-green-600">{stats.reduction}%</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <Button
                                        onClick={downloadCompressed}
                                        className="bg-green-600 hover:bg-green-700"
                                    >
                                        <Download className="w-4 h-4 mr-2" />
                                        Download
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </div>
                )}

                {error && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-6 p-4 rounded-lg bg-red-500/10 border border-red-500/50 text-red-600 flex items-start gap-2"
                    >
                        <X className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <span>{error}</span>
                    </motion.div>
                )}

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mt-8 p-6 rounded-xl bg-primary/10 border border-primary/20"
                >
                    <h3 className="font-semibold mb-3">How it works</h3>
                    <ul className="text-sm text-muted-foreground space-y-2">
                        <li>✓ Optimizes images and removes unnecessary data</li>
                        <li>✓ Maintains document quality and readability</li>
                        <li>✓ Processes files securely on our server</li>
                        <li>✓ No watermarks or file limits</li>
                    </ul>
                </motion.div>
            </div>
        </div>
    );
}
