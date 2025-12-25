"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import RichTextEditor from '@/components/RichTextEditor';
import FAQBuilder from '@/components/FAQBuilder';
import { Button } from '@/components/ui/button';
import { Save, Eye, Trash2 } from 'lucide-react';

export default function NewPostPage() {
    const router = useRouter();
    const { user, token, isAuthenticated, isEditor } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPreview, setShowPreview] = useState(false);
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [hasChanges, setHasChanges] = useState(true); // Track if form has unsaved changes
    const [lastSubmittedData, setLastSubmittedData] = useState(null); // Track last submitted state

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
        categoryIds: []
    });

    useEffect(() => {
        if (!isAuthenticated || !isEditor) {
            router.push('/login');
        }
    }, [isAuthenticated, isEditor, router]);

    useEffect(() => {
        fetchCategories();
    }, []);

    // Track changes to re-enable buttons
    useEffect(() => {
        // This effect runs whenever formData or selectedCategories changes.
        // We only want to set hasChanges to true if the current state is different from the last submitted state.
        // If lastSubmittedData is null (initial load), then there are changes (or it's a new post).
        if (!lastSubmittedData) {
            setHasChanges(true);
            return;
        }

        // Deep comparison to check if current form data differs from last submitted data
        const currentData = {
            ...formData,
            categoryIds: selectedCategories
        };

        const isDifferent = Object.keys(currentData).some(key => {
            if (Array.isArray(currentData[key]) && Array.isArray(lastSubmittedData[key])) {
                // Compare arrays (e.g., tags, faqs, categoryIds)
                if (currentData[key].length !== lastSubmittedData[key].length) return true;
                if (key === 'faqs') { // Deep compare FAQ objects
                    return currentData[key].some((faq, index) =>
                        faq.question !== lastSubmittedData[key][index]?.question ||
                        faq.answer !== lastSubmittedData[key][index]?.answer
                    );
                }
                return !currentData[key].every((item, index) => item === lastSubmittedData[key][index]);
            }
            return currentData[key] !== lastSubmittedData[key];
        });

        setHasChanges(isDifferent);

    }, [formData, selectedCategories, lastSubmittedData]);

    const fetchCategories = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/categories');
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

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
                    categoryIds: selectedCategories
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Failed to create post' }));
                console.error('Backend error:', errorData);
                throw new Error(errorData.error || errorData.message || 'Failed to create post');
            }

            const post = await response.json();

            // Mark as saved - disable buttons until next change
            setHasChanges(false);
            setLastSubmittedData({
                ...formData,
                status,
                categoryIds: selectedCategories
            });

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
            .replace(/[^a-z0-9\\s-]/g, '')
            .replace(/\\s+/g, '-')
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
                <div className="container mx-auto px-6 max-w-full py-3">
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
                                disabled={loading || !formData.title || !formData.content || !hasChanges}
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
                                disabled={loading || !formData.title || !formData.content || !hasChanges}
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
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Title *</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={handleTitleChange}
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
                                placeholder="auto-generated-from-title"
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
                                placeholder="Short description for SEO and previews..."
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
                                placeholder="Start writing your post..."
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
