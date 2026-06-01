'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export default function CustomDialog({
    isOpen,
    onClose,
    onConfirm,
    title = 'Confirm',
    message,
    type = 'confirm', // 'confirm' or 'alert'
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'default' // 'default' or 'danger'
}) {
    const [mounted, setMounted] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (isOpen) {
            setIsAnimating(true);
            // Prevent body scroll when dialog is open
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                handleClose();
            }
        };

        const handleEnter = (e) => {
            if (e.key === 'Enter' && isOpen && type === 'confirm') {
                handleConfirm();
            }
        };

        document.addEventListener('keydown', handleEscape);
        document.addEventListener('keydown', handleEnter);

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.removeEventListener('keydown', handleEnter);
        };
    }, [isOpen, type]);

    const handleClose = () => {
        setIsAnimating(false);
        setTimeout(() => {
            onClose();
        }, 200); // Match animation duration
    };

    const handleConfirm = () => {
        setIsAnimating(false);
        setTimeout(() => {
            onConfirm?.();
            onClose();
        }, 200);
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget && type === 'alert') {
            handleClose();
        }
    };

    if (!mounted || !isOpen) return null;

    const dialogContent = (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-200 ${isAnimating ? 'opacity-100' : 'opacity-0'
                }`}
            onClick={handleBackdropClick}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

            {/* Dialog */}
            <div
                className={`relative w-full max-w-md transform transition-all duration-200 ${isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
                    }`}
            >
                {/* Container */}
                <div className="relative overflow-hidden rounded-2xl bg-card border border-border shadow-2xl">
                    {/* Content */}
                    <div className="relative p-6">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                {title}
                            </h3>
                                <button
                                onClick={handleClose}
                                className="text-muted-foreground hover:text-foreground transition-colors"
                                aria-label="Close dialog"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Message */}
                        <div className="mb-6">
                            <p className="text-muted-foreground leading-relaxed">
                                {message}
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 justify-end">
                            {type === 'confirm' && (
                                <button
                                    onClick={handleClose}
                                    className="px-5 py-2.5 rounded-lg font-medium text-secondary-foreground bg-secondary hover:bg-secondary/80 transition-all duration-200 border border-border"
                                >
                                    {cancelText}
                                </button>
                            )}
                            <button
                                onClick={type === 'confirm' ? handleConfirm : handleClose}
                                className={`px-5 py-2.5 rounded-lg font-medium text-white transition-all duration-200 ${variant === 'danger'
                                        ? 'bg-destructive hover:bg-destructive/90'
                                        : 'bg-primary hover:bg-primary/90'
                                    }`}
                            >
                                {type === 'confirm' ? confirmText : 'OK'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return createPortal(dialogContent, document.body);
}
