"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Presentation, Image as ImageIcon, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PremiumFileUploader from '@/components/Tools/PremiumFileUploader';

export default function PPTToImagesPage() {
    const [file, setFile] = useState(null);
    const [format, setFormat] = useState('png');

    const handleFileChange = (e) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
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
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                        <Presentation className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold mb-3">PPT to Images</h1>
                    <p className="text-muted-foreground text-lg">
                        Convert presentation slides to image files
                    </p>
                </motion.div>

                {!file ? (
                    <PremiumFileUploader
                        onFileSelect={(e) => {
                            handleFileChange({ target: { files: e.target.files } });
                        }}
                        accept=".pptx,application/vnd.openxmlformats-officedocument.presentationml.presentation"
                        label="Upload PowerPoint"
                        subLabel="PPTX files"
                    />
                ) : (
                    <div className="space-y-6">
                        <div className="p-6 rounded-xl bg-card border border-border">
                            <h3 className="font-semibold mb-4">Output Format:</h3>
                            <div className="flex gap-3">
                                {['png', 'jpg', 'webp'].map((fmt) => (
                                    <button
                                        key={fmt}
                                        onClick={() => setFormat(fmt)}
                                        className={`flex-1 p-3 rounded-lg font-medium transition-all ${format === fmt
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-background border border-border hover:border-primary'
                                            }`}
                                    >
                                        {fmt.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="p-6 rounded-xl bg-yellow-500/10 border border-yellow-500/50">
                            <p className="text-sm text-muted-foreground mb-4">
                                <strong>Feature Under Development:</strong> Slide to image conversion requires POI and image rendering libraries.
                                Backend API implementation coming soon.
                            </p>
                            <Button className="w-full" disabled>
                                <ImageIcon className="w-4 h-4 mr-2" />
                                Convert Slides to Images (Coming Soon)
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
