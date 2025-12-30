"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Sidebar from "@/components/sidebar";
import { Users, FileText, Database, Settings, Shield, Activity, Trash2, Check, X, AlertCircle } from "lucide-react";
import ImprovementDraftsSection from "@/components/ImprovementDraftsSection";
import ContentManagementSection from "@/components/ContentManagementSection";
import Link from "next/link";
import CustomDialog from "@/components/CustomDialog";
import { useDialog } from "@/lib/useDialog";
import { API_BASE_URL } from "@/lib/api-client";

export default function AdminDashboard() {
    const router = useRouter();
    const { user, loading, isAdmin } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState({
        users: 0,
        posts: 0,
        comments: 0,
    });
    const [deletionRequests, setDeletionRequests] = useState([]);
    const [loadingRequests, setLoadingRequests] = useState(false);
    const [processingId, setProcessingId] = useState(null);
    const { showConfirm, showAlert, dialogState, handleClose, handleConfirm } = useDialog();

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push("/login");
                return;
            }

            if (!isAdmin) {
                router.push("/dashboard");
                return;
            }

            fetchStats();
            if (activeTab === 'requests') {
                fetchDeletionRequests();
            }
        }
    }, [user, loading, isAdmin, router, activeTab]);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');

            // Fetch user count
            const usersResponse = await fetch(`${API_BASE_URL}/api/admin/users`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const usersData = await usersResponse.json();

            // Fetch post stats
            const postsResponse = await fetch(`${API_BASE_URL}/api/content/stats`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const postsData = await postsResponse.json();

            setStats({
                users: Array.isArray(usersData) ? usersData.length : 0,
                posts: postsData.total || 0,
                comments: 0, // Comments were removed
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
            setStats({
                users: 0,
                posts: 0,
                comments: 0,
            });
        }
    };

    const fetchDeletionRequests = async () => {
        setLoadingRequests(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/admin/deletion-requests`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setDeletionRequests(data);
            }
        } catch (error) {
            console.error('Error fetching deletion requests:', error);
        } finally {
            setLoadingRequests(false);
        }
    };

    const handleApprove = async (requestId) => {
        const confirmed = await showConfirm('Approve this deletion request? The post will be permanently deleted.', {
            title: 'Approve Deletion',
            variant: 'danger'
        });
        if (!confirmed) return;

        setProcessingId(requestId);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/admin/deletion-requests/${requestId}/approve`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                showAlert('Request approved and post deleted successfully!', {
                    title: 'Success'
                });
                fetchDeletionRequests();
                fetchStats();
            } else {
                showAlert('Failed to approve request', {
                    title: 'Error'
                });
            }
        } catch (error) {
            console.error('Error approving request:', error);
            showAlert('An error occurred', {
                title: 'Error'
            });
        } finally {
            setProcessingId(null);
        }
    };

    const handleDeny = async (requestId) => {
        const confirmed = await showConfirm('Deny this deletion request? The post will remain published.', {
            title: 'Deny Deletion Request'
        });
        if (!confirmed) return;

        setProcessingId(requestId);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/admin/deletion-requests/${requestId}/deny`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                showAlert('Request denied successfully!', {
                    title: 'Success'
                });
                fetchDeletionRequests();
            } else {
                showAlert('Failed to deny request', {
                    title: 'Error'
                });
            }
        } catch (error) {
            console.error('Error denying request:', error);
            showAlert('An error occurred', {
                title: 'Error'
            });
        } finally {
            setProcessingId(null);
        }
    };

    if (loading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!isAdmin) return null;

    return (
        <div className="min-h-screen bg-background">
            <Sidebar />
            <div className="ml-64 p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
                            <p className="text-muted-foreground">System overview and management</p>
                        </div>
                        <div className="bg-primary/10 text-primary px-4 py-2 rounded-full font-medium flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            Administrator
                        </div>
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex gap-2 mb-8 border-b border-border">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`px-6 py-3 font-medium transition-colors relative ${activeTab === 'overview'
                                ? 'text-primary border-b-2 border-primary'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            Overview
                        </button>
                        <button
                            onClick={() => setActiveTab('requests')}
                            className={`px-6 py-3 font-medium transition-colors relative ${activeTab === 'requests'
                                ? 'text-primary border-b-2 border-primary'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                Deletion Requests
                                {deletionRequests.length > 0 && (
                                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                                        {deletionRequests.length}
                                    </span>
                                )}
                            </div>
                        </button>
                    </div>

                    {/* Overview Tab */}
                    {activeTab === 'overview' && (
                        <>
                            {/* Info Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                                <div className="p-6 rounded-xl bg-card border border-border">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm text-muted-foreground">Total Users</span>
                                        <Users className="w-5 h-5 text-blue-500" />
                                    </div>
                                    <p className="text-3xl font-bold">{stats.users}</p>
                                </div>
                                <div className="p-6 rounded-xl bg-card border border-border">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm text-muted-foreground">Total Posts</span>
                                        <FileText className="w-5 h-5 text-green-500" />
                                    </div>
                                    <p className="text-3xl font-bold">{stats.posts}</p>
                                </div>
                                <div className="p-6 rounded-xl bg-card border border-border">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm text-muted-foreground">Comments</span>
                                        <Database className="w-5 h-5 text-purple-500" />
                                    </div>
                                    <p className="text-3xl font-bold">{stats.comments}</p>
                                </div>
                                <div className="p-6 rounded-xl bg-card border border-border">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm text-muted-foreground">System Health</span>
                                        <Activity className="w-5 h-5 text-red-500" />
                                    </div>
                                    <p className="text-3xl font-bold text-green-500">Good</p>
                                </div>
                            </div>

                            {/* Management Links */}
                            <h2 className="text-2xl font-bold mb-4">Management Modules</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                                <Link
                                    href="/dashboard/users"
                                    className="p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all group hover:shadow-lg"
                                >
                                    <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
                                        <Users className="w-6 h-6 text-blue-500" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">User Management</h3>
                                    <p className="text-muted-foreground">Manage users, roles, and permissions</p>
                                </Link>

                                <Link
                                    href="/dashboard/posts"
                                    className="p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all group hover:shadow-lg"
                                >
                                    <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-4 group-hover:bg-green-500/20 transition-colors">
                                        <FileText className="w-6 h-6 text-green-500" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">Content Management</h3>
                                    <p className="text-muted-foreground">Create, edit, and moderate blog posts</p>
                                </Link>

                                <Link
                                    href="/dashboard/reviewer"
                                    className="p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all group hover:shadow-lg"
                                >
                                    <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition-colors">
                                        <Settings className="w-6 h-6 text-purple-500" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">Review Queue</h3>
                                    <p className="text-muted-foreground">Approve or reject pending posts</p>
                                </Link>

                                <Link
                                    href="/dashboard/categories"
                                    className="p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all group hover:shadow-lg"
                                >
                                    <div className="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center mb-4 group-hover:bg-orange-500/20 transition-colors">
                                        <Database className="w-6 h-6 text-orange-500" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">Categories</h3>
                                    <p className="text-muted-foreground">Manage blog categories and tags</p>
                                </Link>
                            </div>

                            {/* Content Management Section */}
                            <div className="mt-8">
                                <ContentManagementSection userRole="ROLE_ADMIN" />
                            </div>
                        </>
                    )}

                    {/* Deletion Requests Tab */}
                    {activeTab === 'requests' && (
                        <div>
                            <h2 className="text-2xl font-bold mb-6">Post Deletion Requests</h2>

                            {loadingRequests ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                                </div>
                            ) : deletionRequests.length === 0 ? (
                                <div className="text-center py-12 bg-secondary/5 rounded-xl border border-border">
                                    <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                                    <p className="text-muted-foreground">No pending deletion requests</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {deletionRequests.map((request) => (
                                        <div key={request.id} className="p-6 rounded-xl bg-card border border-border">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <Trash2 className="w-5 h-5 text-red-500" />
                                                        <h3 className="text-lg font-bold">{request.post?.title || 'Untitled Post'}</h3>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                                                        <div>
                                                            <span className="text-muted-foreground">Requested by: </span>
                                                            <span className="font-medium">{request.requestedBy?.displayName || 'Unknown'}</span>
                                                        </div>
                                                        <div>
                                                            <span className="text-muted-foreground">Requested on: </span>
                                                            <span className="font-medium">
                                                                {new Date(request.requestedAt).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="bg-secondary/20 p-4 rounded-lg">
                                                        <p className="text-sm font-medium mb-1">Reason:</p>
                                                        <p className="text-sm text-muted-foreground">{request.reason}</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleApprove(request.id)}
                                                        disabled={processingId === request.id}
                                                        className="p-3 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                                        title="Approve & Delete Post"
                                                    >
                                                        {processingId === request.id ? (
                                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                                        ) : (
                                                            <>
                                                                <Check className="w-5 h-5" />
                                                                <span>Approve</span>
                                                            </>
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeny(request.id)}
                                                        disabled={processingId === request.id}
                                                        className="p-3 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                                        title="Deny Request"
                                                    >
                                                        {processingId === request.id ? (
                                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                                        ) : (
                                                            <>
                                                                <X className="w-5 h-5" />
                                                                <span>Deny</span>
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
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
        </div>
    );
}
