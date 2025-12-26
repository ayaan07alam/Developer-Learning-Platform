"use client";
import { useState, useEffect } from 'react';
import { Clock, FileEdit, CheckCircle, XCircle, Eye, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function ImprovementDraftsSection({ userId }) {
    const [drafts, setDrafts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchImprovementDrafts();
    }, []);

    const fetchImprovementDrafts = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/content/improvement-drafts', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setDrafts(data);
            }
        } catch (error) {
            console.error('Error fetching improvement drafts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDiscard = async (id) => {
        if (!confirm('Are you sure you want to discard this draft?')) return;

        try {
            const response = await fetch(`http://localhost:8080/api/revisions/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                fetchImprovementDrafts(); // Refresh list
            }
        } catch (error) {
            console.error('Error discarding draft:', error);
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            DRAFT: { bg: 'bg-gray-500/10', text: 'text-gray-500', label: 'Draft' },
            PENDING: { bg: 'bg-yellow-500/10', text: 'text-yellow-500', label: 'Pending Review' },
            APPROVED: { bg: 'bg-green-500/10', text: 'text-green-500', label: 'Approved' }
        };

        const badge = badges[status] || badges.DRAFT;

        return (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}>
                {badge.label}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (drafts.length === 0) {
        return (
            <div className="text-center py-12 bg-secondary/5 rounded-xl border border-border">
                <FileEdit className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No Improvement Drafts</h3>
                <p className="text-muted-foreground text-sm">
                    You don't have any posts currently being edited.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Improvement Drafts ({drafts.length})</h2>
            </div>

            <div className="grid gap-4">
                {drafts.map((draft) => (
                    <div
                        key={draft.id}
                        className="p-6 rounded-xl bg-secondary/5 border border-border hover:border-primary/50 transition-all"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                <h3 className="text-xl font-bold mb-2">{draft.title}</h3>
                                <p className="text-sm text-muted-foreground mb-3">
                                    Original Post: {draft.originalPost?.title}
                                </p>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        Updated {new Date(draft.updatedAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                            <div>
                                {getStatusBadge(draft.status)}
                            </div>
                        </div>

                        {draft.revisionNotes && (
                            <div className="mb-4 p-3 bg-muted/20 rounded-lg">
                                <p className="text-sm text-muted-foreground">
                                    <strong>Notes:</strong> {draft.revisionNotes}
                                </p>
                            </div>
                        )}

                        <div className="flex gap-2">
                            <Link
                                href={`/dashboard/posts/edit/${draft.originalPost?.id}?revision=${draft.id}`}
                                className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors text-sm font-medium flex items-center gap-2"
                            >
                                <FileEdit className="w-4 h-4" />
                                Continue Editing
                            </Link>
                            <Link
                                href={`/blogs/${draft.originalPost?.slug}`}
                                target="_blank"
                                className="px-4 py-2 rounded-lg border border-border hover:bg-secondary/10 transition-colors text-sm font-medium flex items-center gap-2"
                            >
                                <Eye className="w-4 h-4" />
                                View Published
                            </Link>
                            <button
                                onClick={() => handleDiscard(draft.id)}
                                className="px-4 py-2 rounded-lg border border-red-500/50 text-red-500 hover:bg-red-500/10 transition-colors text-sm font-medium flex items-center gap-2"
                            >
                                <Trash2 className="w-4 h-4" />
                                Discard
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
