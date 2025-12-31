"use client";
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export default function ProcessingOverlay({ isProcessing, message = "Processing your file..." }) {
    if (!isProcessing) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center rounded-xl"
            >
                <div className="relative">
                    {/* Outer ring */}
                    <motion.div
                        className="w-20 h-20 border-4 border-primary/30 rounded-full"
                        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />

                    {/* Spinning ring */}
                    <motion.div
                        className="absolute inset-0 w-20 h-20 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />

                    {/* Icon in center */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    </div>
                </div>

                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-6 text-lg font-medium text-primary animate-pulse"
                >
                    {message}
                </motion.p>

                <p className="mt-2 text-sm text-muted-foreground">This may take a few seconds</p>
            </motion.div>
        </AnimatePresence>
    );
}
