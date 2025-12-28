"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Briefcase, DollarSign, Clock, Filter, X, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import CustomDialog from '@/components/CustomDialog';
import { useDialog } from '@/lib/useDialog';

export default function JobSeekerDashboard() {
    const router = useRouter();
    const [jobs, setJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const { showConfirm, showAlert, dialogState, handleClose, handleConfirm } = useDialog();

    useEffect(() => {
        fetchCategories();
        fetchJobs();
    }, []);

    useEffect(() => {
        filterJobs();
    }, [searchQuery, selectedCategory, jobs]);

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

    const fetchJobs = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/jobs', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setJobs(data);
                setFilteredJobs(data);
            }
        } catch (error) {
            console.error('Error fetching jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterJobs = () => {
        let filtered = [...jobs];

        if (searchQuery) {
            filtered = filtered.filter(job =>
                job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.companyName.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (selectedCategory) {
            filtered = filtered.filter(job => job.category === selectedCategory);
        }

        setFilteredJobs(filtered);
    };

    const handleSwitchRole = async () => {
        const confirmed = await showConfirm('Switch to Employer mode? You can switch back anytime.', {
            title: 'Switch Role'
        });
        if (!confirmed) return;

        try {
            const response = await fetch('http://localhost:8080/api/users/change-job-role', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ jobRole: 'EMPLOYER' }),
            });

            if (response.ok) {
                router.push('/jobs/employer');
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

    const formatSalary = (min, max) => {
        if (!min && !max) return 'Not specified';
        if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
        if (min) return `From $${min.toLocaleString()}`;
        return `Up to $${max.toLocaleString()}`;
    };

    const getJobTypeColor = (type) => {
        const colors = {
            FULL_TIME: 'bg-green-500/10 text-green-500 border-green-500/20',
            PART_TIME: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
            CONTRACT: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
            REMOTE: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
            INTERNSHIP: 'bg-pink-500/10 text-pink-500 border-pink-500/20',
        };
        return colors[type] || 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading jobs...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 bg-background">
            <div className="container mx-auto px-6 max-w-7xl">
                {/* Header */}
                <div className="mb-8 flex items-start justify-between">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">Find Your Dream Job</h1>
                        <p className="text-muted-foreground">Browse {jobs.length} active tech opportunities</p>
                    </div>
                    <button
                        onClick={handleSwitchRole}
                        className="px-4 py-2 rounded-lg bg-secondary/10 border border-border hover:border-primary/50 hover:bg-secondary/20 transition-all text-sm font-medium flex items-center gap-2"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Switch to Employer
                    </button>
                </div>

                {/* Search and Filters */}
                <div className="mb-8 space-y-4">
                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search by job title or company..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 rounded-xl bg-secondary/10 border border-border focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                    </div>

                    {/* Category Filter */}
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setSelectedCategory('')}
                            className={`px-4 py-2 rounded-lg border transition-all ${!selectedCategory
                                ? 'bg-primary text-white border-primary'
                                : 'bg-secondary/10 border-border hover:border-primary/50'
                                }`}
                        >
                            All Categories
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat.value}
                                onClick={() => setSelectedCategory(cat.value)}
                                className={`px-4 py-2 rounded-lg border transition-all ${selectedCategory === cat.value
                                    ? 'bg-primary text-white border-primary'
                                    : 'bg-secondary/10 border-border hover:border-primary/50'
                                    }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Results Count */}
                <div className="mb-6 flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        Showing {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'}
                    </p>
                    {(searchQuery || selectedCategory) && (
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                setSelectedCategory('');
                            }}
                            className="text-sm text-primary hover:underline flex items-center gap-1"
                        >
                            <X className="w-4 h-4" />
                            Clear filters
                        </button>
                    )}
                </div>

                {/* Job Listings */}
                {filteredJobs.length === 0 ? (
                    <div className="text-center py-16">
                        <Briefcase className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                        <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
                        <p className="text-muted-foreground">Try adjusting your search or filters</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {filteredJobs.map((job) => {
                            const titleSlug = job.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                            const jobSlug = `${titleSlug}-${job.id}`;

                            return (
                                <Link
                                    key={job.id}
                                    href={`/jobs/seeker/${jobSlug}`}
                                    className="group p-6 rounded-xl bg-secondary/5 border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                                                {job.title}
                                            </h3>
                                            <p className="text-lg text-muted-foreground mb-3">{job.companyName}</p>
                                        </div>
                                        {job.companyLogo && (
                                            <img
                                                src={job.companyLogo}
                                                alt={job.companyName}
                                                className="w-16 h-16 rounded-lg object-cover"
                                            />
                                        )}
                                    </div>

                                    <div className="flex flex-wrap gap-3 mb-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getJobTypeColor(job.jobType)}`}>
                                            {job.jobType.replace('_', ' ')}
                                        </span>
                                        {job.location && (
                                            <span className="flex items-center gap-1 text-sm text-muted-foreground">
                                                <MapPin className="w-4 h-4" />
                                                {job.location}
                                            </span>
                                        )}
                                        {(job.salaryMin || job.salaryMax) && (
                                            <span className="flex items-center gap-1 text-sm text-muted-foreground">
                                                <DollarSign className="w-4 h-4" />
                                                {formatSalary(job.salaryMin, job.salaryMax)}
                                            </span>
                                        )}
                                    </div>

                                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                                        {job.description}
                                    </p>

                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            Posted {new Date(job.createdAt).toLocaleDateString()}
                                        </span>
                                        <span className="text-sm font-semibold text-primary group-hover:translate-x-1 transition-transform">
                                            View Details →
                                        </span>
                                    </div>
                                </Link>
                            );
                        })}
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
