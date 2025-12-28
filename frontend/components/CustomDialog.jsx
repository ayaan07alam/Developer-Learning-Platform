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
                {/* Glassmorphism Container */}
                <div className="relative overflow-hidden rounded-2xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-2xl">
                    {/* Gradient Border Effect */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-violet-500/20 opacity-50" />

                    {/* Content */}
                    <div className="relative p-6">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                {title}
                            </h3>
                            <button
                                onClick={handleClose}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                aria-label="Close dialog"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Message */}
                        <div className="mb-6">
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                {message}
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 justify-end">
                            {type === 'confirm' && (
                                <button
                                    onClick={handleClose}
                                    className="px-5 py-2.5 rounded-lg font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 border border-gray-300 dark:border-gray-600"
                                >
                                    {cancelText}
                                </button>
                            )}
                            <button
                                onClick={type === 'confirm' ? handleConfirm : handleClose}
                                className={`px-5 py-2.5 rounded-lg font-medium text-white transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 ${variant === 'danger'
                                        ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
                                        : 'bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700'
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
