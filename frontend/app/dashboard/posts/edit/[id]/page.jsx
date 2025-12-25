"use client";
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import RichTextEditor from '@/components/RichTextEditor';
import FAQBuilder from '@/components/FAQBuilder';
import TOCBuilder from '@/components/TOCBuilder';
import { Button } from '@/components/ui/button';
import { Save, Eye, Trash2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function EditPostPage() {
    const router = useRouter();
    const params = useParams();
    const { user, token, isAuthenticated, isEditor } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        mainImage: '',
        metaTitle: '',
        metaDescription: '',
        tags: [],
        tocItems: [],
        showToc: true,
        faqs: [],
        status: 'DRAFT'
    });

    useEffect(() => {
        if (!isAuthenticated || !isEditor) {
            router.push('/login');
            return;
        }
        fetchPost();
    }, [isAuthenticated, isEditor, router, params.id]);

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
                tocItems: post.tocItems ? JSON.parse(post.tocItems) : [],
                showToc: post.showToc !== undefined ? post.showToc : true,
                faqs: post.faqs || [],
                status: post.status || 'DRAFT'
            });
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
                    tocItems: JSON.stringify(formData.tocItems),
                    showToc: formData.showToc
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update post');
            }

            router.push('/dashboard/posts');
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    if (!isAuthenticated || !isEditor) {
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
        <div className="min-h-screen pt-24 pb-12 bg-background">
            {/* Sticky Header */}
            <div className="sticky top-16 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
                <div className="container mx-auto px-6 max-w-5xl py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href="/dashboard/posts" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary">
                                <ArrowLeft className="w-4 h-4 mr-1" />
                                Back
                            </Link>
                            <h1 className="text-xl font-bold">Edit Post</h1>
                        </div>
                        <div className="flex gap-3">
                            <Button
                                onClick={() => handleSubmit('DRAFT')}
                                disabled={saving || !formData.title || !formData.content}
                                variant="outline"
                                size="sm"
                            >
                                {saving ? (
                                    <>
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                                        <span>Saving...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        <span>Save Draft</span>
                                    </>
                                )}
                            </Button>
                            <Button
                                onClick={() => handleSubmit('PUBLISHED')}
                                disabled={saving || !formData.title || !formData.content}
                                size="sm"
                            >
                                {saving ? (
                                    <>
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                        <span>Updating...</span>
                                    </>
                                ) : (
                                    <>
                                        <Eye className="w-4 h-4" />
                                        <span>{formData.status === 'PUBLISHED' ? 'Update' : 'Publish'}</span>
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 max-w-5xl mt-6">

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500">
                        {error}
                    </div>
                )}

                <div className="space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Title *</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-2xl font-bold"
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

                    {/* Content Editor */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Content *</label>
                        <RichTextEditor
                            content={formData.content}
                            onChange={(content) => setFormData({ ...formData, content })}
                            placeholder="Start writing..."
                        />
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

                    {/* FAQ Builder */}
                    <div className="pt-6 border-t border-border">
                        <FAQBuilder
                            faqs={formData.faqs}
                            onChange={(faqs) => setFormData({ ...formData, faqs })}
                        />
                    </div>

                    {/* TOC Builder */}
                    <div className="pt-6 border-t border-border">
                        <TOCBuilder
                            content={formData.content}
                            tocItems={formData.tocItems}
                            showToc={formData.showToc}
                            onChange={(tocItems) => setFormData({ ...formData, tocItems })}
                            onShowTocChange={(showToc) => setFormData({ ...formData, showToc })}
                        />
                    </div>

                    {/* SEO Fields */}
                    <details className="border border-border rounded-lg p-4">
                        <summary className="font-medium cursor-pointer">SEO Settings</summary>
                        <div className="mt-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Meta Title</label>
                                <input
                                    type="text"
                                    value={formData.metaTitle}
                                    onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                                    className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Meta Description</label>
                                <textarea
                                    value={formData.metaDescription}
                                    onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                                    className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                                    rows={2}
                                />
                            </div>
                        </div>
                    </details>


                </div>
            </div>
        </div>
    );
}
