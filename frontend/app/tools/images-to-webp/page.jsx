"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon, Upload, Download, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ImagesToWEBPPage() {
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
        formData.append('format', 'webp');

        try {
            const response = await fetch('http://localhost:8080/api/tools/images/convert', {
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
        link.download = 'converted.webp';
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
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold mb-3">Images to WEBP</h1>
                    <p className="text-muted-foreground text-lg">
                        Convert images to modern WEBP format
                    </p>
                </motion.div>

                {!file ? (
                    <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-border rounded-xl cursor-pointer bg-card hover:bg-accent/50 transition-all">
                        <Upload className="w-12 h-12 mb-4 text-muted-foreground" />
                        <p className="mb-2 text-lg font-semibold">Click to upload image</p>
                        <p className="text-sm text-muted-foreground">PNG, JPG, GIF, BMP supported</p>
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
                                'Convert to WEBP'
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
                                    <span className="font-semibold text-green-600">Converted to WEBP!</span>
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
