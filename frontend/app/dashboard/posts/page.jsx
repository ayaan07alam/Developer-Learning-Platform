"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Eye, EyeOff, Heart, MessageCircle, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import CustomDialog from '@/components/CustomDialog';
import { useDialog } from '@/lib/useDialog';
import { API_BASE_URL } from '@/lib/api-client';

export default function PostsListPage() {
    const router = useRouter();
    const { user, token, isAuthenticated, isEditor, isAdmin } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('ALL');
    const { showConfirm, showAlert, dialogState, handleClose, handleConfirm } = useDialog();

    useEffect(() => {
        if (!isAuthenticated || !isEditor) {
            router.push('/login');
            return;
        }
        fetchPosts();
    }, [isAuthenticated, isEditor, router]);

    const fetchPosts = async () => {
        try {
            console.log('Fetching posts...');
            // GET /api/posts is public, no auth header needed
            const response = await fetch(`${API_BASE_URL}/api/posts`);

            console.log('Response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response:', errorText);
                throw new Error('Failed to fetch posts');
            }

            const data = await response.json();
            setPosts(data);
        } catch (err) {
            console.error('Fetch error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const deletePost = async (id) => {
        const confirmed = await showConfirm('Are you sure you want to delete this post?', {
            title: 'Delete Post',
            variant: 'danger'
        });
        if (!confirmed) return;

        try {
            const response = await fetch(`${API_BASE_URL}/api/posts/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to delete post');
            }

            fetchPosts(); // Refresh list
        } catch (err) {
            alert(err.message);
        }
    };

    const togglePublish = async (post) => {
        const endpoint = post.status === 'PUBLISHED' ? 'unpublish' : 'publish';

        try {
            const response = await fetch(`${API_BASE_URL}/api/posts/${post.id}/${endpoint}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to ${endpoint} post`);
            }

            fetchPosts(); // Refresh list
        } catch (err) {
            alert(err.message);
        }
    };

    const filteredPosts = posts.filter(post => {
        if (filter === 'ALL') return true;
        return post.status === filter;
    });

    if (!isAuthenticated || !isEditor) {
        return null;
    }

    if (loading) {
        return (
            <div className="min-h-screen pt-24 pb-12 bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading posts...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 bg-background">
            <div className="container mx-auto px-6 max-w-7xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">Blog Posts</h1>
                        <p className="text-muted-foreground">Manage your blog content</p>
                    </div>
                    <Link href="/dashboard/posts/new">
                        <Button className="bg-primary hover:bg-primary/90">
                            <Plus className="w-4 h-4 mr-2" />
                            New Post
                        </Button>
                    </Link>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500">
                        {error}
                    </div>
                )}

                {/* Filters */}
                <div className="flex gap-2 mb-6">
                    <Button
                        variant={filter === 'ALL' ? 'default' : 'outline'}
                        onClick={() => setFilter('ALL')}
                        size="sm"
                    >
                        All ({posts.length})
                    </Button>
                    <Button
                        variant={filter === 'PUBLISHED' ? 'default' : 'outline'}
                        onClick={() => setFilter('PUBLISHED')}
                        size="sm"
                    >
                        Published ({posts.filter(p => p.status === 'PUBLISHED').length})
                    </Button>
                    <Button
                        variant={filter === 'DRAFT' ? 'default' : 'outline'}
                        onClick={() => setFilter('DRAFT')}
                        size="sm"
                    >
                        Drafts ({posts.filter(p => p.status === 'DRAFT').length})
                    </Button>
                </div>

                {/* Posts Table */}
                <div className="bg-card border border-border rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-muted/50 border-b border-border">
                                <tr>
                                    <th className="text-left p-4 font-semibold">Title</th>
                                    <th className="text-left p-4 font-semibold">Status</th>
                                    <th className="text-left p-4 font-semibold">Categories</th>
                                    <th className="text-left p-4 font-semibold">Author</th>
                                    <th className="text-left p-4 font-semibold">Views</th>
                                    <th className="text-left p-4 font-semibold">Likes</th>
                                    <th className="text-left p-4 font-semibold">Comments</th>
                                    <th className="text-left p-4 font-semibold">Date</th>
                                    <th className="text-right p-4 font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPosts.length === 0 ? (
                                    <tr>
                                        <td colSpan={9} className="text-center p-8 text-muted-foreground">
                                            No posts found. Create your first post!
                                        </td>
                                    </tr>
                                ) : (
                                    filteredPosts.map((post) => (
                                        <tr key={post.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                                            <td className="p-4">
                                                <div>
                                                    <div className="font-semibold">{post.title}</div>
                                                    <div className="text-sm text-muted-foreground">/{post.slug}</div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${post.status === 'PUBLISHED'
                                                    ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                                                    : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                                                    }`}>
                                                    {post.status}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                {post.categories && post.categories.length > 0 ? (
                                                    post.categories.length === 1 ? (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                                                            {post.categories[0].name}
                                                        </span>
                                                    ) : (
                                                        <div className="relative group">
                                                            <button className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors">
                                                                {post.categories[0].name}
                                                                <ChevronDown className="w-3 h-3" />
                                                            </button>
                                                            <div className="absolute left-0 top-full mt-1 bg-card border border-border rounded-lg shadow-lg p-2 min-w-[150px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                                                                {post.categories.map((cat) => (
                                                                    <div key={cat.id} className="px-2 py-1 text-xs hover:bg-muted rounded">
                                                                        {cat.name}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )
                                                ) : (
                                                    <span className="text-xs text-muted-foreground">No category</span>
                                                )}
                                            </td>
                                            <td className="p-4 text-sm">
                                                {post.author?.name || 'No author'}
                                            </td>
                                            <td className="p-4 text-sm">
                                                <div className="flex items-center gap-1">
                                                    <Eye className="w-4 h-4 text-muted-foreground" />
                                                    <span>{post.viewCount || 0}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-sm">
                                                <div className="flex items-center gap-1">
                                                    <Heart className="w-4 h-4 text-red-500" />
                                                    <span>{post.likeCount || 0}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-sm">
                                                <Link href={`/dashboard/comments?postId=${post.id}`}>
                                                    <button className="flex items-center gap-1 hover:text-primary transition-colors">
                                                        <MessageCircle className="w-4 h-4 text-blue-500" />
                                                        <span>{post.commentCount || 0}</span>
                                                    </button>
                                                </Link>
                                            </td>
                                            <td className="p-4 text-sm text-muted-foreground">
                                                {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'N/A'}
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link href={`/blogs/${post.slug}`} target="_blank">
                                                        <Button variant="ghost" size="sm" title="View Post">
                                                            <Eye className="w-4 h-4" />
                                                        </Button>
                                                    </Link>
                                                    <Link href={`/dashboard/posts/edit/${post.id}`}>
                                                        <Button variant="ghost" size="sm" title="Edit Post">
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                    </Link>
                                                    {isAdmin && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => deletePost(post.id)}
                                                            className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                                                            title="Delete Post"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

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
