"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Upload, Plus, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProcessingOverlay from '@/components/Tools/ProcessingOverlay';

export default function MergePDFPage() {
    const [files, setFiles] = useState([]);
    const [merging, setMerging] = useState(false);
    const [merged, setMerged] = useState(null);

    const handleMerge = async () => {
        setMerging(true);
        // Simulate merging
        await new Promise(resolve => setTimeout(resolve, 2000));
        setMerging(false);
        setMerged(true); // Just a flag for demo
    };

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files || []);
        setFiles([...files, ...selectedFiles]);
    };

    const removeFile = (index) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    return (
        <div className="min-h-screen bg-background pt-24 pb-12">
            <div className="container mx-auto px-6 max-w-3xl">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                        <FileText className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold mb-3">Merge PDFs</h1>
                    <p className="text-muted-foreground text-lg">
                        Combine multiple PDF files into one
                    </p>
                </motion.div>

                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border rounded-xl cursor-pointer bg-card hover:bg-accent/50 transition-all mb-6">
                    <Plus className="w-12 h-12 mb-4 text-muted-foreground" />
                    <p className="mb-2 text-lg font-semibold">Add PDF Files</p>
                    <p className="text-sm text-muted-foreground">Click to select multiple PDFs</p>
                    <input
                        type="file"
                        className="hidden"
                        accept=".pdf,application/pdf"
                        multiple
                        onChange={handleFileChange}
                    />
                </label>

                {files.length > 0 && (
                    <div className="space-y-4 relative rounded-xl overflow-hidden p-1">
                        <ProcessingOverlay isProcessing={merging} message="Merging PDFs..." />
                        <h3 className="font-semibold">Files to merge ({files.length}):</h3>
                        {files.map((file, index) => (
                            <div key={index} className="p-4 rounded-lg bg-card border border-border flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <FileText className="w-8 h-8 text-red-500" />
                                    <div>
                                        <p className="font-medium">{file.name}</p>
                                        <p className="text-sm text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                    </div>
                                </div>
                                <Button size="sm" variant="ghost" onClick={() => removeFile(index)}>
                                    Remove
                                </Button>
                            </div>
                        ))}

                        <Button
                            className="w-full h-12 text-lg"
                            onClick={handleMerge}
                            disabled={merging}
                        >
                            {merging ? 'Merging...' : 'Merge PDFs (Demo)'}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
