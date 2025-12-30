"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { FileEdit, Clock, CheckCircle } from 'lucide-react';
import PostStatusBadge from '@/components/PostStatusBadge';
import Link from 'next/link';
import { API_BASE_URL } from '@/lib/api-client';

export default function ReviewerDashboard() {
    const router = useRouter();
    const { user, isReviewer, isAdmin } = useAuth();
    const [drafts, setDrafts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isReviewer && !isAdmin) {
            router.push('/dashboard');
            return;
        }
        fetchDrafts();
    }, [isReviewer, isAdmin, router]);

    const fetchDrafts = async () => {
        try {
            // Fetch all posts and filter client-side for DRAFT, REJECTED, and UNDER_REVIEW
            // DRAFT: Available to pick up
            // REJECTED: Returned for revision
            // UNDER_REVIEW: Submitted and pending approval (for reference)
            const response = await fetch(`${API_BASE_URL}/api/posts`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                const availablePosts = data.filter(p =>
                    p.status === 'DRAFT' ||
                    p.status === 'REJECTED' ||
                    p.status === 'UNDER_REVIEW'
                );
                setDrafts(availablePosts);
            }
        } catch (error) {
            console.error('Error fetching drafts:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 bg-background">
            <div className="container mx-auto px-6 max-w-7xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">Reviewer Dashboard</h1>
                    <p className="text-muted-foreground">Pick up drafts to edit and submit for approval.</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="p-6 rounded-xl bg-card border border-border">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-muted-foreground">Available Drafts</span>
                            <FileEdit className="w-5 h-5 text-primary" />
                        </div>
                        <p className="text-3xl font-bold">{drafts.length}</p>
                    </div>
                </div>

                {/* Available Drafts */}
                <div className="bg-card border border-border rounded-xl overflow-hidden">
                    <div className="p-6 border-b border-border">
                        <h3 className="text-xl font-bold">Drafts Available for Editing</h3>
                    </div>
                    {drafts.length === 0 ? (
                        <div className="p-12 text-center text-muted-foreground">
                            No drafts available at the moment.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-secondary/20">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Title</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Author</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Created</th>
                                        <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {drafts.map((post) => (
                                        <tr key={post.id} className="hover:bg-secondary/5">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-foreground">{post.title}</div>
                                                {post.excerpt && (
                                                    <div className="text-xs text-muted-foreground mt-1 line-clamp-1">{post.excerpt}</div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-muted-foreground">
                                                {post.author?.name || post.createdBy?.displayName || 'Unknown'}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-muted-foreground">
                                                {new Date(post.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Link
                                                    href={`/dashboard/posts/edit/${post.id}`}
                                                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
                                                >
                                                    Edit & Submit
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
