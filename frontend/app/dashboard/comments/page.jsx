"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { useRouter } from 'next/navigation';
import { MessageCircle, Check, X, AlertTriangle, Trash2, RefreshCw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import CustomDialog from '@/components/CustomDialog';
import { useDialog } from '@/lib/useDialog';

export default function CommentsPage() {
    const [comments, setComments] = useState([]);
    const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0, spam: 0 });
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('PENDING');
    const { user, token } = useAuth();
    const toast = useToast();
    const router = useRouter();
    const { showConfirm, dialogState, handleClose, handleConfirm } = useDialog();

    useEffect(() => {
        if (!user || user.role !== 'ADMIN') {
            router.push('/dashboard');
            return;
        }
        fetchStats();
        fetchComments();
    }, [filter]);

    const fetchStats = async () => {
        try {
            const res = await fetch('http://localhost:8080/api/admin/comments/stats', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setStats(data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const fetchComments = async () => {
        setLoading(true);
        try {
            const url = filter === 'ALL'
                ? 'http://localhost:8080/api/admin/comments'
                : `http://localhost:8080/api/admin/comments?status=${filter}`;

            const res = await fetch(url, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setComments(data);
        } catch (error) {
            console.error('Error fetching comments:', error);
            toast.error('Failed to load comments');
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (commentId, action) => {
        try {
            const res = await fetch(`http://localhost:8080/api/admin/comments/${commentId}/${action}`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                toast.success(`Comment ${action}d successfully`);
                fetchComments();
                fetchStats();
            } else {
                toast.error(`Failed to ${action} comment`);
            }
        } catch (error) {
            console.error(`Error ${action}ing comment:`, error);
            toast.error(`Failed to ${action} comment`);
        }
    };

    const handleDelete = async (commentId) => {
        const confirmed = await showConfirm('Are you sure you want to delete this comment?', {
            title: 'Delete Comment',
            variant: 'danger'
        });
        if (!confirmed) return;

        try {
            const res = await fetch(`http://localhost:8080/api/admin/comments/${commentId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                toast.success('Comment deleted successfully');
                fetchComments();
                fetchStats();
            } else {
                toast.error('Failed to delete comment');
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
            toast.error('Failed to delete comment');
        }
    };

    const formatDate = (dateString) => {
        try {
            return formatDistanceToNow(new Date(dateString), { addSuffix: true });
        } catch {
            return 'recently';
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 bg-background">
            <div className="container mx-auto px-6 max-w-7xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Comment Moderation</h1>
                    <p className="text-muted-foreground">Manage and moderate user comments</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="p-4 bg-card border border-border rounded-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Pending</p>
                                <p className="text-2xl font-bold text-yellow-500">{stats.pending}</p>
                            </div>
                            <MessageCircle className="w-8 h-8 text-yellow-500" />
                        </div>
                    </div>
                    <div className="p-4 bg-card border border-border rounded-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Approved</p>
                                <p className="text-2xl font-bold text-green-500">{stats.approved}</p>
                            </div>
                            <Check className="w-8 h-8 text-green-500" />
                        </div>
                    </div>
                    <div className="p-4 bg-card border border-border rounded-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Rejected</p>
                                <p className="text-2xl font-bold text-red-500">{stats.rejected}</p>
                            </div>
                            <X className="w-8 h-8 text-red-500" />
                        </div>
                    </div>
                    <div className="p-4 bg-card border border-border rounded-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Spam</p>
                                <p className="text-2xl font-bold text-orange-500">{stats.spam}</p>
                            </div>
                            <AlertTriangle className="w-8 h-8 text-orange-500" />
                        </div>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 mb-6 border-b border-border">
                    {['PENDING', 'APPROVED', 'REJECTED', 'SPAM', 'ALL'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-2 font-medium transition-colors ${filter === status
                                ? 'text-primary border-b-2 border-primary'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            {status.charAt(0) + status.slice(1).toLowerCase()}
                        </button>
                    ))}
                </div>

                {/* Comments List */}
                {loading ? (
                    <div className="text-center py-12">
                        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                        <p className="text-muted-foreground">Loading comments...</p>
                    </div>
                ) : comments.length > 0 ? (
                    <div className="space-y-4">
                        {comments.map((comment) => (
                            <div key={comment.id} className="p-6 bg-card border border-border rounded-lg">
                                {/* Comment Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-semibold">{comment.authorName}</span>
                                            <span className="text-sm text-muted-foreground">{comment.authorEmail}</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            {formatDate(comment.createdAt)} • Post ID: {comment.postId}
                                        </p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${comment.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500' :
                                        comment.status === 'APPROVED' ? 'bg-green-500/10 text-green-500' :
                                            comment.status === 'REJECTED' ? 'bg-red-500/10 text-red-500' :
                                                'bg-orange-500/10 text-orange-500'
                                        }`}>
                                        {comment.status}
                                    </span>
                                </div>

                                {/* Comment Content */}
                                <p className="text-foreground mb-4 whitespace-pre-wrap">{comment.content}</p>

                                {/* Actions */}
                                <div className="flex gap-2">
                                    {comment.status !== 'APPROVED' && (
                                        <button
                                            onClick={() => handleAction(comment.id, 'approve')}
                                            className="flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-500 rounded-lg hover:bg-green-500/20 transition-colors"
                                        >
                                            <Check className="w-4 h-4" />
                                            Approve
                                        </button>
                                    )}
                                    {comment.status !== 'REJECTED' && (
                                        <button
                                            onClick={() => handleAction(comment.id, 'reject')}
                                            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                            Reject
                                        </button>
                                    )}
                                    {comment.status !== 'SPAM' && (
                                        <button
                                            onClick={() => handleAction(comment.id, 'spam')}
                                            className="flex items-center gap-2 px-4 py-2 bg-orange-500/10 text-orange-500 rounded-lg hover:bg-orange-500/20 transition-colors"
                                        >
                                            <AlertTriangle className="w-4 h-4" />
                                            Spam
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(comment.id)}
                                        className="flex items-center gap-2 px-4 py-2 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 transition-colors ml-auto"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 text-muted-foreground">
                        No {filter.toLowerCase()} comments found.
                    </div>
                )}
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
