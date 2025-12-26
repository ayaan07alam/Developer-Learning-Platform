"use client";
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { MessageSquare, Send, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function InternalAuditChat({ postId }) {
    const { user, token } = useAuth();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const endRef = useRef(null);

    useEffect(() => {
        fetchComments();
        // Poll every 10 seconds for new comments
        const interval = setInterval(fetchComments, 10000);
        return () => clearInterval(interval);
    }, [postId]);

    const fetchComments = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/reviews/${postId}/chat`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setComments(data);
            }
        } catch (error) {
            console.error('Error fetching internal comments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setSending(true);
        try {
            const response = await fetch(`http://localhost:8080/api/reviews/${postId}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ content: newComment })
            });

            if (response.ok) {
                setNewComment('');
                fetchComments();
            }
        } catch (error) {
            console.error('Error sending comment:', error);
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="bg-card border border-border rounded-lg flex flex-col h-[500px]">
            <div className="p-4 border-b border-border flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-primary" />
                <h3 className="font-semibold text-sm">Internal Team Chat</h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {loading ? (
                    <div className="text-center text-xs text-muted-foreground">Loading chat...</div>
                ) : comments.length === 0 ? (
                    <div className="text-center text-xs text-muted-foreground py-8">
                        No internal comments yet.<br />Start a discussion!
                    </div>
                ) : (
                    comments.slice().reverse().map((comment) => (
                        <div key={comment.id} className={`flex gap-3 ${comment.user.id === user?.id ? 'flex-row-reverse' : ''}`}>
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                {comment.user?.profilePhoto ? (
                                    <img src={comment.user.profilePhoto} alt={comment.user.username} className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    <User className="w-4 h-4 text-primary" />
                                )}
                            </div>
                            <div className={`flex flex-col max-w-[80%] ${comment.user.id === user?.id ? 'items-end' : 'items-start'}`}>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-semibold">{comment.user.username}</span>
                                    {comment.user.role && (
                                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                                            {comment.user.role}
                                        </span>
                                    )}
                                    <span className="text-[10px] text-muted-foreground">
                                        {new Date(comment.createdAt).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <div className={`px-3 py-2 rounded-lg text-sm ${comment.user.id === user?.id
                                        ? 'bg-primary text-primary-foreground rounded-tr-none'
                                        : 'bg-muted text-foreground rounded-tl-none'
                                    }`}>
                                    {comment.content}
                                </div>
                            </div>
                        </div>
                    ))
                )}
                <div ref={endRef} />
            </div>

            <form onSubmit={handleSend} className="p-3 border-t border-border flex gap-2">
                <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 text-sm bg-secondary/10 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <Button
                    type="submit"
                    size="icon"
                    disabled={sending || !newComment.trim()}
                    className="h-9 w-9"
                >
                    <Send className="w-4 h-4" />
                </Button>
            </form>
        </div>
    );
}
