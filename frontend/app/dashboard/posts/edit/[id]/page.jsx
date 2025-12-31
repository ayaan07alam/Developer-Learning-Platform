"use client";
import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import RichTextEditor from '@/components/RichTextEditor';
import FAQBuilder from '@/components/FAQBuilder';
import { Button } from '@/components/ui/button';
import { Save, Eye, Trash2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import InternalAuditChat from '@/components/InternalAuditChat';
import CustomDialog from '@/components/CustomDialog';
import MediaLibrary from '@/components/MediaLibrary';
import { useDialog } from '@/lib/useDialog';
import { API_BASE_URL } from '@/lib/api-client';

export default function EditPostPage() {
    const router = useRouter();
    const params = useParams();
    const { user, token, isAuthenticated, isEditor, isReviewer, isAdmin } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const { showConfirm, dialogState, handleClose, handleConfirm } = useDialog();

    // Media Library Modal State
    const [showMediaModal, setShowMediaModal] = useState(false);
    const [onMediaSelect, setOnMediaSelect] = useState(null);
    const editorRef = useRef(null);

    // Revision tracking
    const [originalPost, setOriginalPost] = useState(null);
    const [revisionId, setRevisionId] = useState(null);
    const [isEditingPublished, setIsEditingPublished] = useState(false);

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

    // Auth check - Allow all authenticated users, will verify ownership in fetchPost
    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }
        // Allow all authenticated users to access edit page
        // Ownership will be verified when fetching the post
        fetchPost();
        fetchCategories();
    }, [isAuthenticated, router, params.id]);

    const fetchCategories = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/categories`);
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchPost = async () => {
        try {
            console.log('Fetching post:', params.id);
            const response = await fetch(`${API_BASE_URL}/api/posts/${params.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Failed to fetch post' }));
                throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
            }

            const post = await response.json();
            console.log('Post fetched:', post);
            setOriginalPost(post);

            // If post is PUBLISHED, check for active draft revision
            if (post.status === 'PUBLISHED' && !isReviewer) {
                await fetchOrCreateRevision(post);
            } else {
                // For non-published posts or reviewers, edit directly
                loadPostData(post);
            }
        } catch (err) {
            console.error('Error fetching post:', err);
            setError(err.message || 'Failed to load post');
        } finally {
            setLoading(false);
        }
    };

    const fetchOrCreateRevision = async (post) => {
        try {
            // Check if there's an active draft
            const revisionRes = await fetch(`${API_BASE_URL}/api/revisions/posts/${post.id}/active`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (revisionRes.ok) {
                // Load existing revision
                const revision = await revisionRes.json();
                setRevisionId(revision.id);
                setIsEditingPublished(true);
                loadRevisionData(revision);
            } else {
                // Create new revision
                const createRes = await fetch(`${API_BASE_URL}/api/revisions/posts/${post.id}`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (createRes.ok) {
                    const revision = await createRes.json();
                    setRevisionId(revision.id);
                    setIsEditingPublished(true);
                    loadRevisionData(revision);
                } else {
                    // Fall back to editing post directly
                    loadPostData(post);
                }
            }
        } catch (err) {
            console.error('Error with revision:', err);
            loadPostData(post);
        }
    };

    const loadPostData = (post) => {
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
        if (post.categories && post.categories.length > 0) {
            setSelectedCategories(post.categories.map(cat => cat.id));
        }
    };

    const loadRevisionData = (revision) => {
        setFormData({
            title: revision.title || '',
            slug: revision.slug || '',
            excerpt: revision.excerpt || '',
            content: revision.content || '',
            mainImage: revision.mainImage || '',
            metaTitle: revision.metaTitle || '',
            metaDescription: revision.metaDescription || '',
            tags: revision.tags || [],
            faqs: revision.faqs || [],
            status: 'DRAFT' // Revisions are always drafts
        });
        if (revision.categories && revision.categories.length > 0) {
            setSelectedCategories(revision.categories.map(cat => cat.id));
        }
    };

    // Media Library Handlers
    const openMediaForFeaturedImage = () => {
        setOnMediaSelect(() => (url) => {
            setFormData(prev => ({ ...prev, mainImage: url }));
            setShowMediaModal(false);
        });
        setShowMediaModal(true);
    };

    const openMediaForEditor = () => {
        setOnMediaSelect(() => (url) => {
            editorRef.current?.chain().focus().setImage({ src: url }).run();
            setShowMediaModal(false);
        });
        setShowMediaModal(true);
    };

    const handleMediaSelect = (url) => {
        if (onMediaSelect) {
            onMediaSelect(url);
        }
        setShowMediaModal(false);
    };

    const handleSubmit = async (targetAction) => {
        setSaving(true);
        setError('');
        setSuccessMessage('');

        try {
            if (isEditingPublished && revisionId) {
                // Working with a revision
                if (targetAction === 'PUBLISHED') {
                    // Publish the revision (apply changes to live post)
                    const response = await fetch(`${API_BASE_URL}/api/revisions/${revisionId}/publish`, {
                        method: 'POST',
                        headers: { 'Authorization': `Bearer ${token}` }
                    });

                    if (!response.ok) {
                        throw new Error('Failed to publish revision');
                    }

                    setSuccessMessage('🎉 Post published successfully!');
                    setIsEditingPublished(false);
                    setRevisionId(null);
                } else {
                    // Save revision draft
                    const response = await fetch(`${API_BASE_URL}/api/revisions/${revisionId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            ...formData,
                            tags: formData.tags.filter(t => t.trim()),
                            categoryIds: selectedCategories
                        })
                    });

                    if (!response.ok) {
                        const errorData = await response.json().catch(() => ({}));
                        throw new Error(errorData.message || errorData.error || 'Failed to save revision');
                    }

                    setSuccessMessage('✅ Draft saved successfully!');
                }
            } else {
                // Normal post update
                const response = await fetch(`${API_BASE_URL}/api/posts/${params.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        ...formData,
                        status: targetAction,
                        tags: formData.tags.filter(t => t.trim()),
                        categoryIds: selectedCategories
                    })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || errorData.error || 'Failed to update post');
                }

                if (targetAction === 'PUBLISHED') {
                    setSuccessMessage('🎉 Post published successfully!');                  // Stay on page to allow further edits
                } else if (targetAction === 'UNDER_REVIEW') {
                    setSuccessMessage('📝 Post submitted for review!');
                    // Stay on page
                } else {
                    setSuccessMessage('✅ Changes saved successfully!');
                    // Stay on page for drafts
                }
            }

            // Refresh post data to show updated values
            await fetchPost();

            // Auto-hide success message after 5 seconds
            setTimeout(() => setSuccessMessage(''), 5000);
        } catch (err) {
            console.error('Save error:', err);
            setError(err.message || 'Failed to save post');
        } finally {
            setSaving(false);
        }
    };

    const handleDiscardDraft = async () => {
        if (!revisionId) return;

        const confirmed = await showConfirm('Discard all changes and keep the published version?', {
            title: 'Discard Draft',
            variant: 'danger'
        });
        if (!confirmed) return;

        try {
            const response = await fetch(`${API_BASE_URL}/api/revisions/${revisionId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                router.push('/dashboard/posts');
            }
        } catch (err) {
            setError('Failed to discard draft');
        }
    };

    if (!isAuthenticated) {
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

    if (error) {
        return (
            <div className="min-h-screen pt-24 pb-12 bg-background flex items-center justify-center">
                <div className="text-center max-w-md px-6">
                    <h2 className="text-2xl font-bold text-red-500 mb-4">Error Loading Post</h2>
                    <p className="text-muted-foreground mb-6">{error}</p>
                    <Link href="/dashboard/write" className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors inline-block">
                        Back to Dashboard
                    </Link>
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

                            {/* Discard Draft Button (for revisions only) */}
                            {isEditingPublished && revisionId && (
                                <Button
                                    onClick={handleDiscardDraft}
                                    disabled={saving}
                                    variant="outline"
                                    size="sm"
                                    className="text-red-500 hover:text-red-600"
                                >
                                    Discard Draft
                                </Button>
                            )}

                            {/* Role-based Action Buttons */}
                            {isReviewer ? (
                                // Reviewers can only submit for approval
                                <Button
                                    onClick={() => handleSubmit('UNDER_REVIEW')}
                                    disabled={saving || !formData.title || !formData.content}
                                    size="sm"
                                    className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
                                >
                                    {saving ? 'Submitting...' : 'Submit for Approval'}
                                </Button>
                            ) : isEditor || isAdmin ? (
                                // Editors and Admins can publish directly
                                <>
                                    {formData.status === 'UNDER_REVIEW' && !isEditingPublished && (
                                        <Button
                                            onClick={() => handleSubmit('REJECTED')}
                                            disabled={saving}
                                            variant="destructive"
                                            size="sm"
                                            className="bg-red-500 hover:bg-red-600 text-white shadow-lg"
                                        >
                                            Reject
                                        </Button>
                                    )}
                                    <Button
                                        onClick={() => handleSubmit('PUBLISHED')}
                                        disabled={saving || !formData.title || !formData.content}
                                        size="sm"
                                        className="bg-green-600 hover:bg-green-700 text-white shadow-lg"
                                    >
                                        {isEditingPublished ? 'Publish Changes' : formData.status === 'PUBLISHED' ? 'Update & Publish' : 'Publish'}
                                    </Button>
                                </>
                            ) : (
                                // Regular users (VIEWER/USER/WRITER) submit for review
                                <Button
                                    onClick={() => handleSubmit('UNDER_REVIEW')}
                                    disabled={saving || !formData.title || !formData.content}
                                    size="sm"
                                    className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
                                >
                                    {saving ? 'Submitting...' : 'Submit for Review'}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 max-w-full mt-6">

                {/* Draft Revision Banner */}
                {isEditingPublished && (
                    <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-blue-700 font-medium">
                                    📝 Editing Draft - The live version remains published
                                </p>
                                <p className="mt-1 text-xs text-blue-600">
                                    Your changes are saved as a draft. Click "Publish Changes" to make them live, or "Discard Draft" to abandon your edits.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Success Message */}
                {successMessage && (
                    <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-green-700 font-medium">
                                    {successMessage}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

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
                            <div className="flex gap-2">
                                <input
                                    type="url"
                                    value={formData.mainImage}
                                    onChange={(e) => setFormData({ ...formData, mainImage: e.target.value })}
                                    className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="https://example.com/image.jpg"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={openMediaForFeaturedImage}
                                    className="shrink-0"
                                >
                                    Select Image
                                </Button>
                            </div>
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
                                onRequestImage={openMediaForEditor}
                                onEditorReady={(editor) => { editorRef.current = editor; }}
                            />
                        </div>
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

            {/* Media Library Modal */}
            {showMediaModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-background rounded-xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col border border-border">
                        <div className="flex items-center justify-between p-4 border-b border-border">
                            <h2 className="text-lg font-semibold">Media Library</h2>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowMediaModal(false)}
                            >
                                ✕
                            </Button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4">
                            <MediaLibrary
                                isModal={true}
                                onSelect={handleMediaSelect}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
