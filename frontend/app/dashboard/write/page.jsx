"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    FileText, Clock, CheckCircle2, AlertCircle,
    Edit, Eye, Send, Loader2, PenTool, TrendingUp
} from "lucide-react";

export default function WriterDashboardPage() {
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const router = useRouter();
    const [submissions, setSubmissions] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!authLoading) {
            if (!isAuthenticated) {
                router.push('/login?redirect=/dashboard/write');
                return;
            }

            // Check if user has WRITER+ role
            if (!user?.role || !['WRITER', 'EDITOR', 'ADMIN'].includes(user.role)) {
                router.push('/dashboard');
                return;
            }

            fetchSubmissions();
        }
    }, [isAuthenticated, user, authLoading, router]);

    const fetchSubmissions = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8080/api/posts/my-submissions', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setSubmissions(data.submissions || []);
                setStats(data.stats || {});
            } else {
                throw new Error('Failed to fetch submissions');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            'DRAFT': {
                icon: Edit,
                color: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
                label: 'Draft'
            },
            'UNDER_REVIEW': {
                icon: Clock,
                label: 'Pending Approval',
                color: 'text-orange-500 bg-orange-500/10 border-orange-500/20'
            },
            'PUBLISHED': {
                icon: CheckCircle2,
                color: 'text-green-500 bg-green-500/10 border-green-500/20',
                label: 'Published'
            },
            'REJECTED': {
                icon: AlertCircle,
                color: 'text-red-500 bg-red-500/10 border-red-500/20',
                label: 'Rejected'
            }
        };

        const config = statusConfig[status] || statusConfig['DRAFT'];
        const Icon = config.icon;

        return (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${config.color}`}>
                <Icon className="w-3.5 h-3.5" />
                {config.label}
            </span>
        );
    };

    const handleSubmitForApproval = async (postId) => {
        if (!confirm('Are you sure you want to submit this post for approval?')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/api/posts/${postId}/submit`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                alert('Post submitted for approval successfully!');
                fetchSubmissions(); // Refresh list
            } else {
                const error = await response.json();
                alert(error.error || 'Failed to submit post');
            }
        } catch (err) {
            alert('An error occurred while submitting the post');
        }
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <p className="text-red-500">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-6 py-12">
                {/* Header */}
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
                            <PenTool className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold">My Submissions</h1>
                            <p className="text-muted-foreground">Manage your blog posts and track their status</p>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    {stats && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                            <div className="bg-card border border-border rounded-xl p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-muted-foreground">Total Posts</span>
                                    <FileText className="w-5 h-5 text-primary" />
                                </div>
                                <p className="text-3xl font-bold">{stats.total}</p>
                            </div>
                            <div className="bg-card border border-yellow-500/20 rounded-xl p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-muted-foreground">Drafts</span>
                                    <Edit className="w-5 h-5 text-yellow-500" />
                                </div>
                                <p className="text-3xl font-bold text-yellow-500">{stats.draft}</p>
                            </div>
                            <div className="bg-card border border-orange-500/20 rounded-xl p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-muted-foreground">Pending</span>
                                    <Clock className="w-5 h-5 text-orange-500" />
                                </div>
                                <p className="text-3xl font-bold text-orange-500">{stats.pendingApproval}</p>
                            </div>
                            <div className="bg-card border border-green-500/20 rounded-xl p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-muted-foreground">Published</span>
                                    <TrendingUp className="w-5 h-5 text-green-500" />
                                </div>
                                <p className="text-3xl font-bold text-green-500">{stats.published}</p>
                            </div>
                        </div>
                    )}

                    {/* New Post Button */}
                    <div className="mt-8">
                        <Link href="/dashboard/posts/new">
                            <button className="bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-3 rounded-lg flex items-center gap-2 transition-all shadow-lg shadow-primary/20">
                                <PenTool className="w-5 h-5" />
                                Create New Post
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Submissions List */}
                <div className="space-y-4">
                    {submissions.length === 0 ? (
                        <div className="bg-card border border-border rounded-xl p-12 text-center">
                            <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-xl font-bold mb-2">No submissions yet</h3>
                            <p className="text-muted-foreground mb-6">Start writing your first blog post!</p>
                            <Link href="/dashboard/posts/new">
                                <button className="bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-3 rounded-lg">
                                    Write Your First Post
                                </button>
                            </Link>
                        </div>
                    ) : (
                        submissions.map((post) => (
                            <div key={post.id} className="bg-card border border-border rounded-xl p-6 hover:border-primary/30 transition-all">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-xl font-bold hover:text-primary transition-colors">
                                                {post.title}
                                            </h3>
                                            {getStatusBadge(post.status)}
                                        </div>
                                        {post.excerpt && (
                                            <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                                        )}
                                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                            <span>Created: {new Date(post.createdAt).toLocaleDateString()}</span>
                                            {post.submittedAt && (
                                                <span>Submitted: {new Date(post.submittedAt).toLocaleDateString()}</span>
                                            )}
                                            {post.publishedAt && (
                                                <span>Published: {new Date(post.publishedAt).toLocaleDateString()}</span>
                                            )}
                                            <span>{post.readTime || 5} min read</span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2">
                                        {post.status === 'DRAFT' && (
                                            <>
                                                <Link href={`/dashboard/posts/edit/${post.id}`}>
                                                    <button className="p-2 rounded-lg border border-border hover:bg-secondary/20 hover:border-primary/50 transition-all" title="Edit">
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                </Link>
                                                <button
                                                    onClick={() => handleSubmitForApproval(post.id)}
                                                    className="p-2 rounded-lg bg-primary/10 border border-primary/30 hover:bg-primary/20 text-primary transition-all"
                                                    title="Submit for Approval"
                                                >
                                                    <Send className="w-4 h-4" />
                                                </button>
                                            </>
                                        )}
                                        {post.status !== 'DRAFT' && (
                                            <Link href={`/blogs/${post.slug}`} target="_blank">
                                                <button className="p-2 rounded-lg border border-border hover:bg-secondary/20 hover:border-primary/50 transition-all" title="View">
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                            </Link>
                                        )}
                                    </div>
                                </div>

                                {/* Rejection Reason */}
                                {post.status === 'REJECTED' && post.reviewComments && (
                                    <div className="mt-4 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                                        <p className="text-sm font-semibold text-red-500 mb-1">Rejection Reason:</p>
                                        <p className="text-sm text-red-400">{post.reviewComments}</p>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
