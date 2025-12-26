"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Upload, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function MergeWordPage() {
    const [files, setFiles] = useState([]);

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files || []);
        const docFiles = selectedFiles.filter(f =>
            f.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        );
        setFiles([...files, ...docFiles]);
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
                    <h1 className="text-4xl font-bold mb-3">Merge Word Files</h1>
                    <p className="text-muted-foreground text-lg">
                        Combine multiple Word documents into one
                    </p>
                </motion.div>

                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border rounded-xl cursor-pointer bg-card hover:bg-accent/50 transition-all mb-6">
                    <Plus className="w-12 h-12 mb-4 text-muted-foreground" />
                    <p className="mb-2 text-lg font-semibold">Add Word Documents</p>
                    <p className="text-sm text-muted-foreground">DOCX files only</p>
                    <input
                        type="file"
                        className="hidden"
                        accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        multiple
                        onChange={handleFileChange}
                    />
                </label>

                {files.length > 0 && (
                    <div className="space-y-4">
                        <h3 className="font-semibold">Documents to merge ({files.length}):</h3>
                        {files.map((file, index) => (
                            <div key={index} className="p-4 rounded-lg bg-card border border-border flex items-center gap-3">
                                <FileText className="w-8 h-8 text-blue-500" />
                                <div>
                                    <p className="font-medium">{file.name}</p>
                                    <p className="text-sm text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
                                </div>
                            </div>
                        ))}

                        <div className="p-6 rounded-xl bg-yellow-500/10 border border-yellow-500/50">
                            <p className="text-sm text-muted-foreground">
                                <strong>Feature Under Development:</strong> Word merging requires Apache POI library.
                                Backend API implementation coming soon.
                            </p>
                            <Button className="w-full mt-4" disabled>
                                Merge Documents (Coming Soon)
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
