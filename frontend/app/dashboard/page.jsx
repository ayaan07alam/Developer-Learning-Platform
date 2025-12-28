"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/sidebar";
import { PenTool, FileText, TrendingUp, FileEdit, FolderOpen } from "lucide-react";
import ImprovementDraftsSection from "@/components/ImprovementDraftsSection";
import ContentManagementSection from "@/components/ContentManagementSection";

export default function DashboardPage() {
    const router = useRouter();
    const { user, loading } = useAuth();
    const [stats, setStats] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');

    // Random quote selection - changes on every page load
    const writingQuotes = [
        "Start writing, no matter what. The water does not flow until the faucet is turned on. — Louis L'Amour",
        "You can always edit a bad page. You can't edit a blank page. — Jodi Picoult",
        "The scariest moment is always just before you start. — Stephen King",
        "Write what should not be forgotten. — Isabel Allende",
        "There is no greater agony than bearing an untold story inside you. — Maya Angelou",
        "If you want to be a writer, you must do two things above all others: read a lot and write a lot. — Stephen King",
        "Your story matters. Write it down. Share it with the world.",
        "The first draft is just you telling yourself the story. — Terry Pratchett",
        "Words are, of course, the most powerful drug used by mankind. — Rudyard Kipling",
        "Fill your paper with the breathings of your heart. — William Wordsworth"
    ];
    const [randomQuote] = useState(() => writingQuotes[Math.floor(Math.random() * writingQuotes.length)]);

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
            // Regular users should see only their stats, not system-wide
            const response = await fetch('http://localhost:8080/api/content/my-stats', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')} `
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
            <div className="ml-64 p-8 pt-24">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold mb-2">Author Dashboard</h1>
                        <p className="text-muted-foreground mb-4">
                            Welcome back, {user?.displayName}!
                        </p>
                        {/* Inspirational Writing Quote */}
                        <div className="mt-4 p-4 rounded-lg bg-gradient-to-r from-primary/10 via-blue-500/10 to-purple-500/10 border border-primary/20 backdrop-blur-sm">
                            <p className="text-lg font-serif italic text-foreground/90 leading-relaxed">
                                "{randomQuote}"
                            </p>
                        </div>
                    </div>

                    {/* Tab Navigation - Modern Pill Design */}
                    <div className="flex gap-3 mb-8 p-2 bg-secondary/20 rounded-full border border-border/50 w-fit">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`
                                        px-6 py-3 font-semibold rounded-full transition-all duration-300 flex items-center gap-2
                                        ${isActive
                                            ? 'bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg shadow-primary/30 scale-105'
                                            : 'text-muted-foreground hover:text-foreground hover:bg-secondary/40 hover:scale-105'
                                        }
                                    `}
                                >
                                    <Icon className={`w-5 h-5 ${isActive ? 'animate-pulse' : ''}`} />
                                    <span className="font-bold">{tab.label}</span>
                                </button>
                            );
                        })}
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
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Button
                                        className="h-auto py-6 text-lg font-bold bg-cyan-500 hover:bg-cyan-600 text-white shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.02]"
                                        onClick={() => router.push('/dashboard/posts/new')}
                                    >
                                        <PenTool className="w-5 h-5 mr-2" />
                                        Create New Post
                                    </Button>
                                    <Button
                                        onClick={() => setActiveTab('drafts')}
                                        variant="outline"
                                        className="h-auto py-6 text-lg font-bold border-border hover:bg-secondary/40 transition-all hover:scale-[1.02]"
                                    >
                                        <FileEdit className="w-5 h-5 mr-2" />
                                        View Improvement Drafts
                                    </Button>
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
