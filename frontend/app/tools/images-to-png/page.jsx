"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon, Upload, Download, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { API_BASE_URL } from '@/lib/api-client';

export default function ImagesToPNGPage() {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState('');
    const [converting, setConverting] = useState(false);
    const [converted, setConverted] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile && selectedFile.type.startsWith('image/')) {
            setFile(selectedFile);
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleConvert = async () => {
        if (!file) return;
        setConverting(true);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('format', 'png');

        try {
            const response = await fetch(`${API_BASE_URL}/api/tools/images/convert`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Conversion failed');

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            setConverted(url);
        } catch (err) {
            console.error(err);
        } finally {
            setConverting(false);
        }
    };

    const downloadImage = () => {
        if (!converted) return;
        const link = document.createElement('a');
        link.href = converted;
        link.download = 'converted.png';
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
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold mb-3">Images to PNG</h1>
                    <p className="text-muted-foreground text-lg">
                        Convert any image format to PNG
                    </p>
                </motion.div>

                {!file ? (
                    <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-border rounded-xl cursor-pointer bg-card hover:bg-accent/50 transition-all">
                        <Upload className="w-12 h-12 mb-4 text-muted-foreground" />
                        <p className="mb-2 text-lg font-semibold">Click to upload image</p>
                        <p className="text-sm text-muted-foreground">JPG, WEBP, GIF, BMP supported</p>
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

                        <Button onClick={handleConvert} disabled={converting} className="w-full h-12">
                            {converting ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Converting...
                                </>
                            ) : (
                                'Convert to PNG'
                            )}
                        </Button>

                        {converted && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="p-6 rounded-xl bg-green-500/10 border border-green-500/50 flex items-center justify-between"
                            >
                                <div className="flex items-center gap-3">
                                    <Check className="w-6 h-6 text-green-600" />
                                    <span className="font-semibold text-green-600">Converted to PNG!</span>
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
