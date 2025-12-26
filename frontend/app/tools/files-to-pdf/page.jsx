"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function FilesToPDFPage() {
    const [files, setFiles] = useState([]);

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files || []);
        setFiles([...files, ...selectedFiles]);
    };

    return (
        <div className="min-h-screen bg-background pt-24 pb-12">
            <div className="container mx-auto px-6 max-w-3xl">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                        <FileText className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold mb-3">Files to PDF</h1>
                    <p className="text-muted-foreground text-lg">
                        Convert various file formats to PDF
                    </p>
                </motion.div>

                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-border rounded-xl cursor-pointer bg-card hover:bg-accent/50 transition-all">
                    <Upload className="w-12 h-12 mb-4 text-muted-foreground" />
                    <p className="mb-2 text-lg font-semibold">Upload Files</p>
                    <p className="text-sm text-muted-foreground">Images, Word, Excel, PowerPoint</p>
                    <input
                        type="file"
                        className="hidden"
                        accept=".jpg,.jpeg,.png,.docx,.xlsx,.pptx"
                        multiple
                        onChange={handleFileChange}
                    />
                </label>

                {files.length > 0 && (
                    <div className="mt-6 space-y-4">
                        <h3 className="font-semibold">Files to convert ({files.length}):</h3>
                        {files.map((file, index) => (
                            <div key={index} className="p-4 rounded-lg bg-card border border-border">
                                <p className="font-medium">{file.name}</p>
                                <p className="text-sm text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
                            </div>
                        ))}

                        <div className="p-6 rounded-xl bg-yellow-500/10 border border-yellow-500/50">
                            <p className="text-sm text-muted-foreground">
                                <strong>Feature Under Development:</strong> Multi-format to PDF conversion requires Apache POI and PDFBox libraries.
                                Backend API implementation coming soon.
                            </p>
                            <Button className="w-full mt-4" disabled>
                                Convert to PDF (Coming Soon)
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
