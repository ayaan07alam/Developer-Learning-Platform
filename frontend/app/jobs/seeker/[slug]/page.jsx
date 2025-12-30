"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MapPin, DollarSign, Briefcase, Calendar, Building, ArrowLeft, Send, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { API_BASE_URL } from '@/lib/api-client';

export default function JobDetailPage() {
    const params = useParams();
    const router = useRouter();
    // Extract ID from slug (format: slug-title-id)
    const jobId = params.slug ? params.slug.split('-').pop() : null;

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const [applied, setApplied] = useState(false);
    const [showApplicationForm, setShowApplicationForm] = useState(false);
    const [formData, setFormData] = useState({
        coverLetter: '',
        resumeUrl: '',
        email: '',
        phone: '',
    });
    const [error, setError] = useState('');

    useEffect(() => {
        if (jobId) {
            fetchJobDetails();
        }
    }, [jobId]);

    const fetchJobDetails = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/jobs/${jobId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setJob(data);
            } else {
                router.push('/jobs/seeker');
            }
        } catch (error) {
            console.error('Error fetching job:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApply = async (e) => {
        e.preventDefault();
        setApplying(true);
        setError('');

        try {
            const response = await fetch(`${API_BASE_URL}/api/jobs/${jobId}/apply`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setApplied(true);
                setShowApplicationForm(false);
            } else {
                const data = await response.json();
                setError(data.error || 'Failed to submit application');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setApplying(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!job) return null;

    return (
        <div className="min-h-screen pt-24 pb-12 bg-background">
            <div className="container mx-auto px-6 max-w-4xl">
                {/* Back Button */}
                <Link
                    href="/jobs/seeker"
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Jobs
                </Link>

                {/* Job Header */}
                <div className="mb-8 p-8 rounded-2xl bg-gradient-to-br from-secondary/20 to-secondary/5 border border-border">
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
                            <p className="text-xl text-muted-foreground mb-4">{job.companyName}</p>
                        </div>
                        {job.companyLogo && (
                            <img
                                src={job.companyLogo}
                                alt={job.companyName}
                                className="w-20 h-20 rounded-xl object-cover"
                            />
                        )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {job.location && (
                            <div className="flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-primary" />
                                <span className="text-sm">{job.location}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            <Briefcase className="w-5 h-5 text-primary" />
                            <span className="text-sm">{job.jobType.replace('_', ' ')}</span>
                        </div>
                        {(job.salaryMin || job.salaryMax) && (
                            <div className="flex items-center gap-2">
                                <DollarSign className="w-5 h-5 text-primary" />
                                <span className="text-sm">
                                    {job.salaryMin && job.salaryMax
                                        ? `$${job.salaryMin.toLocaleString()} - $${job.salaryMax.toLocaleString()}`
                                        : job.salaryMin
                                            ? `From $${job.salaryMin.toLocaleString()}`
                                            : `Up to $${job.salaryMax.toLocaleString()}`}
                                </span>
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-primary" />
                            <span className="text-sm">Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>

                {/* Application Status */}
                {applied && (
                    <div className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/50 flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-green-500 font-semibold">Application submitted successfully!</span>
                    </div>
                )}

                {/* Apply Button */}
                {!applied && !showApplicationForm && (
                    <button
                        onClick={() => setShowApplicationForm(true)}
                        className="w-full mb-8 py-4 px-6 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-semibold hover:shadow-lg hover:shadow-primary/50 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                        <Send className="w-5 h-5" />
                        Apply for this Position
                    </button>
                )}

                {/* Application Form */}
                {showApplicationForm && !applied && (
                    <div className="mb-8 p-6 rounded-xl bg-secondary/10 border border-border">
                        <h3 className="text-xl font-bold mb-4">Submit Your Application</h3>
                        {error && (
                            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm">
                                {error}
                            </div>
                        )}
                        <form onSubmit={handleApply} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Email *</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    placeholder="your.email@example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Phone</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    placeholder="+1 (555) 000-0000"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Resume URL</label>
                                <input
                                    type="url"
                                    value={formData.resumeUrl}
                                    onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    placeholder="https://drive.google.com/..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Cover Letter *</label>
                                <textarea
                                    required
                                    rows={6}
                                    value={formData.coverLetter}
                                    onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    placeholder="Tell us why you're a great fit for this role..."
                                />
                            </div>
                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    disabled={applying}
                                    className="flex-1 py-3 px-6 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
                                >
                                    {applying ? 'Submitting...' : 'Submit Application'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowApplicationForm(false)}
                                    className="px-6 py-3 rounded-lg border border-border hover:bg-secondary/10 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Job Description */}
                <div className="space-y-8">
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Job Description</h2>
                        <div className="prose prose-invert max-w-none">
                            <p className="whitespace-pre-wrap text-muted-foreground">{job.description}</p>
                        </div>
                    </div>

                    {job.requirements && (
                        <div>
                            <h2 className="text-2xl font-bold mb-4">Requirements</h2>
                            <div className="prose prose-invert max-w-none">
                                <p className="whitespace-pre-wrap text-muted-foreground">{job.requirements}</p>
                            </div>
                        </div>
                    )}

                    {job.companyDescription && (
                        <div>
                            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                <Building className="w-6 h-6" />
                                About {job.companyName}
                            </h2>
                            <div className="prose prose-invert max-w-none">
                                <p className="whitespace-pre-wrap text-muted-foreground">{job.companyDescription}</p>
                            </div>
                        </div>
                    )}

                    {(job.applicationUrl || job.applicationEmail) && (
                        <div className="p-6 rounded-xl bg-secondary/10 border border-border">
                            <h3 className="font-semibold mb-3">Alternative Application Methods</h3>
                            {job.applicationUrl && (
                                <p className="text-sm text-muted-foreground mb-2">
                                    Apply online: <a href={job.applicationUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{job.applicationUrl}</a>
                                </p>
                            )}
                            {job.applicationEmail && (
                                <p className="text-sm text-muted-foreground">
                                    Email: <a href={`mailto:${job.applicationEmail}`} className="text-primary hover:underline">{job.applicationEmail}</a>
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
