"use client";
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon, Upload, Download, Type } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function WatermarkImagesPage() {
    const [image, setImage] = useState(null);
    const [watermarkText, setWatermarkText] = useState('WATERMARK');
    const [watermarkedImage, setWatermarkedImage] = useState(null);
    const canvasRef = useRef(null);

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setImage(event.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const applyWatermark = () => {
        if (!image) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;

            // Draw original image
            ctx.drawImage(img, 0, 0);

            // Add watermark
            ctx.font = `${img.width / 15}px Arial`;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            // Rotate for diagonal watermark
            ctx.save();
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate(-Math.PI / 4);
            ctx.fillText(watermarkText, 0, 0);
            ctx.restore();

            const watermarked = canvas.toDataURL('image/png');
            setWatermarkedImage(watermarked);
        };

        img.src = image;
    };

    const downloadWatermarked = () => {
        if (!watermarkedImage) return;
        const link = document.createElement('a');
        link.href = watermarkedImage;
        link.download = 'watermarked-image.png';
        link.click();
    };

    return (
        <div className="min-h-screen bg-background pt-24 pb-12">
            <div className="container mx-auto px-6 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold mb-3">Watermark Images</h1>
                    <p className="text-muted-foreground text-lg">
                        Add watermarks to protect your images
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Upload Section */}
                    <div className="space-y-4">
                        {!image ? (
                            <label className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-border rounded-xl cursor-pointer bg-card hover:bg-accent/50 transition-all">
                                <Upload className="w-12 h-12 mb-4 text-muted-foreground" />
                                <p className="mb-2 text-lg font-semibold">Upload Image</p>
                                <p className="text-sm text-muted-foreground">All formats supported</p>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </label>
                        ) : (
                            <div className="p-4 rounded-xl bg-card border border-border">
                                <img src={image} alt="Original" className="w-full rounded-lg" />
                            </div>
                        )}

                        {image && (
                            <div className="space-y-3">
                                <div>
                                    <label className="text-sm text-muted-foreground mb-2 block flex items-center gap-2">
                                        <Type className="w-4 h-4" />
                                        Watermark Text
                                    </label>
                                    <input
                                        type="text"
                                        value={watermarkText}
                                        onChange={(e) => setWatermarkText(e.target.value)}
                                        className="w-full p-3 rounded-lg bg-background border border-border"
                                        placeholder="Enter watermark text"
                                    />
                                </div>

                                <Button onClick={applyWatermark} className="w-full">
                                    Apply Watermark
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Preview Section */}
                    <div className="space-y-4">
                        {watermarkedImage ? (
                            <>
                                <div className="p-4 rounded-xl bg-card border border-border">
                                    <img src={watermarkedImage} alt="Watermarked" className="w-full rounded-lg" />
                                </div>
                                <Button onClick={downloadWatermarked} className="w-full bg-green-600 hover:bg-green-700">
                                    <Download className="w-4 h-4 mr-2" />
                                    Download Watermarked Image
                                </Button>
                            </>
                        ) : (
                            <div className="flex items-center justify-center h-64 border-2 border-dashed border-border rounded-xl bg-card">
                                <p className="text-muted-foreground">Watermarked preview will appear here</p>
                            </div>
                        )}
                    </div>
                </div>

                <canvas ref={canvasRef} className="hidden" />
            </div>
        </div>
    );
}
