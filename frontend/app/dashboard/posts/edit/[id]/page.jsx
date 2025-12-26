"use client";
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import RichTextEditor from '@/components/RichTextEditor';
import FAQBuilder from '@/components/FAQBuilder';
import { Button } from '@/components/ui/button';
import { Save, Eye, Trash2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import InternalAuditChat from '@/components/InternalAuditChat';

export default function EditPostPage() {
    const router = useRouter();
    const params = useParams();
    const { user, token, isAuthenticated, isEditor, isReviewer, isAdmin } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        mainImage: '',
        metaTitle: '',
        metaDescription: '',
        tags: [],
        faqs: [],
        status: 'DRAFT'
    });

    // Auth check
    useEffect(() => {
        if (!isAuthenticated || (!isEditor && !isAdmin && !isReviewer)) {
            router.push('/login');
            return;
        }
        fetchPost();
        fetchCategories();
    }, [isAuthenticated, isEditor, isReviewer, isAdmin, router, params.id]);

    const fetchCategories = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/categories');
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchPost = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/posts/${params.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch post');
            }

            const post = await response.json();
            setFormData({
                title: post.title || '',
                slug: post.slug || '',
                excerpt: post.excerpt || '',
                content: post.content || '',
                mainImage: post.mainImage || '',
                metaTitle: post.metaTitle || '',
                metaDescription: post.metaDescription || '',
                tags: post.tags || [],
                faqs: post.faqs || [],
                status: post.status || 'DRAFT'
            });
            // Set selected categories
            if (post.categories && post.categories.length > 0) {
                setSelectedCategories(post.categories.map(cat => cat.id));
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (status) => {
        setSaving(true);
        setError('');

        try {
            const response = await fetch(`http://localhost:8080/api/posts/${params.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    status,
                    tags: formData.tags.filter(t => t.trim()),
                    categoryIds: selectedCategories
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update post');
            }

            // Redirect based on role
            if (isReviewer) {
                router.push('/dashboard/reviewer');
            } else {
                router.push('/dashboard/posts');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    if (!isAuthenticated || (!isEditor && !isAdmin && !isReviewer)) {
        return null;
    }

    if (loading) {
        return (
            <div className="min-h-screen pt-24 pb-12 bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading post...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-16 pb-12 bg-background">
            {/* Sticky Header */}
            <div className="sticky top-16 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
                <div className="container mx-auto px-6 max-w-full py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href={isReviewer ? "/dashboard/reviewer" : "/dashboard/posts"} className="inline-flex items-center text-sm text-muted-foreground hover:text-primary">
                                <ArrowLeft className="w-4 h-4 mr-1" />
                                Back
                            </Link>
                            <h1 className="text-xl font-bold">Edit Post</h1>
                            <span className={`text-xs px-2 py-1 rounded-full ${formData.status === 'PUBLISHED' ? 'bg-green-500/10 text-green-500' :
                                formData.status === 'UNDER_REVIEW' ? 'bg-blue-500/10 text-blue-500' :
                                    'bg-gray-500/10 text-gray-500'
                                }`}>
                                {formData.status.replace('_', ' ')}
                            </span>
                        </div>
                        <div className="flex gap-3">
                            <Button
                                onClick={() => handleSubmit(formData.status)} // Keep current status
                                disabled={saving || !formData.title || !formData.content}
                                variant="outline"
                                size="sm"
                            >
                                {saving ? 'Saving...' : 'Save Changes'}
                            </Button>

                            {/* Role-based Action Buttons */}
                            {isReviewer ? (
                                <Button
                                    onClick={() => handleSubmit('UNDER_REVIEW')}
                                    disabled={saving || !formData.title || !formData.content}
                                    size="sm"
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                    Submit for Approval
                                </Button>
                            ) : (
                                <>
                                    {formData.status === 'UNDER_REVIEW' && (
                                        <Button
                                            onClick={() => handleSubmit('REJECTED')}
                                            disabled={saving}
                                            variant="destructive"
                                            size="sm"
                                            className="bg-red-500 hover:bg-red-600 text-white"
                                        >
                                            Reject
                                        </Button>
                                    )}
                                    <Button
                                        onClick={() => handleSubmit('PUBLISHED')}
                                        disabled={saving || !formData.title || !formData.content}
                                        size="sm"
                                    >
                                        {formData.status === 'PUBLISHED' ? 'Update & Publish' : 'Publish'}
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 max-w-full mt-6">

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500">
                        {error}
                    </div>
                )}

                {/* Two-Column Layout: 30% Left Sidebar + 70% Right Editor */}
                <div className="grid grid-cols-[30%_70%] gap-6">
                    {/* LEFT SIDEBAR - Metadata Fields (30%) */}
                    <div className="space-y-6">
                        {/* Internal Audit Chat */}
                        <InternalAuditChat postId={params.id} />

                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Title *</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-lg font-bold"
                                placeholder="Enter post title..."
                                required
                            />
                        </div>

                        {/* Slug */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Slug</label>
                            <input
                                type="text"
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm font-mono"
                                placeholder="post-slug"
                            />
                        </div>

                        {/* Meta Title */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Meta Title</label>
                            <input
                                type="text"
                                value={formData.metaTitle}
                                onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                                className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="SEO title (defaults to post title)"
                            />
                        </div>

                        {/* Meta Description */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Meta Description</label>
                            <textarea
                                value={formData.metaDescription}
                                onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                                className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                                rows={3}
                                placeholder="SEO description (defaults to excerpt)"
                            />
                        </div>

                        {/* Excerpt */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Excerpt</label>
                            <textarea
                                value={formData.excerpt}
                                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                                rows={3}
                                placeholder="Short description..."
                            />
                        </div>

                        {/* Tags */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
                            <input
                                type="text"
                                value={formData.tags.join(', ')}
                                onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(',').map(t => t.trim()) })}
                                className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="react, javascript, tutorial"
                            />
                        </div>

                        {/* Categories */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Categories
                                <span className="text-xs text-muted-foreground ml-2">(First is primary)</span>
                            </label>

                            {/* Selected Categories - Reorderable */}
                            {selectedCategories.length > 0 && (
                                <div className="mb-3 p-3 border border-border rounded-lg bg-muted/30">
                                    <p className="text-xs font-medium mb-2">Selected ({selectedCategories.length}):</p>
                                    <div className="space-y-1">
                                        {selectedCategories.map((catId, index) => {
                                            const category = categories.find(c => c.id === catId);
                                            if (!category) return null;
                                            return (
                                                <div key={catId} className="flex items-center gap-2 bg-background p-2 rounded border border-border">
                                                    {index === 0 && (
                                                        <span className="text-yellow-500" title="Primary Category">★</span>
                                                    )}
                                                    <span className="text-sm flex-1">{category.name}</span>
                                                    <div className="flex gap-1">
                                                        {index > 0 && (
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    const newOrder = [...selectedCategories];
                                                                    [newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]];
                                                                    setSelectedCategories(newOrder);
                                                                }}
                                                                className="text-xs px-2 py-1 hover:bg-muted rounded"
                                                                title="Move up"
                                                            >
                                                                ↑
                                                            </button>
                                                        )}
                                                        {index < selectedCategories.length - 1 && (
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    const newOrder = [...selectedCategories];
                                                                    [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
                                                                    setSelectedCategories(newOrder);
                                                                }}
                                                                className="text-xs px-2 py-1 hover:bg-muted rounded"
                                                                title="Move down"
                                                            >
                                                                ↓
                                                            </button>
                                                        )}
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setSelectedCategories(selectedCategories.filter(id => id !== catId));
                                                            }}
                                                            className="text-xs px-2 py-1 text-red-500 hover:bg-red-500/10 rounded"
                                                            title="Remove"
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Available Categories */}
                            <div className="border border-border rounded-lg p-3 bg-background max-h-48 overflow-y-auto">
                                {categories.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">No categories available</p>
                                ) : (
                                    <div className="space-y-2">
                                        {categories
                                            .filter(cat => !selectedCategories.includes(cat.id))
                                            .map(cat => (
                                                <button
                                                    key={cat.id}
                                                    type="button"
                                                    onClick={() => setSelectedCategories([...selectedCategories, cat.id])}
                                                    className="w-full text-left flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-2 rounded transition-colors"
                                                >
                                                    <span className="text-sm">{cat.name}</span>
                                                    <span className="ml-auto text-xs text-primary">+ Add</span>
                                                </button>
                                            ))}
                                        {categories.filter(cat => !selectedCategories.includes(cat.id)).length === 0 && (
                                            <p className="text-sm text-muted-foreground">All categories selected</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Featured Image */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Featured Image URL</label>
                            <input
                                type="url"
                                value={formData.mainImage}
                                onChange={(e) => setFormData({ ...formData, mainImage: e.target.value })}
                                className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="https://example.com/image.jpg"
                            />
                            {formData.mainImage && (
                                <div className="mt-2">
                                    <img
                                        src={formData.mainImage}
                                        alt="Preview"
                                        className="w-full rounded-lg border border-border"
                                        onError={(e) => e.target.style.display = 'none'}
                                    />
                                </div>
                            )}
                        </div>

                        {/* FAQ Builder */}
                        <div className="pt-6 border-t border-border">
                            <FAQBuilder
                                faqs={formData.faqs}
                                onChange={(faqs) => setFormData({ ...formData, faqs })}
                            />
                        </div>
                    </div>

                    {/* RIGHT SIDE - Rich Text Editor (70%) */}
                    <div className="space-y-6">
                        {/* Content Editor */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Content *</label>
                            <RichTextEditor
                                content={formData.content}
                                onChange={(content) => setFormData({ ...formData, content })}
                                placeholder="Start writing..."
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
