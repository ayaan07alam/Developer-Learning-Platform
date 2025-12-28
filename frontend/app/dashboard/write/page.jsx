"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    FileText, Clock, CheckCircle, AlertCircle,
    Edit, Eye, Send, Loader2, PenTool, TrendingUp, X, FileX, Trash2
} from "lucide-react";
import CustomDialog from "@/components/CustomDialog";
import { useDialog } from "@/lib/useDialog";

export default function WriterDashboardPage() {
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const router = useRouter();
    const [submissions, setSubmissions] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);
    const [error, setError] = useState(null);
    const [deletionModalOpen, setDeletionModalOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [deletionReason, setDeletionReason] = useState('');
    const [deletionRequests, setDeletionRequests] = useState([]);
    const { showConfirm, showAlert, dialogState, handleClose, handleConfirm } = useDialog();

    console.log('=== WRITER DASHBOARD LOADED ===');
    console.log('Deletion requests state:', deletionRequests);

    useEffect(() => {
        if (!authLoading) {
            if (!isAuthenticated) {
                router.push('/login?redirect=/dashboard/write');
                return;
            }

            // Check if user has write permissions (USER/WRITER/EDITOR/ADMIN can all write)
            if (!user?.role || !['USER', 'WRITER', 'EDITOR', 'ADMIN'].includes(user.role)) {
                router.push('/dashboard');
                return;
            }

            fetchSubmissions();
            fetchDeletionRequests();
        }
    }, [isAuthenticated, user, authLoading, router]);

    const fetchSubmissions = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8080/api/posts/my-submissions', {
                headers: {
                    'Authorization': `Bearer ${token} `,
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

    const fetchDeletionRequests = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8080/api/admin/deletion-requests/my-requests', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log('=== DELETION REQUESTS FETCHED ===', data);
                setDeletionRequests(data || []);
            } else {
                console.error('Failed to fetch deletion requests:', response.status);
            }
        } catch (err) {
            console.error('Error fetching deletion requests:', err);
        }
    };

    const getDeletionRequestForPost = (postId) => {
        const request = deletionRequests.find(req => req.post?.id === postId);
        console.log(`Deletion request for post ${postId}:`, request);
        return request;
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
            <span className={`inline - flex items - center gap - 1.5 px - 3 py - 1 rounded - full text - xs font - semibold border ${config.color} `}>
                <Icon className="w-3.5 h-3.5" />
                {config.label}
            </span>
        );
    };

    const handleSubmitForApproval = async (postId) => {
        const confirmed = await showConfirm('Are you sure you want to submit this post for approval?', {
            title: 'Submit for Approval'
        });
        if (!confirmed) return;

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
                showAlert('Post submitted for approval successfully!', {
                    title: 'Success'
                });
                fetchSubmissions(); // Refresh list
            } else {
                const error = await response.json();
                showAlert(error.error || 'Failed to submit post', {
                    title: 'Error'
                });
            }
        } catch (err) {
            showAlert('An error occurred while submitting the post', {
                title: 'Error'
            });
        }
    };

    const handleUnsubmit = async (postId) => {
        const confirmed = await showConfirm('Are you sure you want to retract this submission? It will be moved back to drafts.', {
            title: 'Retract Submission'
        });
        if (!confirmed) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/api/posts/${postId}/unsubmit`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                showAlert('Post retracted successfully!', {
                    title: 'Success'
                });
                fetchSubmissions();
            } else {
                const error = await response.json();
                showAlert(error.error || 'Failed to retract post', {
                    title: 'Error'
                });
            }
        } catch (err) {
            showAlert('An error occurred while retracting the post', {
                title: 'Error'
            });
        }
    };

    const handleDelete = async (post) => {
        console.log('=== DELETE DEBUG ===');
        console.log('Post status:', post.status);
        console.log('User role:', user?.role);

        const isAdminOrEditor = user?.role && ['ADMIN', 'EDITOR'].includes(user.role);
        console.log('Is admin/editor?', isAdminOrEditor);
        console.log('Is PUBLISHED?', post.status === 'PUBLISHED');
        console.log('Should show modal?', post.status === 'PUBLISHED' && !isAdminOrEditor);

        // Check if published AND not admin/editor - show deletion request modal
        if (post.status === 'PUBLISHED' && !isAdminOrEditor) {
            console.log('✅ SHOWING MODAL');
            setSelectedPost(post);
            setDeletionModalOpen(true);
            return; // Don't proceed with direct delete
        }

        console.log('❌ PROCEEDING WITH DELETE REQUEST');

        // Direct delete for DRAFT/UNDER_REVIEW or if user is ADMIN/EDITOR
        const confirmMessage = post.status === 'PUBLISHED'
            ? `Are you sure you want to delete this PUBLISHED post? This action cannot be undone.`
            : `Are you sure you want to delete this post?`;

        const confirmed = await showConfirm(confirmMessage, {
            title: 'Delete Post',
            variant: 'danger'
        });
        if (!confirmed) return;

        setDeletingId(post.id);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/api/posts/${post.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                showAlert('Post deleted successfully!', {
                    title: 'Success'
                });
                await Promise.all([fetchSubmissions(), fetchStats()]);
            } else {
                const error = await response.json();
                showAlert(error.error || 'Failed to delete post', {
                    title: 'Error'
                });
            }
        } catch (err) {
            showAlert('An error occurred while deleting the post', {
                title: 'Error'
            });
        } finally {
            setDeletingId(null);
        }
    };

    const handleSubmitDeletionRequest = async () => {
        if (!deletionReason.trim()) {
            showAlert('Please provide a reason for deletion', {
                title: 'Validation Error'
            });
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/api/posts/${selectedPost.id}/request-deletion`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ reason: deletionReason })
            });

            if (response.ok) {
                showAlert('Deletion request submitted successfully!', {
                    title: 'Success'
                });
                setDeletionModalOpen(false);
                setDeletionReason('');
                setSelectedPost(null);
            } else {
                const error = await response.json();
                showAlert(error.error || 'Failed to submit deletion request', {
                    title: 'Error'
                });
            }
        } catch (err) {
            showAlert('An error occurred while submitting deletion request', {
                title: 'Error'
            });
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
                                            {(() => {
                                                const deletionRequest = getDeletionRequestForPost(post.id);
                                                if (deletionRequest) {
                                                    if (deletionRequest.status === 'PENDING') {
                                                        return (
                                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                                                                <Clock className="w-3.5 h-3.5" />
                                                                Deletion Pending
                                                            </span>
                                                        );
                                                    } else if (deletionRequest.status === 'DENIED') {
                                                        return (
                                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border bg-red-500/10 text-red-500 border-red-500/20">
                                                                <X className="w-3.5 h-3.5" />
                                                                Deletion Denied
                                                            </span>
                                                        );
                                                    }
                                                }
                                                return null;
                                            })()}
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
                                        <button
                                            onClick={() => handleDelete(post)}
                                            disabled={deletingId === post.id}
                                            className="p-2 rounded-lg border border-border hover:bg-red-500/10 hover:border-red-500/50 text-red-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[36px]"
                                            title={post.status === 'PUBLISHED' ? 'Request deletion' : 'Delete post'}
                                        >
                                            {deletingId === post.id ? (
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                                            ) : (
                                                <Trash2 className="w-4 h-4" />
                                            )}
                                        </button>
                                        {post.status === 'UNDER_REVIEW' && (
                                            <button
                                                onClick={() => handleUnsubmit(post.id)}
                                                className="p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/30 hover:bg-yellow-500/20 text-yellow-500 transition-all"
                                                title="Retract Submission"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
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

            {/* Deletion Request Modal */}
            {deletionModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full mx-4 p-6">
                        <h3 className="text-xl font-bold mb-4">Request Post Deletion</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            This post is published. You cannot delete it directly. Please provide a reason for deletion,
                            and an admin will review your request.
                        </p>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Reason for deletion *</label>
                            <textarea
                                value={deletionReason}
                                onChange={(e) => setDeletionReason(e.target.value)}
                                className="w-full p-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                                rows={4}
                                placeholder="Explain why you want to delete this post..."
                            />
                        </div>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => {
                                    setDeletionModalOpen(false);
                                    setDeletionReason('');
                                    setSelectedPost(null);
                                }}
                                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmitDeletionRequest}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Submit Request
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom Dialog */}
            <CustomDialog
                isOpen={dialogState.isOpen}
                onClose={handleClose}
                onConfirm={handleConfirm}
                title={dialogState.title}
                message={dialogState.message}
                type={dialogState.type}
                confirmText={dialogState.confirmText}
                cancelText={dialogState.cancelText}
                variant={dialogState.variant}
            />
        </div>
    );
}
