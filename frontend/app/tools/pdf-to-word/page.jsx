"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Upload, Download, Loader2, Check, X, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProcessingOverlay from '@/components/Tools/ProcessingOverlay';

import { API_BASE_URL } from '@/lib/api-client';

export default function PDFToWordPage() {
    const [file, setFile] = useState(null);
    const [converting, setConverting] = useState(false);
    const [converted, setConverted] = useState(null);
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
            const response = await fetch(`${API_BASE_URL}/api/tools/pdf/to-word`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Conversion failed');

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            setConverted(url);
        } catch (err) {
            setError('Failed to convert PDF. Please try again.');
            console.error(err);
        } finally {
            setConverting(false);
        }
    };

    const downloadConverted = () => {
        if (!converted) return;
        const link = document.createElement('a');
        link.href = converted;
        link.download = 'converted.docx';
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
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <FileText className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold mb-3">PDF to Word Converter</h1>
                    <p className="text-muted-foreground text-lg">
                        Convert PDF documents to editable Word files
                    </p>
                </motion.div>

                {!file ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <label
                            htmlFor="pdf-upload"
                            className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-border rounded-xl cursor-pointer bg-card hover:bg-accent/50 transition-all"
                        >
                            <Upload className="w-12 h-12 mb-4 text-muted-foreground" />
                            <p className="mb-2 text-lg font-semibold">Click to upload PDF</p>
                            <p className="text-sm text-muted-foreground">Convert to editable Word document</p>
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
                    <div className="space-y-6 relative rounded-xl overflow-hidden">
                        <ProcessingOverlay isProcessing={converting} message="Converting PDF to Word..." />
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="p-6 rounded-xl bg-card border border-border"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <FileText className="w-10 h-10 text-purple-500" />
                                    <div>
                                        <h3 className="font-semibold">{file.name}</h3>
                                        <p className="text-sm text-muted-foreground">
                                            {(file.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                    </div>
                                </div>
                                <Button size="sm" variant="ghost" onClick={reset}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </motion.div>

                        <Button
                            onClick={handleConvert}
                            disabled={converting}
                            className="w-full h-12 text-lg"
                        >
                            {converting ? 'Converting...' : 'Convert to Word'}
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
                                                Your Word document is ready
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        onClick={downloadConverted}
                                        className="bg-green-600 hover:bg-green-700"
                                    >
                                        <Download className="w-4 h-4 mr-2" />
                                        Download Word
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
            </div>
        </div>
    );
}
