"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Presentation, FileText, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PremiumFileUploader from '@/components/Tools/PremiumFileUploader';

export default function PDFToPPTPage() {
    const [file, setFile] = useState(null);

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
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <Presentation className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold mb-3">PDF to PPT</h1>
                    <p className="text-muted-foreground text-lg">
                        Convert PDF files to editable PowerPoint
                    </p>
                </motion.div>

                {!file ? (
                    <PremiumFileUploader
                        onFileSelect={(e) => {
                            handleFileChange({ target: { files: e.target.files } });
                        }}
                        accept=".pdf,application/pdf"
                        label="Upload PDF File"
                        subLabel="PDF files only"
                    />
                ) : (
                    <div className="space-y-6">
                        <div className="p-6 rounded-xl bg-card border border-border flex items-center gap-3">
                            <FileText className="w-10 h-10 text-red-500" />
                            <div>
                                <p className="font-medium">{file.name}</p>
                                <p className="text-sm text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                        </div>

                        <div className="p-6 rounded-xl bg-yellow-500/10 border border-yellow-500/50">
                            <p className="text-sm text-muted-foreground mb-4">
                                <strong>Feature Under Development:</strong> PDF to PowerPoint conversion is complex and requires OCR/image extraction.
                                Backend API with specialized libraries coming soon.
                            </p>
                            <Button className="w-full" disabled>
                                <Presentation className="w-4 h-4 mr-2" />
                                Convert to PowerPoint (Coming Soon)
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
