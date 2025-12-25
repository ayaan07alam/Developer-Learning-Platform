"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Mail, Phone, FileText, Calendar, User } from 'lucide-react';
import Link from 'next/link';

export default function ApplicationsPage() {
    const params = useParams();
    const router = useRouter();
    const [job, setJob] = useState(null);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchJobAndApplications();
    }, [params.id]);

    const fetchJobAndApplications = async () => {
        try {
            // Fetch job details
            const jobResponse = await fetch(`http://localhost:8080/api/jobs/${params.id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (jobResponse.ok) {
                const jobData = await jobResponse.json();
                setJob(jobData);
            }

            // Fetch applications
            const appsResponse = await fetch(`http://localhost:8080/api/jobs/${params.id}/applications`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (appsResponse.ok) {
                const appsData = await appsResponse.json();
                setApplications(appsData);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
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
            <div className="container mx-auto px-6 max-w-6xl">
                <Link
                    href="/jobs/employer"
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                </Link>

                {/* Job Header */}
                {job && (
                    <div className="mb-8 p-6 rounded-xl bg-secondary/5 border border-border">
                        <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
                        <p className="text-muted-foreground mb-4">{job.companyName}</p>
                        <div className="flex items-center gap-4 text-sm">
                            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
                                {applications.length} {applications.length === 1 ? 'Application' : 'Applications'}
                            </span>
                            <span className="text-muted-foreground">
                                Posted {new Date(job.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                )}

                {/* Applications List */}
                {applications.length === 0 ? (
                    <div className="text-center py-16 border-2 border-dashed border-border rounded-xl">
                        <User className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                        <h3 className="text-xl font-semibold mb-2">No applications yet</h3>
                        <p className="text-muted-foreground">Applications will appear here when candidates apply</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {applications.map((app) => (
                            <div
                                key={app.id}
                                className="p-6 rounded-xl bg-secondary/5 border border-border hover:border-primary/30 transition-all"
                            >
                                {/* Applicant Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold mb-1">{app.applicant.username}</h3>
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <Mail className="w-4 h-4" />
                                                {app.email}
                                            </span>
                                            {app.phone && (
                                                <span className="flex items-center gap-1">
                                                    <Phone className="w-4 h-4" />
                                                    {app.phone}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${app.status === 'PENDING'
                                                ? 'bg-yellow-500/10 text-yellow-500'
                                                : app.status === 'REVIEWED'
                                                    ? 'bg-blue-500/10 text-blue-500'
                                                    : app.status === 'SHORTLISTED'
                                                        ? 'bg-green-500/10 text-green-500'
                                                        : 'bg-red-500/10 text-red-500'
                                            }`}>
                                            {app.status}
                                        </span>
                                        <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1 justify-end">
                                            <Calendar className="w-3 h-3" />
                                            Applied {new Date(app.appliedAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                {/* Cover Letter */}
                                <div className="mb-4">
                                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                                        <FileText className="w-4 h-4" />
                                        Cover Letter
                                    </h4>
                                    <div className="p-4 rounded-lg bg-background border border-border">
                                        <p className="text-sm whitespace-pre-wrap text-muted-foreground">
                                            {app.coverLetter}
                                        </p>
                                    </div>
                                </div>

                                {/* Resume Link */}
                                {app.resumeUrl && (
                                    <div className="mb-4">
                                        <a
                                            href={app.resumeUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                                        >
                                            <FileText className="w-4 h-4" />
                                            View Resume
                                        </a>
                                    </div>
                                )}

                                {/* Contact Actions */}
                                <div className="flex gap-2 pt-4 border-t border-border">
                                    <a
                                        href={`mailto:${app.email}`}
                                        className="px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm font-medium flex items-center gap-2"
                                    >
                                        <Mail className="w-4 h-4" />
                                        Email Applicant
                                    </a>
                                    {app.phone && (
                                        <a
                                            href={`tel:${app.phone}`}
                                            className="px-4 py-2 rounded-lg bg-secondary/10 hover:bg-secondary/20 transition-colors text-sm font-medium flex items-center gap-2"
                                        >
                                            <Phone className="w-4 h-4" />
                                            Call
                                        </a>
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
