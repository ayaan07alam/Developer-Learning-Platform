"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Users, FileText, Database, Settings, Shield, Activity, BarChart3, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
    const router = useRouter();
    const { user, loading, isAdmin, isEditor, isReviewer } = useAuth();
    const [stats, setStats] = useState({
        users: 0,
        posts: 0,
        comments: 0
    });

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push('/login');
                return;
            }

            // Redirect based on role if NOT admin
            if (!isAdmin) {
                if (isEditor) {
                    router.push('/dashboard/editor');
                } else if (isReviewer) {
                    router.push('/dashboard/reviewer');
                } else {
                    router.push('/dashboard/profile');
                }
            } else {
                fetchStats();
            }
        }
    }, [user, loading, isAdmin, isEditor, isReviewer]);

    const fetchStats = async () => {
        // Mock stats for now or fetch from API
        // In a real app, I'd fetch /api/admin/stats
        setStats({
            users: 120,
            posts: 45,
            comments: 328
        });
    };

    if (loading || (!isAdmin && user)) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!isAdmin) return null;

    return (
        <div className="min-h-screen pt-24 pb-12 bg-background">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
                        <p className="text-muted-foreground">System overview and management</p>
                    </div>
                    <div className="bg-primary/10 text-primary px-4 py-2 rounded-full font-medium flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Administrator
                    </div>
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="p-6 rounded-xl bg-card border border-border">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-muted-foreground">Total Users</span>
                            <Users className="w-5 h-5 text-blue-500" />
                        </div>
                        <p className="text-3xl font-bold">{stats.users}</p>
                    </div>
                    <div className="p-6 rounded-xl bg-card border border-border">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-muted-foreground">Total Posts</span>
                            <FileText className="w-5 h-5 text-green-500" />
                        </div>
                        <p className="text-3xl font-bold">{stats.posts}</p>
                    </div>
                    <div className="p-6 rounded-xl bg-card border border-border">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-muted-foreground">Comments</span>
                            <MessageSquare className="w-5 h-5 text-purple-500" />
                        </div>
                        <p className="text-3xl font-bold">{stats.comments}</p>
                    </div>
                    <div className="p-6 rounded-xl bg-card border border-border">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-muted-foreground">System Health</span>
                            <Activity className="w-5 h-5 text-red-500" />
                        </div>
                        <p className="text-3xl font-bold text-green-500">Good</p>
                    </div>
                </div>

                {/* Management Links */}
                <h2 className="text-2xl font-bold mb-4">Management Modules</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <Link href="/dashboard/users" className="p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all group hover:shadow-lg">
                        <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
                            <Users className="w-6 h-6 text-blue-500" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">User Management</h3>
                        <p className="text-muted-foreground">Manage users, roles, and permissions</p>
                    </Link>

                    <Link href="/dashboard/posts" className="p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all group hover:shadow-lg">
                        <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-4 group-hover:bg-green-500/20 transition-colors">
                            <FileText className="w-6 h-6 text-green-500" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Content Management</h3>
                        <p className="text-muted-foreground">Create, edit, and moderate blog posts</p>
                    </Link>

                    <Link href="/dashboard/reviewer" className="p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all group hover:shadow-lg">
                        <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition-colors">
                            <Settings className="w-6 h-6 text-purple-500" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Review Queue</h3>
                        <p className="text-muted-foreground">Approve or reject pending posts</p>
                    </Link>

                    <Link href="/dashboard/categories" className="p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all group hover:shadow-lg">
                        <div className="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center mb-4 group-hover:bg-orange-500/20 transition-colors">
                            <Database className="w-6 h-6 text-orange-500" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Categories</h3>
                        <p className="text-muted-foreground">Manage blog categories and tags</p>
                    </Link>
                </div>
            </div>
        </div>
    );
}
