"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Upload, Download, Loader2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProcessingOverlay from '@/components/Tools/ProcessingOverlay';

import { API_BASE_URL } from '@/lib/api-client';

export default function WordToPDFPage() {
    const [file, setFile] = useState(null);
    const [converting, setConverting] = useState(false);
    const [converted, setConverted] = useState(null);
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            const validTypes = [
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'application/msword'
            ];
            if (!validTypes.includes(selectedFile.type)) {
                setError('Please select a Word document (.docx)');
                return;
            }
            setFile(selectedFile);
            setError('');
            setConverted(null);
        }
    };

    const handleConvert = async () => {
        if (!file) return;

        setConverting(true);
        setError('');

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(`${API_BASE_URL}/api/tools/word/to-pdf`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Conversion failed');

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            setConverted(url);
        } catch (err) {
            setError('Failed to convert document. Please try again.');
            console.error(err);
        } finally {
            setConverting(false);
        }
    };

    const downloadConverted = () => {
        if (!converted) return;
        const link = document.createElement('a');
        link.href = converted;
        link.download = 'converted.pdf';
        link.click();
    };

    const reset = () => {
        setFile(null);
        setConverted(null);
        setError('');
    };

    return (
        <div className="min-h-screen bg-background pt-24 pb-12">
            <div className="container mx-auto px-6 max-w-3xl">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                        <FileText className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold mb-3">Word to PDF Converter</h1>
                    <p className="text-muted-foreground text-lg">
                        Convert Word documents to PDF format instantly
                    </p>
                </motion.div>

                {!file ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <label
                            htmlFor="word-upload"
                            className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-border rounded-xl cursor-pointer bg-card hover:bg-accent/50 transition-all"
                        >
                            <Upload className="w-12 h-12 mb-4 text-muted-foreground" />
                            <p className="mb-2 text-lg font-semibold">Click to upload Word document</p>
                            <p className="text-sm text-muted-foreground">DOCX files supported</p>
                            <input
                                id="word-upload"
                                type="file"
                                className="hidden"
                                accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                onChange={handleFileChange}
                            />
                        </label>
                    </motion.div>
                ) : (
                    <div className="space-y-6 relative rounded-xl overflow-hidden">
                        <ProcessingOverlay isProcessing={converting} message="Converting Word to PDF..." />
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="p-6 rounded-xl bg-card border border-border"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <FileText className="w-10 h-10 text-blue-500" />
                                    <div>
                                        <h3 className="font-semibold">{file.name}</h3>
                                        <p className="text-sm text-muted-foreground">
                                            {(file.size / 1024).toFixed(2)} KB
                                        </p>
                                    </div>
                                </div>
                                <Button size="sm" variant="ghost" onClick={reset}>
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        </motion.div>

                        <Button
                            onClick={handleConvert}
                            disabled={converting}
                            className="w-full h-12 text-lg"
                        >
                            {converting ? 'Converting...' : 'Convert to PDF'}
                        </Button>

                        {converted && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-6 rounded-xl bg-green-500/10 border border-green-500/50"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Check className="w-6 h-6 text-green-600" />
                                        <div>
                                            <h3 className="font-semibold text-green-600">
                                                Conversion Complete!
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                Your PDF is ready to download
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        onClick={downloadConverted}
                                        className="bg-green-600 hover:bg-green-700"
                                    >
                                        <Download className="w-4 h-4 mr-2" />
                                        Download PDF
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
                        className="mt-6 p-4 rounded-lg bg-red-500/10 border border-red-500/50 text-red-600"
                    >
                        {error}
                    </motion.div>
                )}
            </div>
        </div>
    );
}
