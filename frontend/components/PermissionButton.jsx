"use client";
import { useAuth } from '@/contexts/AuthContext';

/**
 * PermissionButton component that auto-hides based on permission check
 * 
 * Usage:
 * <PermissionButton 
 *   permission="canEditPost"
 *   onClick={handleEdit}
 *   className="btn-primary"
 * >
 *   Edit Post
 * </PermissionButton>
 */
export default function PermissionButton({
    children,
    permission,
    onClick,
    className = '',
    disabled = false,
    ...props
}) {
    const auth = useAuth();

    // Check if user has permission
    const hasPermission = auth[permission] && auth[permission]();

    if (!hasPermission) {
        return null; // Hide button if no permission
    }

    return (
        <button
            onClick={onClick}
            className={className}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
}
