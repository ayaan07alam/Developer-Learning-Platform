'use client';

import { useState, useCallback } from 'react';

/**
 * Custom hook for showing dialogs
 * Returns methods to show confirm and alert dialogs
 * 
 * @example
 * const { showConfirm, showAlert } = useDialog();
 * 
 * // Confirm dialog
 * const confirmed = await showConfirm('Delete this post?');
 * if (confirmed) {
 *   // Delete logic
 * }
 * 
 * // Alert dialog
 * await showAlert('Post deleted successfully!');
 */
export function useDialog() {
    const [dialogState, setDialogState] = useState({
        isOpen: false,
        type: 'confirm',
        title: '',
        message: '',
        confirmText: 'Confirm',
        cancelText: 'Cancel',
        variant: 'default',
        resolve: null,
    });

    const showConfirm = useCallback((message, options = {}) => {
        return new Promise((resolve) => {
            setDialogState({
                isOpen: true,
                type: 'confirm',
                title: options.title || 'Confirm',
                message,
                confirmText: options.confirmText || 'Confirm',
                cancelText: options.cancelText || 'Cancel',
                variant: options.variant || 'default',
                resolve,
            });
        });
    }, []);

    const showAlert = useCallback((message, options = {}) => {
        return new Promise((resolve) => {
            setDialogState({
                isOpen: true,
                type: 'alert',
                title: options.title || 'Alert',
                message,
                confirmText: 'OK',
                cancelText: '',
                variant: options.variant || 'default',
                resolve,
            });
        });
    }, []);

    const handleClose = useCallback(() => {
        setDialogState((prev) => {
            if (prev.resolve) {
                prev.resolve(false);
            }
            return { ...prev, isOpen: false };
        });
    }, []);

    const handleConfirm = useCallback(() => {
        setDialogState((prev) => {
            if (prev.resolve) {
                prev.resolve(true);
            }
            return { ...prev, isOpen: false };
        });
    }, []);

    return {
        showConfirm,
        showAlert,
        dialogState,
        handleClose,
        handleConfirm,
    };
}
