"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { CheckCircle, XCircle, Clock, Eye, FileText, Calendar } from 'lucide-react';
import PostStatusBadge from '@/components/PostStatusBadge';
import Link from 'next/link';

export default function ReviewerDashboard() {
    const router = useRouter();
    const { user, canReviewPost } = useAuth();
    const [pendingPosts, setPendingPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPost, setSelectedPost] = useState(null);
    const [reviewComments, setReviewComments] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!canReviewPost()) {
            router.push('/dashboard');
            return;
        }
        fetchPendingReviews();
    }, []);

    const fetchPendingReviews = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/reviews/pending', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setPendingPosts(data);
            }
        } catch (error) {
            console.error('Error fetching pending reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (postId) => {
        if (!reviewComments.trim()) {
            alert('Please add review comments');
            return;
        }

        setSubmitting(true);
        try {
            const response = await fetch(`http://localhost:8080/api/reviews/${postId}/approve`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ comments: reviewComments }),
            });

            if (response.ok) {
                alert('Post approved successfully!');
                setSelectedPost(null);
                setReviewComments('');
                fetchPendingReviews();
            } else {
                const error = await response.json();
                alert(error.error || 'Failed to approve post');
            }
        } catch (error) {
            console.error('Error approving post:', error);
            alert('Error approving post');
        } finally {
            setSubmitting(false);
        }
    };

    const handleReject = async (postId) => {
        if (!reviewComments.trim()) {
            alert('Please add review comments explaining the rejection');
            return;
        }

        setSubmitting(true);
        try {
            const response = await fetch(`http://localhost:8080/api/reviews/${postId}/reject`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ comments: reviewComments }),
            });

            if (response.ok) {
                alert('Post rejected');
                setSelectedPost(null);
                setReviewComments('');
                fetchPendingReviews();
            } else {
                const error = await response.json();
                alert(error.error || 'Failed to reject post');
            }
        } catch (error) {
            console.error('Error rejecting post:', error);
            alert('Error rejecting post');
        } finally {
            setSubmitting(false);
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
                    <p className="text-muted-foreground">Review and approve posts for publication</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-muted-foreground">Pending Reviews</span>
                            <Clock className="w-5 h-5 text-blue-500" />
                        </div>
                        <p className="text-3xl font-bold text-blue-500">{pendingPosts.length}</p>
                    </div>
                </div>

                {/* Pending Posts */}
                {pendingPosts.length === 0 ? (
                    <div className="text-center py-16 border-2 border-dashed border-border rounded-xl">
                        <CheckCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                        <h3 className="text-xl font-semibold mb-2">All caught up!</h3>
                        <p className="text-muted-foreground">No posts pending review at the moment</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold mb-4">Posts Awaiting Review</h2>
                        {pendingPosts.map((post) => (
                            <div
                                key={post.id}
                                className="p-6 rounded-xl bg-secondary/5 border border-border hover:border-primary/30 transition-all"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-xl font-bold">{post.title}</h3>
                                            <PostStatusBadge status={post.status} />
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-3">
                                            By {post.createdBy?.username || 'Unknown'} • {new Date(post.createdAt).toLocaleDateString()}
                                        </p>
                                        {post.excerpt && (
                                            <p className="text-muted-foreground line-clamp-2 mb-4">{post.excerpt}</p>
                                        )}
                                    </div>
                                </div>

                                {selectedPost?.id === post.id ? (
                                    <div className="mt-4 p-4 bg-background rounded-lg border border-border">
                                        <h4 className="font-semibold mb-3">Review Comments</h4>
                                        <textarea
                                            value={reviewComments}
                                            onChange={(e) => setReviewComments(e.target.value)}
                                            placeholder="Add your review comments here..."
                                            className="w-full px-4 py-3 rounded-lg bg-secondary/10 border border-border focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 mb-4"
                                            rows={4}
                                        />
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => handleApprove(post.id)}
                                                disabled={submitting}
                                                className="px-6 py-2 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                                            >
                                                <CheckCircle className="w-4 h-4" />
                                                {submitting ? 'Approving...' : 'Approve'}
                                            </button>
                                            <button
                                                onClick={() => handleReject(post.id)}
                                                disabled={submitting}
                                                className="px-6 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                                            >
                                                <XCircle className="w-4 h-4" />
                                                {submitting ? 'Rejecting...' : 'Reject'}
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSelectedPost(null);
                                                    setReviewComments('');
                                                }}
                                                className="px-6 py-2 rounded-lg border border-border hover:bg-secondary/10 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex gap-3">
                                        <Link
                                            href={`/blogs/${post.slug}`}
                                            target="_blank"
                                            className="px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm font-medium flex items-center gap-2"
                                        >
                                            <Eye className="w-4 h-4" />
                                            Preview
                                        </Link>
                                        <button
                                            onClick={() => setSelectedPost(post)}
                                            className="px-4 py-2 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-colors text-sm font-medium flex items-center gap-2"
                                        >
                                            <FileText className="w-4 h-4" />
                                            Review
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
