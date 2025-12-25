"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import RichTextEditor from '@/components/RichTextEditor';
import FAQBuilder from '@/components/FAQBuilder';
import TOCBuilder from '@/components/TOCBuilder';
import { Button } from '@/components/ui/button';
import { Save, Eye, Trash2 } from 'lucide-react';

export default function NewPostPage() {
    const router = useRouter();
    const { user, token, isAuthenticated, isEditor } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPreview, setShowPreview] = useState(false);

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
        faqs: []
    });

    useEffect(() => {
        if (!isAuthenticated || !isEditor) {
            router.push('/login');
        }
    }, [isAuthenticated, isEditor, router]);

    const handleSubmit = async (status) => {
        setLoading(true);
        setError('');

        try {
            // Add a small delay for better UX feedback
            await new Promise(resolve => setTimeout(resolve, 800));

            const response = await fetch('http://localhost:8080/api/posts', {
                method: 'POST',
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
                throw new Error(errorData.error || 'Failed to create post');
            }

            const post = await response.json();

            // Only redirect to dashboard if publishing
            if (status === 'PUBLISHED') {
                await new Promise(resolve => setTimeout(resolve, 500));
                router.push(`/dashboard/posts`);
            } else {
                // For draft, just show success message and stay on page
                setError(''); // Clear any previous errors
                // You could add a success toast here
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const generateSlug = (title) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
    };

    const handleTitleChange = (e) => {
        const title = e.target.value;
        setFormData({
            ...formData,
            title,
            slug: generateSlug(title)
        });
    };

    if (!isAuthenticated || !isEditor) {
        return null;
    }

    return (
        <div className="min-h-screen pt-16 pb-12 bg-background">
            {/* Sticky Action Bar */}
            <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm">
                <div className="container mx-auto px-6 max-w-5xl py-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-bold">Create New Post</h1>
                            <p className="text-xs text-muted-foreground">Write and publish your blog post</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => handleSubmit('DRAFT')}
                                disabled={loading || !formData.title || !formData.content}
                                className="gap-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                                        <span>Saving...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        <span>Save as Draft</span>
                                    </>
                                )}
                            </Button>
                            {formData.slug && (
                                <Link href={`/blogs/${formData.slug}`} target="_blank">
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        className="gap-2"
                                    >
                                        <Eye className="w-4 h-4" />
                                        <span>Preview</span>
                                    </Button>
                                </Link>
                            )}
                            <Button
                                type="button"
                                onClick={() => handleSubmit('PUBLISHED')}
                                disabled={loading || !formData.title || !formData.content}
                                className="gap-2 bg-primary hover:bg-primary/90"
                            >
                                {loading ? (
                                    <>
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                        <span>Publishing...</span>
                                    </>
                                ) : (
                                    <>
                                        <Eye className="w-4 h-4" />
                                        <span>Publish</span>
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
                            onChange={handleTitleChange}
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
                            placeholder="auto-generated-from-title"
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
                            placeholder="Short description for SEO and previews..."
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

                    {/* Content Editor */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Content *</label>
                        <RichTextEditor
                            content={formData.content}
                            onChange={(content) => setFormData({ ...formData, content })}
                            placeholder="Start writing your post..."
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
                    <div className="space-y-4 pt-6 border-t border-border">
                        <h3 className="text-lg font-semibold">SEO Settings</h3>

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

                        <div>
                            <label className="block text-sm font-medium mb-2">Meta Description</label>
                            <textarea
                                value={formData.metaDescription}
                                onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                                className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                                rows={2}
                                placeholder="SEO description (defaults to excerpt)"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
