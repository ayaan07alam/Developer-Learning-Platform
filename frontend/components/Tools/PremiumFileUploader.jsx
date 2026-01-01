"use client";
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, File, Check, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function PremiumFileUploader({
    onFileSelect,
    accept,
    maxSize = 10 * 1024 * 1024, // 10MB default
    label = "Click to upload file",
    subLabel = "Drag and drop or click to select",
    icon: Icon = Upload,
    className,
    multiple = false
}) {
    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (files && files.length > 0) handleFiles(files);
    };

    const handleFiles = (fileList) => {
        setError('');
        const files = multiple ? Array.from(fileList) : [fileList[0]];

        // Validate files
        for (const file of files) {
            // Validate type if accept prop is present
            if (accept) {
                const acceptedTypes = accept.split(',').map(t => t.trim());
                const fileType = file.type;
                const fileName = file.name.toLowerCase();

                const isValid = acceptedTypes.some(type => {
                    if (type.startsWith('.')) return fileName.endsWith(type.toLowerCase());
                    if (type.endsWith('/*')) return fileType.startsWith(type.replace('/*', ''));
                    return fileType === type;
                });

                if (!isValid) {
                    setError(multiple ? `Invalid file type: ${file.name}` : 'Invalid file type');
                    return;
                }
            }

            // Validate size
            if (file.size > maxSize) {
                setError(multiple ? `File too large: ${file.name}` : `File size must be less than ${maxSize / 1024 / 1024}MB`);
                return;
            }
        }

        // Simulate upload animation
        setUploading(true);
        setProgress(0);

        const duration = 1500; // 1.5s animation
        const interval = 50;
        const steps = duration / interval;
        let currentStep = 0;

        const timer = setInterval(() => {
            currentStep++;
            const newProgress = Math.min((currentStep / steps) * 100, 100);
            setProgress(newProgress);

            if (currentStep >= steps) {
                clearInterval(timer);
                setTimeout(() => {
                    setUploading(false);
                    onFileSelect({ target: { files: files } });
                }, 200);
            }
        }, interval);
    };

    return (
        <div className={cn("w-full", className)}>
            <AnimatePresence mode="wait">
                {uploading ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="h-64 rounded-xl border-2 border-primary/20 bg-primary/5 flex flex-col items-center justify-center p-8 relative overflow-hidden"
                    >
                        {/* Progress Background */}
                        <motion.div
                            className="absolute bottom-0 left-0 h-1 bg-primary/20 w-full"
                        >
                            <motion.div
                                className="h-full bg-primary"
                                style={{ width: `${progress}%` }}
                            />
                        </motion.div>

                        <div className="relative z-10 text-center">
                            <motion.div
                                animate={{
                                    scale: [1, 1.1, 1],
                                    rotate: [0, 5, -5, 0]
                                }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="mb-4 inline-block"
                            >
                                <File className="w-12 h-12 text-primary" />
                            </motion.div>
                            <h3 className="text-xl font-bold text-primary mb-2">
                                {progress < 100 ? 'Scanning File...' : 'Ready!'}
                            </h3>
                            <p className="text-muted-foreground font-mono">
                                {Math.round(progress)}%
                            </p>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                    >
                        <label
                            htmlFor="premium-upload"
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={cn(
                                "flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 relative overflow-hidden group",
                                isDragging
                                    ? "border-primary bg-primary/10 scale-[1.02]"
                                    : "border-border bg-card hover:border-primary/50 hover:bg-accent/50",
                                error ? "border-red-500/50 bg-red-500/5" : ""
                            )}
                        >
                            {/* Background decoration */}
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="flex flex-col items-center justify-center pt-5 pb-6 relative z-10 p-6 text-center">
                                <motion.div
                                    animate={isDragging ? { y: -10, scale: 1.1 } : { y: 0, scale: 1 }}
                                    className={cn(
                                        "w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-colors",
                                        isDragging ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                                    )}
                                >
                                    <Icon className="w-8 h-8" />
                                </motion.div>
                                <p className="mb-2 text-lg font-semibold text-foreground">
                                    {label}
                                </p>
                                <p className="text-sm text-muted-foreground max-w-xs">
                                    {subLabel}
                                </p>
                                {error && (
                                    <motion.p
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-4 text-sm font-medium text-red-500 bg-red-500/10 px-3 py-1 rounded-full"
                                    >
                                        {error}
                                    </motion.p>
                                )}
                            </div>
                            <input
                                ref={fileInputRef}
                                id="premium-upload"
                                type="file"
                                className="hidden"
                                accept={accept}
                                multiple={multiple}
                                onChange={(e) => {
                                    if (e.target.files?.length > 0) handleFiles(e.target.files);
                                }}
                            />
                        </label>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
