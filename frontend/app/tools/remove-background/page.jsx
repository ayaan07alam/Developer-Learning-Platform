"use client";
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon, Upload, Download, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProcessingOverlay from '@/components/Tools/ProcessingOverlay';

export default function RemoveBackgroundPage() {
    const [image, setImage] = useState(null);
    const [processedImage, setProcessedImage] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
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

    const removeBackground = () => {
        if (!image) return;
        setIsProcessing(true);

        // Basic implementation - creates a green screen effect
        // Real background removal requires ML models like rembg

        // Simulate processing delay for better UX
        setTimeout(() => {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            const img = new Image();

            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;

                // Simple threshold-based background removal (demo only)
                for (let i = 0; i < data.length; i += 4) {
                    const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
                    if (brightness > 200) {
                        data[i + 3] = 0; // Make white/bright areas transparent
                    }
                }

                ctx.putImageData(imageData, 0, 0);
                const result = canvas.toDataURL('image/png');
                setProcessedImage(result);
                setIsProcessing(false);
            };

            img.src = image;
        }, 2000);
    };

    const downloadImage = () => {
        if (!processedImage) return;
        const link = document.createElement('a');
        link.href = processedImage;
        link.download = 'no-background.png';
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
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-teal-500 to-green-500 flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold mb-3">Remove Background</h1>
                    <p className="text-muted-foreground text-lg">
                        Remove image backgrounds automatically
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-6 relative rounded-xl overflow-hidden">
                    <ProcessingOverlay isProcessing={isProcessing} message="Removing background..." />

                    <div>
                        {!image ? (
                            <label className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-border rounded-xl cursor-pointer bg-card hover:bg-accent/50 transition-all">
                                <Upload className="w-12 h-12 mb-4 text-muted-foreground" />
                                <p className="mb-2 text-lg font-semibold">Upload Image</p>
                                <p className="text-sm text-muted-foreground">PNG, JPG, WEBP</p>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </label>
                        ) : (
                            <div className="p-4 rounded-xl bg-card border border-border">
                                <h3 className="font-semibold mb-3">Original:</h3>
                                <img src={image} alt="Original" className="w-full rounded-lg" />
                            </div>
                        )}

                        {image && (
                            <Button onClick={removeBackground} disabled={isProcessing} className="w-full mt-4">
                                <Wand2 className="w-4 h-4 mr-2" />
                                {isProcessing ? 'Processing...' : 'Remove Background'}
                            </Button>
                        )}
                    </div>

                    <div>
                        {processedImage ? (
                            <>
                                <div className="p-4 rounded-xl bg-card border border-border">
                                    <h3 className="font-semibold mb-3">Result:</h3>
                                    <div className="bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjZjBmMGYwIi8+PHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiNmMGYwZjAiLz48L3N2Zz4=')] rounded-lg">
                                        <img src={processedImage} alt="Processed" className="w-full rounded-lg" />
                                    </div>
                                </div>
                                <Button onClick={downloadImage} className="w-full mt-4 bg-green-600 hover:bg-green-700">
                                    <Download className="w-4 h-4 mr-2" />
                                    Download
                                </Button>
                            </>
                        ) : (
                            <div className="flex items-center justify-center h-64 border-2 border-dashed border-border rounded-xl bg-card">
                                <p className="text-muted-foreground">Processed image will appear here</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-8 p-6 rounded-xl bg-yellow-500/10 border border-yellow-500/50">
                    <p className="text-sm text-muted-foreground">
                        <strong>Note:</strong> This is a basic demo using threshold-based removal. For AI-powered background removal with accurate edge detection,
                        use specialized services like remove.bg or implement ML models like U2-Net/rembg.
                    </p>
                </div>

                <canvas ref={canvasRef} className="hidden" />
            </div>
        </div>
    );
}
