"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Users as UsersIcon, Shield, Trash2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function UsersPage() {
    const router = useRouter();
    const { user, token, isAuthenticated } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [updatingUserId, setUpdatingUserId] = useState(null);

    useEffect(() => {
        if (!isAuthenticated || user?.role !== 'ADMIN') {
            router.push('/');
            return;
        }
        fetchUsers();
    }, [isAuthenticated, user, router]);

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/users', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }

            const data = await response.json();
            setUsers(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const updateUserRole = async (userId, newRole) => {
        setUpdatingUserId(userId);
        try {
            const response = await fetch(`http://localhost:8080/api/users/${userId}/role`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ role: newRole })
            });

            if (!response.ok) {
                throw new Error('Failed to update role');
            }

            const updatedUser = await response.json();
            setUsers(users.map(u => u.id === userId ? updatedUser : u));
        } catch (err) {
            setError(err.message);
        } finally {
            setUpdatingUserId(null);
        }
    };

    const deleteUser = async (userId) => {
        if (!confirm('Are you sure you want to delete this user?')) return;

        try {
            const response = await fetch(`http://localhost:8080/api/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete user');
            }

            setUsers(users.filter(u => u.id !== userId));
        } catch (err) {
            setError(err.message);
        }
    };

    const getRoleBadgeColor = (role) => {
        switch (role) {
            case 'ADMIN': return 'bg-red-500/10 text-red-500 border-red-500/50';
            case 'EDITOR': return 'bg-blue-500/10 text-blue-500 border-blue-500/50';
            case 'REVIEWER': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/50';
            case 'VIEWER': return 'bg-gray-500/10 text-gray-500 border-gray-500/50';
            default: return 'bg-gray-500/10 text-gray-500 border-gray-500/50';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-24 pb-12 bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading users...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 bg-background">
            <div className="container mx-auto px-6">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <UsersIcon className="w-8 h-8 text-primary" />
                        <h1 className="text-3xl font-bold">User Management</h1>
                    </div>
                    <p className="text-muted-foreground">
                        Manage user roles and permissions
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500">
                        {error}
                    </div>
                )}

                {/* Users Table */}
                <div className="bg-card border border-border rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-muted/50 border-b border-border">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">User</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Email</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Role</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Joined</th>
                                    <th className="px-6 py-4 text-right text-sm font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {users.map((u) => (
                                    <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <span className="text-primary font-semibold">
                                                        {u.displayName?.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <div>
                                                    <div className="font-medium">{u.displayName}</div>
                                                    {u.id === user?.id && (
                                                        <span className="text-xs text-muted-foreground">(You)</span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">{u.email}</td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={u.role}
                                                onChange={(e) => updateUserRole(u.id, e.target.value)}
                                                disabled={u.id === user?.id || updatingUserId === u.id}
                                                className={`px-3 py-1 rounded-full border text-sm font-medium ${getRoleBadgeColor(u.role)} bg-transparent cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
                                            >
                                                <option value="ADMIN">ADMIN</option>
                                                <option value="EDITOR">EDITOR</option>
                                                <option value="REVIEWER">REVIEWER</option>
                                                <option value="VIEWER">VIEWER</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground text-sm">
                                            {new Date(u.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {u.id !== user?.id && (
                                                <Button
                                                    onClick={() => deleteUser(u.id)}
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Stats */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-card border border-border rounded-lg p-4">
                        <div className="text-2xl font-bold text-red-500">
                            {users.filter(u => u.role === 'ADMIN').length}
                        </div>
                        <div className="text-sm text-muted-foreground">Admins</div>
                    </div>
                    <div className="bg-card border border-border rounded-lg p-4">
                        <div className="text-2xl font-bold text-blue-500">
                            {users.filter(u => u.role === 'EDITOR').length}
                        </div>
                        <div className="text-sm text-muted-foreground">Editors</div>
                    </div>
                    <div className="bg-card border border-border rounded-lg p-4">
                        <div className="text-2xl font-bold text-yellow-500">
                            {users.filter(u => u.role === 'REVIEWER').length}
                        </div>
                        <div className="text-sm text-muted-foreground">Reviewers</div>
                    </div>
                    <div className="bg-card border border-border rounded-lg p-4">
                        <div className="text-2xl font-bold text-gray-500">
                            {users.filter(u => u.role === 'VIEWER').length}
                        </div>
                        <div className="text-sm text-muted-foreground">Viewers</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
