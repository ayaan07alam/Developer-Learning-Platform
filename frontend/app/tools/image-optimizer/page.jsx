"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Download, Image as ImageIcon, Check, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ImageConverterPage() {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState('');
    const [format, setFormat] = useState('png');
    const [converting, setConverting] = useState(false);
    const [converted, setConverted] = useState(null);
    const [error, setError] = useState('');

    const formats = [
        { id: 'png', name: 'PNG', color: 'from-blue-500 to-cyan-500' },
        { id: 'jpg', name: 'JPG', color: 'from-green-500 to-emerald-500' },
        { id: 'webp', name: 'WEBP', color: 'from-purple-500 to-pink-500' },
    ];

    const handleFileChange = (e) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            if (!selectedFile.type.startsWith('image/')) {
                setError('Please select an image file');
                return;
            }

            setFile(selectedFile);
            setError('');
            setConverted(null);

            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => setPreview(e.target.result);
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleConvert = async () => {
        if (!file) {
            setError('Please select a file first');
            return;
        }

        setConverting(true);
        setError('');

        const formData = new FormData();
        formData.append('file', file);
        formData.append('format', format);

        try {
            const response = await fetch('http://localhost:8080/api/tools/images/convert', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Conversion failed');
            }

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            setConverted(url);
        } catch (err) {
            setError('Failed to convert image. Please try again.');
            console.error(err);
        } finally {
            setConverting(false);
        }
    };

    const downloadConverted = () => {
        if (!converted) return;

        const link = document.createElement('a');
        link.href = converted;
        link.download = `converted.${format}`;
        link.click();
    };

    const reset = () => {
        setFile(null);
        setPreview('');
        setConverted(null);
        setError('');
    };

    return (
        <div className="min-h-screen bg-background pt-24 pb-12">
            <div className="container mx-auto px-6 max-w-4xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold mb-3">Image Format Converter</h1>
                    <p className="text-muted-foreground text-lg">
                        Convert images between PNG, JPG, and WEBP formats instantly
                    </p>
                </motion.div>

                {/* Format Selection */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="flex justify-center gap-3 mb-8"
                >
                    <span className="text-sm text-muted-foreground my-auto mr-2">Convert to:</span>
                    {formats.map((fmt) => (
                        <button
                            key={fmt.id}
                            onClick={() => setFormat(fmt.id)}
                            className={`px-6 py-2.5 rounded-lg font-medium transition-all ${format === fmt.id
                                    ? `bg-gradient-to-r ${fmt.color} text-white shadow-lg`
                                    : 'bg-card border border-border hover:border-primary'
                                }`}
                        >
                            {fmt.name}
                        </button>
                    ))}
                </motion.div>

                {/* Upload Area */}
                {!file ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <label
                            htmlFor="file-upload"
                            className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-border rounded-xl cursor-pointer bg-card hover:bg-accent/50 transition-all"
                        >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-12 h-12 mb-4 text-muted-foreground" />
                                <p className="mb-2 text-lg font-semibold">Click to upload image</p>
                                <p className="text-sm text-muted-foreground">
                                    PNG, JPG, GIF, BMP or WEBP
                                </p>
                            </div>
                            <input
                                id="file-upload"
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </label>
                    </motion.div>
                ) : (
                    <div className="space-y-6">
                        {/* Preview */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="p-6 rounded-xl bg-card border border-border"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="font-semibold mb-1">Selected Image</h3>
                                    <p className="text-sm text-muted-foreground">{file.name}</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {(file.size / 1024).toFixed(2)} KB
                                    </p>
                                </div>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={reset}
                                    className="text-red-500 hover:text-red-600"
                                >
                                    <X className="w-4 h-4 mr-2" />
                                    Remove
                                </Button>
                            </div>

                            {preview && (
                                <div className="relative w-full h-48 bg-muted rounded-lg overflow-hidden">
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                            )}
                        </motion.div>

                        {/* Convert Button */}
                        <div className="flex gap-3">
                            <Button
                                onClick={handleConvert}
                                disabled={converting}
                                className="flex-1 h-12 text-lg"
                            >
                                {converting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        Converting...
                                    </>
                                ) : (
                                    <>
                                        Convert to {format.toUpperCase()}
                                    </>
                                )}
                            </Button>
                        </div>

                        {/* Result */}
                        {converted && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-6 rounded-xl bg-green-500/10 border border-green-500/50"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-3">
                                        <Check className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                                        <div>
                                            <h3 className="font-semibold text-green-600 mb-1">
                                                Conversion Successful!
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                Your image has been converted to {format.toUpperCase()}
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        onClick={downloadConverted}
                                        className="bg-green-600 hover:bg-green-700"
                                    >
                                        <Download className="w-4 h-4 mr-2" />
                                        Download
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </div>
                )}

                {/* Error */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-6 p-4 rounded-lg bg-red-500/10 border border-red-500/50 text-red-600"
                    >
                        {error}
                    </motion.div>
                )}

                {/* Info */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-8 p-6 rounded-xl bg-primary/10 border border-primary/20"
                >
                    <h3 className="font-semibold mb-3">Supported Formats</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                        <div>
                            <strong className="text-foreground">PNG:</strong> Best for graphics, logos, transparency
                        </div>
                        <div>
                            <strong className="text-foreground">JPG:</strong> Best for photos, smaller file sizes
                        </div>
                        <div>
                            <strong className="text-foreground">WEBP:</strong> Modern format, best compression
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
