"use client";
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Image as ImageIcon, Copy, Check, Trash2, RefreshCw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { API_BASE_URL } from '@/lib/api-client';

export default function MediaLibrary({ onSelect, isModal = false }) {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [copiedUrl, setCopiedUrl] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/media`);
            if (response.ok) {
                const data = await response.json();
                // data is array of strings (URLs)
                setImages(data);
            }
        } catch (error) {
            console.error("Failed to fetch images", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(`${API_BASE_URL}/api/media/upload`, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                await fetchImages(); // Refresh list
            } else {
                alert('Upload failed');
            }
        } catch (error) {
            console.error("Upload error", error);
            alert('Upload error');
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleImageClick = (url) => {
        if (isModal && onSelect) {
            onSelect(url);
        } else {
            copyToClipboard(url);
        }
    }

    const copyToClipboard = (url) => {
        navigator.clipboard.writeText(url);
        setCopiedUrl(url);
        setTimeout(() => setCopiedUrl(null), 2000);
        if (onSelect && !isModal) {
            onSelect(url);
        }
    };

    return (
        <div className="space-y-6">
            {!isModal && (
                <div className="flex items-center justify-between p-6 bg-card border border-border rounded-xl">
                    <div>
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <ImageIcon className="w-6 h-6 text-primary" />
                            Media Library
                        </h2>
                        <p className="text-muted-foreground">Upload and manage images for your blogs</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" size="icon" onClick={fetchImages}>
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        </Button>
                        <div className="relative">
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                ref={fileInputRef}
                                onChange={handleUpload}
                            />
                            <Button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                                className="bg-primary text-white shadow-lg shadow-primary/20"
                            >
                                {uploading ? (
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                    <Upload className="w-4 h-4 mr-2" />
                                )}
                                {uploading ? 'Uploading...' : 'Upload Image'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {isModal && (
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Select Image</h3>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={fetchImages}>
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        </Button>
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleUpload}
                        />
                        <Button
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                        >
                            {uploading ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Upload className="w-3 h-3 mr-1" />}
                            Upload
                        </Button>
                    </div>
                </div>
            )}

            {loading && images.length === 0 ? (
                <div className="text-center py-20">
                    <Loader2 className="w-10 h-10 animate-spin mx-auto text-primary" />
                    <p className="text-muted-foreground mt-4">Loading media...</p>
                </div>
            ) : images.length === 0 ? (
                <div className="text-center py-10 border-2 border-dashed border-border rounded-xl bg-card/50">
                    <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                    <p className="text-lg font-semibold">No images found</p>
                    <Button variant="outline" className="mt-4" onClick={() => fileInputRef.current?.click()}>
                        Upload Image
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <AnimatePresence>
                        {images.map((url, index) => (
                            <motion.div
                                key={url}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                                className="group relative aspect-video bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer"
                                onClick={() => handleImageClick(url)}
                            >
                                <img
                                    src={url}
                                    alt="Uploaded media"
                                    className="w-full h-full object-cover"
                                />

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        className="h-9 px-4 font-medium"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleImageClick(url);
                                        }}
                                    >
                                        {isModal ? (
                                            <>
                                                <Check className="w-4 h-4 mr-2" />
                                                Select
                                            </>
                                        ) : (
                                            copiedUrl === url ? (
                                                <>
                                                    <Check className="w-4 h-4 mr-2 text-green-600" />
                                                    Copied
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="w-4 h-4 mr-2" />
                                                    Copy URL
                                                </>
                                            )
                                        )}
                                    </Button>
                                </div>

                                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                    <p className="text-xs text-white truncate px-1">
                                        {url.split('/').pop()}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
