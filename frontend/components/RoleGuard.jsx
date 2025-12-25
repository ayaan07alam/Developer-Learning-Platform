"use client";
import { useAuth } from '@/contexts/AuthContext';

/**
 * RoleGuard component for conditional rendering based on user roles
 * 
 * Usage:
 * <RoleGuard allowedRoles={['ADMIN', 'EDITOR']}>
 *   <EditButton />
 * </RoleGuard>
 * 
 * Or with fallback:
 * <RoleGuard allowedRoles={['ADMIN']} fallback={<p>Access denied</p>}>
 *   <AdminPanel />
 * </RoleGuard>
 */
export default function RoleGuard({ children, allowedRoles, fallback = null }) {
    const { user, loading } = useAuth();

    if (loading) {
        return null; // or a loading spinner
    }

    if (!user) {
        return fallback;
    }

    const hasPermission = allowedRoles.includes(user.role);

    if (!hasPermission) {
        return fallback;
    }

    return <>{children}</>;
}
