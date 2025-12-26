"use client";
import { useState, useEffect } from 'react';
import { Search, Filter, FileText, Eye, Edit2, Trash2, Clock } from 'lucide-react';
import Link from 'next/link';
import PostStatusBadge from './PostStatusBadge';

export default function ContentManagementSection({ userRole }) {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        status: '',
        search: '',
        page: 0,
        size: 10
    });
    const [stats, setStats] = useState(null);
    const [totalPages, setTotalPages] = useState(0);

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

            const response = await fetch(`http://localhost:8080${endpoint}?${params}`, {
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
            const response = await fetch('http://localhost:8080/api/content/stats', {
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

    const handleDelete = async (postId) => {
        if (!confirm('Are you sure you want to delete this post?')) return;

        try {
            const response = await fetch(`http://localhost:8080/api/posts/${postId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                fetchContent();
                fetchStats();
            }
        } catch (error) {
            console.error('Error deleting post:', error);
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
                {/* Search */}
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search by title..."
                        value={filters.search}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-lg bg-secondary/10 border border-border focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                </div>

                {/* Status Filter */}
                <select
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="px-4 py-3 rounded-lg bg-secondary/10 border border-border focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                    <option value="">All Status</option>
                    <option value="PUBLISHED">Published</option>
                    <option value="DRAFT">Draft</option>
                    <option value="PENDING_REVIEW">Pending Review</option>
                </select>
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
                                        <span>By {post.createdBy?.username || 'Unknown'}</span>
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
                                        onClick={() => handleDelete(post.id)}
                                        className="p-2 rounded-lg border border-red-500/50 text-red-500 hover:bg-red-500/10 transition-colors"
                                        title="Delete Post"
                                    >
                                        <Trash2 className="w-4 h-4" />
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
        </div>
    );
}
