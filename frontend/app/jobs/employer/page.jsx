"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Briefcase, Eye, Edit, Trash2, XCircle, Users, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import CustomDialog from '@/components/CustomDialog';
import { useDialog } from '@/lib/useDialog';
import { API_BASE_URL } from '@/lib/api-client';

export default function EmployerDashboard() {
    const router = useRouter();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, active: 0, closed: 0 });
    const { showConfirm, showAlert, dialogState, handleClose, handleConfirm } = useDialog();

    useEffect(() => {
        fetchMyJobs();
    }, []);

    const fetchMyJobs = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/jobs/my-jobs`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setJobs(data);

                // Calculate stats
                const active = data.filter(j => j.status === 'ACTIVE').length;
                const closed = data.filter(j => j.status === 'CLOSED').length;
                setStats({ total: data.length, active, closed });
            }
        } catch (error) {
            console.error('Error fetching jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSwitchRole = async () => {
        const confirmed = await showConfirm('Switch to Job Seeker mode? You can switch back anytime.', {
            title: 'Switch Role'
        });
        if (!confirmed) return;

        try {
            const response = await fetch(`${API_BASE_URL}/api/users/change-job-role`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ jobRole: 'JOB_SEEKER' }),
            });

            if (response.ok) {
                router.push('/jobs/seeker');
            } else {
                showAlert('Failed to switch role', {
                    title: 'Error'
                });
            }
        } catch (error) {
            console.error('Error switching role:', error);
            showAlert('Error switching role', {
                title: 'Error'
            });
        }
    };

    const handleDelete = async (jobId) => {
        const confirmed = await showConfirm('Are you sure you want to delete this job?', {
            title: 'Delete Job',
            variant: 'danger'
        });
        if (!confirmed) return;

        try {
            const response = await fetch(`${API_BASE_URL}/api/jobs/${jobId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (response.ok) {
                fetchMyJobs();
            }
        } catch (error) {
            console.error('Error deleting job:', error);
        }
    };

    const handleCloseJob = async (jobId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/jobs/${jobId}/close`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (response.ok) {
                fetchMyJobs();
            }
        } catch (error) {
            console.error('Error closing job:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 bg-background">
            <div className="container mx-auto px-6 max-w-7xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">Employer Dashboard</h1>
                        <p className="text-muted-foreground">Manage your job postings</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleSwitchRole}
                            className="px-4 py-2 rounded-lg bg-secondary/10 border border-border hover:border-primary/50 hover:bg-secondary/20 transition-all text-sm font-medium flex items-center gap-2"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Switch to Job Seeker
                        </button>
                        <Link
                            href="/jobs/employer/new"
                            className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-semibold hover:shadow-lg hover:shadow-primary/50 transition-all duration-300 flex items-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            Post New Job
                        </Link>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-muted-foreground">Total Jobs</span>
                            <Briefcase className="w-5 h-5 text-primary" />
                        </div>
                        <p className="text-3xl font-bold">{stats.total}</p>
                    </div>
                    <div className="p-6 rounded-xl bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-muted-foreground">Active</span>
                            <Eye className="w-5 h-5 text-green-500" />
                        </div>
                        <p className="text-3xl font-bold text-green-500">{stats.active}</p>
                    </div>
                    <div className="p-6 rounded-xl bg-gradient-to-br from-orange-500/10 to-orange-500/5 border border-orange-500/20">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-muted-foreground">Closed</span>
                            <XCircle className="w-5 h-5 text-orange-500" />
                        </div>
                        <p className="text-3xl font-bold text-orange-500">{stats.closed}</p>
                    </div>
                </div>

                {/* Job Listings */}
                {jobs.length === 0 ? (
                    <div className="text-center py-16 border-2 border-dashed border-border rounded-xl">
                        <Briefcase className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                        <h3 className="text-xl font-semibold mb-2">No jobs posted yet</h3>
                        <p className="text-muted-foreground mb-6">Start by posting your first job listing</p>
                        <Link
                            href="/jobs/employer/new"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                            Post Your First Job
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {jobs.map((job) => (
                            <div
                                key={job.id}
                                className="p-6 rounded-xl bg-secondary/5 border border-border hover:border-primary/30 transition-all"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-xl font-bold">{job.title}</h3>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${job.status === 'ACTIVE'
                                                ? 'bg-green-500/10 text-green-500'
                                                : job.status === 'CLOSED'
                                                    ? 'bg-orange-500/10 text-orange-500'
                                                    : 'bg-gray-500/10 text-gray-500'
                                                }`}>
                                                {job.status}
                                            </span>
                                        </div>
                                        <p className="text-muted-foreground mb-2">{job.companyName}</p>
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <Users className="w-4 h-4" />
                                                {job.applicantsCount || 0} applicants
                                            </span>
                                            <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Link
                                        href={`/jobs/employer/${job.id}/applications`}
                                        className="px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm font-medium flex items-center gap-2"
                                    >
                                        <Users className="w-4 h-4" />
                                        View Applications
                                    </Link>
                                    <Link
                                        href={`/jobs/employer/edit/${job.id}`}
                                        className="px-4 py-2 rounded-lg bg-secondary/10 hover:bg-secondary/20 transition-colors text-sm font-medium flex items-center gap-2"
                                    >
                                        <Edit className="w-4 h-4" />
                                        Edit
                                    </Link>
                                    {job.status === 'ACTIVE' && (
                                        <button
                                            onClick={() => handleCloseJob(job.id)}
                                            className="px-4 py-2 rounded-lg bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 transition-colors text-sm font-medium flex items-center gap-2"
                                        >
                                            <XCircle className="w-4 h-4" />
                                            Close
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(job.id)}
                                        className="px-4 py-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors text-sm font-medium flex items-center gap-2"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
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
