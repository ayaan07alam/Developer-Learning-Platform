"use client";
import { useState, useEffect } from 'react';
import { Search, Filter, FileText, Eye, Edit2, Trash2, Clock } from 'lucide-react';
import Link from 'next/link';
import PostStatusBadge from './PostStatusBadge';
import CustomDialog from './CustomDialog';
import { useDialog } from '@/lib/useDialog';
import { API_BASE_URL } from '@/lib/api-client';

export default function ContentManagementSection({ userRole }) {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);
    const [deletionModalOpen, setDeletionModalOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [deletionReason, setDeletionReason] = useState('');
    const [filters, setFilters] = useState({
        status: '',
        search: '',
        page: 0,
        size: 10
    });
    const [stats, setStats] = useState(null);
    const [totalPages, setTotalPages] = useState(0);
    const { showConfirm, showAlert, dialogState, handleClose, handleConfirm } = useDialog();

    const isEditorOrAdmin = userRole === 'ROLE_EDITOR' || userRole === 'ROLE_ADMIN';

    useEffect(() => {
        fetchContent();
        fetchStats();
    }, [filters]);

    const fetchContent = async () => {
        try {
            const endpoint = isEditorOrAdmin ? '/api/content/all-content' : '/api/content/my-content';
            const params = new URLSearchParams();

            if (filters.status) params.append('status', filters.status);
            if (filters.search) params.append('search', filters.search);
            params.append('page', filters.page);
            params.append('size', filters.size);

            const response = await fetch(`${API_BASE_URL}${endpoint}?${params}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setPosts(data.content || []);
                setTotalPages(data.totalPages || 0);
            }
        } catch (error) {
            console.error('Error fetching content:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            // Use different endpoint based on role
            const endpoint = isEditorOrAdmin ? '/api/content/stats' : '/api/content/my-stats';

            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setStats(data);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value, page: 0 }));
    };

    const handleDelete = async (post) => {
        const isAdminOrEditor = isEditorOrAdmin;

        // Check if published AND not admin/editor - show deletion request modal
        if (post.status === 'PUBLISHED' && !isAdminOrEditor) {
            setSelectedPost(post);
            setDeletionModalOpen(true);
            return;
        }

        // Direct delete for DRAFT/UNDER_REVIEW or if user is ADMIN/EDITOR
        const confirmMessage = post.status === 'PUBLISHED'
            ? 'Are you sure you want to delete this PUBLISHED post? This action cannot be undone.'
            : 'Are you sure you want to delete this post?';

        const confirmed = await showConfirm(confirmMessage, {
            title: 'Delete Post',
            variant: 'danger'
        });
        if (!confirmed) return;

        setDeletingId(post.id);
        try {
            const response = await fetch(`${API_BASE_URL}/api/posts/${post.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                showAlert('Post deleted successfully!', {
                    title: 'Success'
                });
                await Promise.all([fetchContent(), fetchStats()]);
            } else {
                const error = await response.json();
                showAlert(error.error || 'Failed to delete post', {
                    title: 'Error'
                });
            }
        } catch (error) {
            console.error('Error deleting post:', error);
            showAlert('An error occurred while deleting the post. Please try again.', {
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
            const response = await fetch(`${API_BASE_URL}/api/posts/${selectedPost.id}/request-deletion`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
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
        } catch (error) {
            console.error('Error submitting deletion request:', error);
            showAlert('An error occurred. Please try again.', {
                title: 'Error'
            });
        }
    };

    return (
        <div className="space-y-6">
            {/* Header with Stats */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Content Management</h2>
            </div>

            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                        <div className="text-3xl font-bold text-primary">{stats.total}</div>
                        <div className="text-sm text-muted-foreground">Total Posts</div>
                    </div>
                    <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                        <div className="text-3xl font-bold text-green-500">{stats.published}</div>
                        <div className="text-sm text-muted-foreground">Published</div>
                    </div>
                    <div className="p-4 rounded-xl bg-gray-500/10 border border-gray-500/20">
                        <div className="text-3xl font-bold text-gray-500">{stats.drafts}</div>
                        <div className="text-sm text-muted-foreground">Drafts</div>
                    </div>
                    <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                        <div className="text-3xl font-bold text-yellow-500">{stats.pending}</div>
                        <div className="text-sm text-muted-foreground">Pending</div>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                {/* Filters */}
                <div className="flex gap-4 mb-6">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Search posts..."
                            value={filters.search}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    <select
                        value={filters.status}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                        className="px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        <option value="">All Status</option>
                        <option value="DRAFT">Draft</option>
                        <option value="UNDER_REVIEW">Under Review</option>
                        <option value="PUBLISHED">Published</option>
                    </select>
                </div>
            </div>

            {/* Posts Table/List */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            ) : posts.length === 0 ? (
                <div className="text-center py-12 bg-secondary/5 rounded-xl border border-border">
                    <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <p className="text-muted-foreground">No posts found</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {posts.map((post) => (
                        <div
                            key={post.id}
                            className="p-5 rounded-xl bg-secondary/5 border border-border hover:border-primary/50 transition-all"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-lg font-bold truncate">{post.title}</h3>
                                        <PostStatusBadge status={post.status} />
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                                        <span>By {post.createdBy?.displayName || 'Unknown'}</span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            {new Date(post.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    {post.excerpt && (
                                        <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2">
                                    <Link
                                        href={`/blogs/${post.slug}`}
                                        target="_blank"
                                        className="p-2 rounded-lg border border-border hover:bg-secondary/10 transition-colors"
                                        title="View Post"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </Link>
                                    <Link
                                        href={`/dashboard/posts/edit/${post.id}`}
                                        className="p-2 rounded-lg border border-border hover:bg-secondary/10 transition-colors"
                                        title="Edit Post"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(post)}
                                        disabled={deletingId === post.id}
                                        className="p-2 rounded-lg border border-red-500/50 text-red-500 hover:bg-red-500/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[36px]"
                                        title="Delete Post"
                                    >
                                        {deletingId === post.id ? (
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                                        ) : (
                                            <Trash2 className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                    <button
                        disabled={filters.page === 0}
                        onClick={() => handleFilterChange('page', filters.page - 1)}
                        className="px-4 py-2 rounded-lg border border-border hover:bg-secondary/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Previous
                    </button>
                    <span className="px-4 py-2 text-sm text-muted-foreground">
                        Page {filters.page + 1} of {totalPages}
                    </span>
                    <button
                        disabled={filters.page >= totalPages - 1}
                        onClick={() => handleFilterChange('page', filters.page + 1)}
                        className="px-4 py-2 rounded-lg border border-border hover:bg-secondary/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Next
                    </button>
                </div>
            )}

            {/* Deletion Request Modal */}
            {deletionModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-card rounded-xl shadow-2xl max-w-md w-full mx-4 p-6 border border-border">
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
                                className="w-full p-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
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
                                className="px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors"
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
