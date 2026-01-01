"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon, Upload, Download, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PremiumFileUploader from '@/components/Tools/PremiumFileUploader';

import { API_BASE_URL } from '@/lib/api-client';

export default function UpscaleImagesPage() {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState('');
    const [scale, setScale] = useState(2);
    const [processing, setProcessing] = useState(false);
    const [processed, setProcessed] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile && selectedFile.type.startsWith('image/')) {
            setFile(selectedFile);
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(selectedFile);

            // Get image dimensions
            const img = new Image();
            img.onload = () => {
                // Will resize based on scale factor
            };
            img.src = URL.createObjectURL(selectedFile);
        }
    };

    const handleUpscale = async () => {
        if (!file) return;
        setProcessing(true);

        // Get original image dimensions
        const img = new Image();
        img.src = preview;

        img.onload = async () => {
            const newWidth = img.width * scale;
            const newHeight = img.height * scale;

            const formData = new FormData();
            formData.append('file', file);
            formData.append('width', newWidth.toString());
            formData.append('height', newHeight.toString());
            formData.append('maintain', 'false');

            try {
                const response = await fetch(`${API_BASE_URL}/api/tools/images/resize`, {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) throw new Error('Upscale failed');

                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                setProcessed(url);
            } catch (err) {
                console.error(err);
            } finally {
                setProcessing(false);
            }
        };
    };

    const downloadImage = () => {
        if (!processed) return;
        const link = document.createElement('a');
        link.href = processed;
        link.download = 'upscaled.jpg';
        link.click();
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
                        <ImageIcon className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold mb-3">Upscale Images</h1>
                    <p className="text-muted-foreground text-lg">
                        Increase image resolution
                    </p>
                </motion.div>

                {!file ? (
                    <PremiumFileUploader
                        onFileSelect={(e) => {
                            handleFileChange({ target: { files: e.target.files } });
                        }}
                        accept="image/*"
                        label="Click to upload image"
                        subLabel="All formats supported"
                    />
                ) : (
                    <div className="space-y-6">
                        {preview && (
                            <div className="p-4 rounded-xl bg-card border border-border">
                                <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded-lg" />
                            </div>
                        )}

                        <div className="p-6 rounded-xl bg-card border border-border">
                            <label className="text-sm text-muted-foreground mb-3 block">Upscale Factor</label>
                            <div className="flex gap-3">
                                {[2, 3, 4].map((factor) => (
                                    <button
                                        key={factor}
                                        onClick={() => setScale(factor)}
                                        className={`flex-1 p-3 rounded-lg font-medium transition-all ${scale === factor
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-background border border-border hover:border-primary'
                                            }`}
                                    >
                                        {factor}x
                                    </button>
                                ))}
                            </div>
                        </div>

                        <Button onClick={handleUpscale} disabled={processing} className="w-full h-12">
                            {processing ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Upscaling...
                                </>
                            ) : (
                                'Upscale Image'
                            )}
                        </Button>

                        {processed && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="p-6 rounded-xl bg-green-500/10 border border-green-500/50 flex items-center justify-between"
                            >
                                <div className="flex items-center gap-3">
                                    <Check className="w-6 h-6 text-green-600" />
                                    <span className="font-semibold text-green-600">Image Upscaled!</span>
                                </div>
                                <Button onClick={downloadImage} className="bg-green-600 hover:bg-green-700">
                                    <Download className="w-4 h-4 mr-2" />
                                    Download
                                </Button>
                            </motion.div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
