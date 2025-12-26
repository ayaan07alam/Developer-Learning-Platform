"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SplitPDFPage() {
    const [file, setFile] = useState(null);
    const [splitMode, setSplitMode] = useState('pages');
    const [pageRanges, setPageRanges] = useState('');

    const handleFileChange = (e) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile && selectedFile.type === 'application/pdf') {
            setFile(selectedFile);
        }
    };

    return (
        <div className="min-h-screen bg-background pt-24 pb-12">
            <div className="container mx-auto px-6 max-w-3xl">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
                        <FileText className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold mb-3">Split PDF</h1>
                    <p className="text-muted-foreground text-lg">
                        Split PDF into multiple files
                    </p>
                </motion.div>

                {!file ? (
                    <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-border rounded-xl cursor-pointer bg-card hover:bg-accent/50 transition-all">
                        <Upload className="w-12 h-12 mb-4 text-muted-foreground" />
                        <p className="mb-2 text-lg font-semibold">Upload PDF to Split</p>
                        <p className="text-sm text-muted-foreground">PDF files only</p>
                        <input
                            type="file"
                            className="hidden"
                            accept=".pdf,application/pdf"
                            onChange={handleFileChange}
                        />
                    </label>
                ) : (
                    <div className="space-y-6">
                        <div className="p-6 rounded-xl bg-card border border-border">
                            <h3 className="font-semibold mb-4">Split Options:</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="flex items-center gap-3">
                                        <input
                                            type="radio"
                                            checked={splitMode === 'pages'}
                                            onChange={() => setSplitMode('pages')}
                                            className="w-4 h-4"
                                        />
                                        <span>Split by page ranges (e.g., 1-3, 5-10)</span>
                                    </label>
                                </div>
                                <div>
                                    <label className="flex items-center gap-3">
                                        <input
                                            type="radio"
                                            checked={splitMode === 'every'}
                                            onChange={() => setSplitMode('every')}
                                            className="w-4 h-4"
                                        />
                                        <span>Split into individual pages</span>
                                    </label>
                                </div>
                            </div>

                            {splitMode === 'pages' && (
                                <input
                                    type="text"
                                    value={pageRanges}
                                    onChange={(e) => setPageRanges(e.target.value)}
                                    placeholder="e.g., 1-3, 5-10"
                                    className="w-full mt-4 p-3 rounded-lg bg-background border border-border"
                                />
                            )}
                        </div>

                        <div className="p-6 rounded-xl bg-yellow-500/10 border border-yellow-500/50">
                            <p className="text-sm text-muted-foreground mb-4">
                                <strong>Feature Under Development:</strong> PDF splitting requires backend processing with PDFBox.
                                Backend API implementation coming soon.
                            </p>
                            <Button className="w-full" disabled>
                                Split PDF (Coming Soon)
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
