"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Briefcase, Search, ArrowRight } from 'lucide-react';

export default function SelectRolePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const selectRole = async (role) => {
        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:8080/api/users/select-job-role', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ jobRole: role }),
            });

            if (response.ok) {
                // Redirect to appropriate dashboard
                if (role === 'JOB_SEEKER') {
                    router.push('/jobs/seeker');
                } else {
                    router.push('/jobs/employer');
                }
            } else {
                const data = await response.json();
                setError(data.error || 'Failed to select role');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 bg-gradient-to-br from-background via-background to-primary/5">
            <div className="container mx-auto px-6 max-w-5xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary">
                        Welcome to IntelforGeeks Jobs
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        Choose your role to get started
                    </p>
                </div>

                {error && (
                    <div className="mb-8 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-center">
                        {error}
                    </div>
                )}

                {/* Role Selection Cards */}
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Job Seeker Card */}
                    <div
                        onClick={() => !loading && selectRole('JOB_SEEKER')}
                        className="group relative p-8 rounded-2xl bg-secondary/10 border-2 border-border hover:border-primary/50 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-2xl hover:shadow-primary/20"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="relative">
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                                <Search className="w-8 h-8 text-primary" />
                            </div>

                            <h2 className="text-2xl font-bold mb-3">Job Seeker</h2>
                            <p className="text-muted-foreground mb-6">
                                Browse and apply for amazing tech opportunities. Find your dream job from top companies.
                            </p>

                            <ul className="space-y-2 mb-6">
                                <li className="flex items-center text-sm">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2" />
                                    Browse active job listings
                                </li>
                                <li className="flex items-center text-sm">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2" />
                                    Apply with your profile
                                </li>
                                <li className="flex items-center text-sm">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2" />
                                    Track your applications
                                </li>
                            </ul>

                            <div className="flex items-center text-primary font-semibold group-hover:translate-x-2 transition-transform">
                                Continue as Job Seeker
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </div>
                        </div>
                    </div>

                    {/* Employer Card */}
                    <div
                        onClick={() => !loading && selectRole('EMPLOYER')}
                        className="group relative p-8 rounded-2xl bg-secondary/10 border-2 border-border hover:border-accent/50 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-2xl hover:shadow-accent/20"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="relative">
                            <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                                <Briefcase className="w-8 h-8 text-accent" />
                            </div>

                            <h2 className="text-2xl font-bold mb-3">Employer</h2>
                            <p className="text-muted-foreground mb-6">
                                Post job openings and find talented developers. Build your dream team.
                            </p>

                            <ul className="space-y-2 mb-6">
                                <li className="flex items-center text-sm">
                                    <div className="w-1.5 h-1.5 rounded-full bg-accent mr-2" />
                                    Post unlimited job listings
                                </li>
                                <li className="flex items-center text-sm">
                                    <div className="w-1.5 h-1.5 rounded-full bg-accent mr-2" />
                                    Manage applications
                                </li>
                                <li className="flex items-center text-sm">
                                    <div className="w-1.5 h-1.5 rounded-full bg-accent mr-2" />
                                    Find top talent
                                </li>
                            </ul>

                            <div className="flex items-center text-accent font-semibold group-hover:translate-x-2 transition-transform">
                                Continue as Employer
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </div>
                        </div>
                    </div>
                </div>

                {loading && (
                    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                            <p className="text-muted-foreground">Setting up your account...</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
