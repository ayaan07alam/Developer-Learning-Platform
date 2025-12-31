"use client";
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import RichTextEditor from '@/components/RichTextEditor';
import FAQBuilder from '@/components/FAQBuilder';
import { Button } from '@/components/ui/button';
import { Save, Eye, Trash2 } from 'lucide-react';
import CustomDialog from '@/components/CustomDialog';
import MediaLibrary from '@/components/MediaLibrary';
import { useDialog } from '@/lib/useDialog';
import { API_BASE_URL } from '@/lib/api-client';

export default function NewPostPage() {
    const router = useRouter();
    const { user, token, isAuthenticated, isEditor } = useAuth();
    const [loading, setLoading] = useState(false); // General loading for form
    const [savingDraft, setSavingDraft] = useState(false); // Specific to Save Draft button
    const [submitting, setSubmitting] = useState(false); // Specific to Submit button
    const [error, setError] = useState('');
    const [showPreview, setShowPreview] = useState(false);
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [hasChanges, setHasChanges] = useState(true); // Track if form has unsaved changes
    const [lastSubmittedData, setLastSubmittedData] = useState(null); // Track last submitted state
    const { showAlert, dialogState, handleClose, handleConfirm } = useDialog();

    // Media Library Modal State
    const [showMediaModal, setShowMediaModal] = useState(false);
    // Callback to handle what happens when an image is selected
    // If null, it means we are just viewing the library (though usually we select)
    // We store the handler here to reuse the modal for both Featured Image and RichText
    const [onMediaSelect, setOnMediaSelect] = useState(null);

    // Editor Reference
    const editorRef = useRef(null);

    // Track if a post has been created (to switch from POST to PUT)
    const [createdPostId, setCreatedPostId] = useState(null);

    // Ref for blocking duplicate submissions
    const isSubmitting = useRef(false);

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
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }
        // Allow all authenticated users to create posts (VIEWER = writer per requirement)
        if (!user?.role || !['USER', 'VIEWER', 'WRITER', 'EDITOR', 'ADMIN'].includes(user.role)) {
            router.push('/dashboard');
            return;
        }
    }, [isAuthenticated, user, router]);

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
            const response = await fetch(`${API_BASE_URL}/api/categories`);
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleSubmit = async (status) => {
        // Generate unique request ID
        const requestId = `${Date.now()}-${Math.random()}`;
        const isUpdate = createdPostId !== null; // Check if we're updating an existing post

        console.log(`[handleSubmit] Starting request ${requestId} with status: ${status}, isUpdate: ${isUpdate}, postId: ${createdPostId}`);

        // Set specific loading state based on action
        if (status === 'DRAFT') {
            setSavingDraft(true);
        } else {
            setSubmitting(true);
        }
        setError('');

        try {
            // Use PUT for updates, POST for creation
            const method = isUpdate ? 'PUT' : 'POST';
            const url = isUpdate
                ? `${API_BASE_URL}/api/posts/${createdPostId}`
                : `${API_BASE_URL}/api/posts`;

            console.log(`[${requestId}] Sending ${method} to ${url}`);

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    status,
                    categoryIds: selectedCategories
                })
            });

            console.log(`[${requestId}] Response status: ${response.status}`);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || errorData.message || 'Failed to save post');
            }

            const data = await response.json();
            console.log(`[${requestId}] ${isUpdate ? 'Post updated' : 'Post created'} successfully:`, data.id);

            // Store post ID after first creation
            if (!isUpdate && data.id) {
                setCreatedPostId(data.id);
                console.log(`[${requestId}] Stored post ID for future updates: ${data.id}`);
            }

            setLastSubmittedData({
                ...formData,
                status,
                categoryIds: selectedCategories
            });

            // Show success and redirect based on status
            if (status === 'DRAFT') {
                showAlert(isUpdate ? 'Draft updated!' : 'Post saved as draft!', {
                    title: 'Success'
                });
                setHasChanges(false); // CRITICAL: Reset to prevent re-saves
                // Stay on page for drafts
            } else if (status === 'UNDER_REVIEW') {
                showAlert('Post submitted for review!', {
                    title: 'Success'
                });
                setHasChanges(false);
                router.push('/dashboard/write');
            } else if (status === 'PUBLISHED') {
                showAlert('Post published successfully!', {
                    title: 'Success'
                });
                setHasChanges(false);
                router.push('/dashboard/posts');
            }
        } catch (err) {
            console.error(`[${requestId}] Error:`, err);
            setError(err.message || 'Failed to save post');
            setHasChanges(true); // Keep changes on error
        } finally {
            // Reset specific loading states
            setSavingDraft(false);
            setSubmitting(false);
        }
    };

    // Separate handlers for each button to prevent cross-triggering
    const handleSaveDraft = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        // BLOCK HERE - before any async operations
        if (isSubmitting.current || savingDraft || submitting) {
            console.log('Save Draft: Already submitting, blocked');
            return;
        }
        isSubmitting.current = true;

        console.log('Save Draft clicked');
        try {
            await handleSubmit('DRAFT');
        } finally {
            isSubmitting.current = false;
        }
    };

    const handleSubmitForReview = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        // BLOCK HERE - before any async operations
        if (isSubmitting.current || savingDraft || submitting) {
            console.log('Submit for Review: Already submitting, blocked');
            return;
        }
        isSubmitting.current = true;

        console.log('Submit for Review clicked');
        try {
            const canPublish = user?.role && ['EDITOR', 'ADMIN'].includes(user.role);
            await handleSubmit(canPublish ? 'PUBLISHED' : 'UNDER_REVIEW');
        } finally {
            isSubmitting.current = false;
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

    // Calculate word count
    const wordCount = formData.content
        ? formData.content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().split(/\s+/).filter(w => w.length > 0).length
        : 0;

    const handleTitleChange = (e) => {
        const title = e.target.value;
        setFormData({
            ...formData,
            title,
            slug: generateSlug(title)
        });
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

    if (!isAuthenticated || !user?.role || !['USER', 'VIEWER', 'WRITER', 'EDITOR', 'ADMIN'].includes(user.role)) {
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
                        {error && (
                            <div className="px-4 py-2 rounded-lg bg-red-500/20 border border-red-500/50 text-red-600 dark:text-red-400 text-sm font-medium">
                                {error}
                            </div>
                        )}
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-muted-foreground font-medium mr-2">
                                {wordCount} words
                            </span>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleSaveDraft}
                                disabled={savingDraft || submitting || !formData.title || !formData.content || !hasChanges}
                                className={`gap-2 border-2 hover:bg-secondary/20 shadow-md transition-all ${(savingDraft || submitting) ? 'pointer-events-none opacity-50' : 'hover:scale-105'}`}
                            >
                                {savingDraft ? (
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
                                onClick={handleSubmitForReview}
                                disabled={savingDraft || submitting || !formData.title || !formData.content}
                                className={`gap-2 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700 text-white shadow-lg shadow-primary/30 transition-all ${(savingDraft || submitting) ? 'pointer-events-none opacity-50' : 'hover:scale-105'}`}
                            >
                                {submitting ? (
                                    <>
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                        <span>{user?.role && ['EDITOR', 'ADMIN'].includes(user.role) ? 'Publishing...' : 'Submitting...'}</span>
                                    </>
                                ) : (
                                    <>
                                        <Eye className="w-4 h-4" />
                                        <span>{user?.role && ['EDITOR', 'ADMIN'].includes(user.role) ? 'Publish' : 'Submit for Review'}</span>
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
                                placeholder="Start writing your post..."
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
        </div >
    );
}
