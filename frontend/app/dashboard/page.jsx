"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Sidebar from "@/components/Sidebar";
import { PenTool, FileText, TrendingUp, FileEdit, FolderOpen } from "lucide-react";
import ImprovementDraftsSection from "@/components/ImprovementDraftsSection";
import ContentManagementSection from "@/components/ContentManagementSection";

export default function DashboardPage() {
    const router = useRouter();
    const { user, loading } = useAuth();
    const [stats, setStats] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push("/login");
            } else if (user.role === "EDITOR") {
                router.push("/dashboard/editor");
            } else if (user.role === "REVIEWER") {
                router.push("/dashboard/reviewer");
            } else if (user.role === "ADMIN") {
                router.push("/dashboard/admin");
            }
        }
    }, [user, loading, router]);

    useEffect(() => {
        if (user) {
            fetchStats();
        }
    }, [user]);

    const fetchStats = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/content/stats', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setStats(data);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    if (loading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    const tabs = [
        { id: 'overview', label: 'Overview', icon: TrendingUp },
        { id: 'drafts', label: 'Improvement Drafts', icon: FileEdit },
        { id: 'content', label: 'My Content', icon: FolderOpen }
    ];

    return (
        <div className="min-h-screen bg-background">
            <Sidebar />
            <div className="ml-64 p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold mb-2">Author Dashboard</h1>
                        <p className="text-muted-foreground">
                            Welcome back, {user?.username}!
                        </p>
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex gap-2 mb-8 border-b border-border">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-3 font-medium transition-colors flex items-center gap-2 border-b-2 ${activeTab === tab.id
                                        ? 'border-primary text-primary'
                                        : 'border-transparent text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    {activeTab === 'overview' && (
                        <div className="space-y-8">
                            {/* Stats Cards */}
                            {stats && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="p-6 rounded-xl bg-primary/10 border border-primary/20">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 rounded-lg bg-primary/20">
                                                <PenTool className="w-6 h-6 text-primary" />
                                            </div>
                                            <div>
                                                <div className="text-3xl font-bold">{stats.total}</div>
                                                <div className="text-sm text-muted-foreground">Total Posts</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6 rounded-xl bg-green-500/10 border border-green-500/20">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 rounded-lg bg-green-500/20">
                                                <FileText className="w-6 h-6 text-green-500" />
                                            </div>
                                            <div>
                                                <div className="text-3xl font-bold text-green-500">{stats.published}</div>
                                                <div className="text-sm text-muted-foreground">Published</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 rounded-lg bg-yellow-500/20">
                                                <TrendingUp className="w-6 h-6 text-yellow-500" />
                                            </div>
                                            <div>
                                                <div className="text-3xl font-bold text-yellow-500">{stats.pending}</div>
                                                <div className="text-sm text-muted-foreground">Pending Review</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Quick Actions */}
                            <div className="p-6 rounded-xl bg-secondary/5 border border-border">
                                <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => router.push('/dashboard/posts/create')}
                                        className="px-6 py-3 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors font-medium"
                                    >
                                        Create New Post
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('drafts')}
                                        className="px-6 py-3 rounded-lg border border-border hover:bg-secondary/10 transition-colors font-medium"
                                    >
                                        View Improvement Drafts
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'drafts' && (
                        <ImprovementDraftsSection />
                    )}

                    {activeTab === 'content' && (
                        <ContentManagementSection userRole={user?.role} />
                    )}
                </div>
            </div>
        </div>
    );
}
