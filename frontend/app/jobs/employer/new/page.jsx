"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Briefcase } from 'lucide-react';
import Link from 'next/link';

export default function NewJobPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [jobTypes, setJobTypes] = useState([]);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        requirements: '',
        category: '',
        jobType: '',
        location: '',
        salaryMin: '',
        salaryMax: '',
        companyName: '',
        companyDescription: '',
        companyLogo: '',
        applicationUrl: '',
        applicationEmail: '',
        deadline: '',
        publishImmediately: true,
    });

    useEffect(() => {
        fetchCategories();
        fetchJobTypes();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/jobs/categories');
            if (response.ok) {
                const data = await response.json();
                setCategories(data);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchJobTypes = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/jobs/types');
            if (response.ok) {
                const data = await response.json();
                setJobTypes(data);
            }
        } catch (error) {
            console.error('Error fetching job types:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:8080/api/jobs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    ...formData,
                    salaryMin: formData.salaryMin ? parseFloat(formData.salaryMin) : null,
                    salaryMax: formData.salaryMax ? parseFloat(formData.salaryMax) : null,
                }),
            });

            if (response.ok) {
                router.push('/jobs/employer');
            } else {
                const data = await response.json();
                setError(data.error || 'Failed to create job');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 bg-background">
            <div className="container mx-auto px-6 max-w-4xl">
                <Link
                    href="/jobs/employer"
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                </Link>

                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                        <Briefcase className="w-10 h-10" />
                        Post a New Job
                    </h1>
                    <p className="text-muted-foreground">Fill in the details to create your job listing</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Information */}
                    <div className="p-6 rounded-xl bg-secondary/5 border border-border space-y-4">
                        <h2 className="text-xl font-bold mb-4">Basic Information</h2>

                        <div>
                            <label className="block text-sm font-medium mb-2">Job Title *</label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                placeholder="e.g., Senior Full Stack Developer"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Category *</label>
                                <select
                                    required
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                >
                                    <option value="">Select category</option>
                                    {categories.map((cat) => (
                                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Job Type *</label>
                                <select
                                    required
                                    value={formData.jobType}
                                    onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                >
                                    <option value="">Select type</option>
                                    {jobTypes.map((type) => (
                                        <option key={type.value} value={type.value}>{type.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Location</label>
                            <input
                                type="text"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                placeholder="e.g., San Francisco, CA or Remote"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Minimum Salary ($)</label>
                                <input
                                    type="number"
                                    value={formData.salaryMin}
                                    onChange={(e) => setFormData({ ...formData, salaryMin: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    placeholder="80000"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Maximum Salary ($)</label>
                                <input
                                    type="number"
                                    value={formData.salaryMax}
                                    onChange={(e) => setFormData({ ...formData, salaryMax: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    placeholder="120000"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Job Details */}
                    <div className="p-6 rounded-xl bg-secondary/5 border border-border space-y-4">
                        <h2 className="text-xl font-bold mb-4">Job Details</h2>

                        <div>
                            <label className="block text-sm font-medium mb-2">Description *</label>
                            <textarea
                                required
                                rows={8}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                placeholder="Describe the role, responsibilities, and what makes this opportunity exciting..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Requirements</label>
                            <textarea
                                rows={6}
                                value={formData.requirements}
                                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                placeholder="List the required skills, experience, and qualifications..."
                            />
                        </div>
                    </div>

                    {/* Company Information */}
                    <div className="p-6 rounded-xl bg-secondary/5 border border-border space-y-4">
                        <h2 className="text-xl font-bold mb-4">Company Information</h2>

                        <div>
                            <label className="block text-sm font-medium mb-2">Company Name *</label>
                            <input
                                type="text"
                                required
                                value={formData.companyName}
                                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                placeholder="Your Company Name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Company Description</label>
                            <textarea
                                rows={4}
                                value={formData.companyDescription}
                                onChange={(e) => setFormData({ ...formData, companyDescription: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                placeholder="Tell candidates about your company..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Company Logo URL</label>
                            <input
                                type="url"
                                value={formData.companyLogo}
                                onChange={(e) => setFormData({ ...formData, companyLogo: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                placeholder="https://example.com/logo.png"
                            />
                        </div>
                    </div>

                    {/* Application Details */}
                    <div className="p-6 rounded-xl bg-secondary/5 border border-border space-y-4">
                        <h2 className="text-xl font-bold mb-4">Application Details</h2>

                        <div>
                            <label className="block text-sm font-medium mb-2">Application URL</label>
                            <input
                                type="url"
                                value={formData.applicationUrl}
                                onChange={(e) => setFormData({ ...formData, applicationUrl: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                placeholder="https://careers.example.com/apply"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Application Email</label>
                            <input
                                type="email"
                                value={formData.applicationEmail}
                                onChange={(e) => setFormData({ ...formData, applicationEmail: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                placeholder="careers@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Application Deadline</label>
                            <input
                                type="date"
                                value={formData.deadline}
                                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="publish"
                                checked={formData.publishImmediately}
                                onChange={(e) => setFormData({ ...formData, publishImmediately: e.target.checked })}
                                className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                            />
                            <label htmlFor="publish" className="text-sm">
                                Publish immediately (uncheck to save as draft)
                            </label>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-4 px-6 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-semibold hover:shadow-lg hover:shadow-primary/50 transition-all duration-300 disabled:opacity-50"
                        >
                            {loading ? 'Creating...' : 'Create Job Posting'}
                        </button>
                        <Link
                            href="/jobs/employer"
                            className="px-6 py-4 rounded-xl border-2 border-border hover:bg-secondary/10 transition-colors font-semibold"
                        >
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
