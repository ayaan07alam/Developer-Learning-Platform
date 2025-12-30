"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from "@/components/sidebar";
import ImprovementDraftsSection from "@/components/ImprovementDraftsSection";
import ContentManagementSection from "@/components/ContentManagementSection";
import { FileText, Users, FolderOpen, Plus, Edit, Eye, Clock } from 'lucide-react';
import PostStatusBadge from '@/components/PostStatusBadge';
import Link from 'next/link';
import { API_BASE_URL } from '@/lib/api-client';

export default function EditorDashboard() {
    const router = useRouter();
    const { user, isEditor, isAdmin, canCreatePost } = useAuth();
    const [recentPosts, setRecentPosts] = useState([]);
    const [stats, setStats] = useState({
        totalPosts: 0,
        published: 0,
        drafts: 0,
        underReview: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isEditor && !isAdmin) {
            router.push('/dashboard');
            return;
        }
        fetchDashboardData();
    }, [user]);

    const fetchDashboardData = async () => {
        try {
            // Fetch posts created by this editor
            const response = await fetch(`${API_BASE_URL}/api/posts`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (response.ok) {
                const posts = await response.json();

                // Filter for posts created by current user if not admin (though API might return all)
                // Editors can edit ANY post, so showing all is fine, but maybe highlight theirs
                // For stats, let's show all posts they can manage

                setRecentPosts(posts.slice(0, 5));

                setStats({
                    totalPosts: posts.length,
                    published: posts.filter(p => p.status === 'PUBLISHED').length,
                    drafts: posts.filter(p => p.status === 'DRAFT').length,
                    underReview: posts.filter(p => p.status === 'UNDER_REVIEW').length
                });
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 bg-background">
            <div className="container mx-auto px-6 max-w-7xl">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">Editor Dashboard</h1>
                        <p className="text-muted-foreground">Manage content and categories</p>
                    </div>
                    {canCreatePost() && (
                        <Link
                            href="/dashboard/posts/new"
                            className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors w-fit"
                        >
                            <Plus className="w-5 h-5" />
                            Create New Post
                        </Link>
                    )}
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="p-6 rounded-xl bg-card border border-border">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-muted-foreground">Total Posts</span>
                            <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <p className="text-2xl font-bold">{stats.totalPosts}</p>
                    </div>
                    <div className="p-6 rounded-xl bg-card border border-border">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-muted-foreground">Published</span>
                            <Eye className="w-5 h-5 text-green-500" />
                        </div>
                        <p className="text-2xl font-bold text-green-500">{stats.published}</p>
                    </div>
                    <div className="p-6 rounded-xl bg-card border border-border">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-muted-foreground">Drafts</span>
                            <Edit className="w-5 h-5 text-gray-500" />
                        </div>
                        <p className="text-2xl font-bold text-gray-500">{stats.drafts}</p>
                    </div>
                    <div className="p-6 rounded-xl bg-card border border-border">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-muted-foreground">Under Review</span>
                            <Clock className="w-5 h-5 text-blue-500" />
                        </div>
                        <p className="text-2xl font-bold text-blue-500">{stats.underReview}</p>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <Link href="/dashboard/posts" className="p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all group">
                        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">Manage Posts</h3>
                        <p className="text-muted-foreground">View, edit, and filter all blog posts</p>
                    </Link>
                    <Link href="/dashboard/categories" className="p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all group">
                        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">Manage Categories</h3>
                        <p className="text-muted-foreground">Create and update content categories</p>
                    </Link>
                </div>

                {/* Pending Approvals Section */}
                {stats.underReview > 0 && (
                    <div className="bg-blue-50/50 border border-blue-200 rounded-xl overflow-hidden mb-8">
                        <div className="p-6 border-b border-blue-200 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-blue-800">Pending Approvals</h3>
                            <Link href="/dashboard/reviews" className="text-blue-600 hover:underline text-sm font-medium">View All</Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-blue-100/30">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-blue-700 uppercase">Title</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-blue-700 uppercase">Author</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-blue-700 uppercase">Submitted</th>
                                        <th className="px-6 py-3 text-right text-xs font-semibold text-blue-700 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-blue-200/50">
                                    {recentPosts.filter(p => p.status === 'UNDER_REVIEW').map((post) => (
                                        <tr key={post.id} className="hover:bg-blue-100/20">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-foreground">{post.title}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-foreground">
                                                {post.author?.name || post.createdBy?.displayName || 'Unknown'}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-foreground">
                                                {new Date(post.updatedAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Link
                                                    href={`/dashboard/posts/edit/${post.id}`}
                                                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
                                                >
                                                    Review
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Recent Activity */}
                <div className="bg-card border border-border rounded-xl overflow-hidden">
                    <div className="p-6 border-b border-border flex justify-between items-center">
                        <h3 className="text-xl font-bold">Recent Posts</h3>
                        <Link href="/dashboard/posts" className="text-primary hover:underline text-sm font-medium">View All</Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-secondary/20">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Title</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Author</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Date</th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {recentPosts.map((post) => (
                                    <tr key={post.id} className="hover:bg-secondary/5">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-foreground">{post.title}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <PostStatusBadge status={post.status} />
                                        </td>
                                        <td className="px-6 py-4 text-sm text-muted-foreground">
                                            {post.author?.name || post.createdBy?.username || 'Unknown'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-muted-foreground">
                                            {new Date(post.updatedAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link
                                                href={`/dashboard/posts/edit/${post.id}`}
                                                className="text-primary hover:text-primary/80 font-medium text-sm"
                                            >
                                                Edit
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
