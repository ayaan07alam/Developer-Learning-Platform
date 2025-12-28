"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon, Upload, Download, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { API_BASE_URL } from '@/lib/api-client';

export default function DownscaleImagesPage() {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState('');
    const [width, setWidth] = useState(800);
    const [height, setHeight] = useState(600);
    const [processing, setProcessing] = useState(false);
    const [processed, setProcessed] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile && selectedFile.type.startsWith('image/')) {
            setFile(selectedFile);
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleResize = async () => {
        if (!file) return;
        setProcessing(true);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('width', width.toString());
        formData.append('height', height.toString());
        formData.append('maintain', 'true');

        try {
            const response = await fetch(`${API_BASE_URL}/api/tools/images/resize`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Resize failed');

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            setProcessed(url);
        } catch (err) {
            console.error(err);
        } finally {
            setProcessing(false);
        }
    };

    const downloadImage = () => {
        if (!processed) return;
        const link = document.createElement('a');
        link.href = processed;
        link.download = 'downscaled.jpg';
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
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold mb-3">Downscale Images</h1>
                    <p className="text-muted-foreground text-lg">
                        Reduce image size while maintaining quality
                    </p>
                </motion.div>

                {!file ? (
                    <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-border rounded-xl cursor-pointer bg-card hover:bg-accent/50 transition-all">
                        <Upload className="w-12 h-12 mb-4 text-muted-foreground" />
                        <p className="mb-2 text-lg font-semibold">Click to upload image</p>
                        <p className="text-sm text-muted-foreground">All formats supported</p>
                        <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </label>
                ) : (
                    <div className="space-y-6">
                        {preview && (
                            <div className="p-4 rounded-xl bg-card border border-border">
                                <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded-lg" />
                            </div>
                        )}

                        <div className="p-6 rounded-xl bg-card border border-border space-y-4">
                            <h3 className="font-semibold">Target Dimensions</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm text-muted-foreground mb-2 block">Width (px)</label>
                                    <input
                                        type="number"
                                        value={width}
                                        onChange={(e) => setWidth(Number(e.target.value))}
                                        className="w-full p-3 rounded-lg bg-background border border-border"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-muted-foreground mb-2 block">Height (px)</label>
                                    <input
                                        type="number"
                                        value={height}
                                        onChange={(e) => setHeight(Number(e.target.value))}
                                        className="w-full p-3 rounded-lg bg-background border border-border"
                                    />
                                </div>
                            </div>
                        </div>

                        <Button onClick={handleResize} disabled={processing} className="w-full h-12">
                            {processing ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Resizing...
                                </>
                            ) : (
                                'Downscale Image'
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
                                    <span className="font-semibold text-green-600">Image Resized!</span>
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
