"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { Briefcase, MapPin, Clock, Calendar, ArrowLeft, ExternalLink } from 'lucide-react';
import { API_BASE_URL } from '@/lib/api-client';

const STATUS_STYLES = {
    PENDING: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    REVIEWED: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    SHORTLISTED: 'bg-green-500/10 text-green-500 border-green-500/20',
    REJECTED: 'bg-red-500/10 text-red-500 border-red-500/20',
};

export default function MyApplicationsPage() {
    const router = useRouter();
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [authLoading, isAuthenticated, router]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchApplications();
        }
    }, [isAuthenticated]);

    const fetchApplications = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/jobs/my-applications`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setApplications(data);
            } else {
                setError('Failed to load your applications.');
            }
        } catch (err) {
            console.error('Error fetching applications:', err);
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading your applications...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 bg-background">
            <div className="container mx-auto px-6 max-w-4xl">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/jobs"
                        className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Jobs
                    </Link>
                    <h1 className="text-4xl font-bold mb-2">My Applications</h1>
                    <p className="text-muted-foreground">
                        Track the status of your job applications
                    </p>
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500">
                        {error}
                    </div>
                )}

                {/* Applications List */}
                {applications.length === 0 ? (
                    <div className="text-center py-20 border-2 border-dashed border-border rounded-xl">
                        <Briefcase className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-40" />
                        <h3 className="text-xl font-semibold mb-2">No applications yet</h3>
                        <p className="text-muted-foreground mb-6">
                            You haven&apos;t applied to any jobs yet.
                        </p>
                        <Link
                            href="/jobs"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 transition-colors"
                        >
                            Browse Jobs
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <p className="text-sm text-muted-foreground mb-4">
                            {applications.length} {applications.length === 1 ? 'application' : 'applications'}
                        </p>
                        {applications.map((app) => (
                            <div
                                key={app.id}
                                className="p-6 rounded-xl bg-secondary/5 border border-border hover:border-primary/30 transition-all duration-300"
                            >
                                <div className="flex items-start justify-between gap-4 mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold mb-1">{app.job?.title}</h3>
                                        <p className="text-muted-foreground mb-2">{app.job?.companyName}</p>
                                        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                                            {app.job?.location && (
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="w-3.5 h-3.5" />
                                                    {app.job.location}
                                                </span>
                                            )}
                                            {app.job?.jobType && (
                                                <span className="flex items-center gap-1">
                                                    <Briefcase className="w-3.5 h-3.5" />
                                                    {app.job.jobType.replace('_', ' ')}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Status Badge */}
                                    <span
                                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border whitespace-nowrap ${STATUS_STYLES[app.status] || STATUS_STYLES.PENDING}`}
                                    >
                                        {app.status}
                                    </span>
                                </div>

                                {/* Application Meta */}
                                <div className="flex items-center justify-between pt-4 border-t border-border">
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3.5 h-3.5" />
                                            Applied {new Date(app.appliedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </span>
                                        {app.job?.deadline && (
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3.5 h-3.5" />
                                                Deadline: {new Date(app.job.deadline).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                            </span>
                                        )}
                                    </div>

                                    {app.job?.id && (
                                        <Link
                                            href={`/jobs/seeker/${app.job.id}`}
                                            className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-medium"
                                        >
                                            View Job
                                            <ExternalLink className="w-3 h-3" />
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
