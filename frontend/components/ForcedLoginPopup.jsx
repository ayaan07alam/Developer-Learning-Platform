"use client";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Briefcase } from 'lucide-react';

export default function ForcedLoginPopup() {
    const router = useRouter();

    const handleLogin = () => {
        // Save return URL
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('returnUrl', '/jobs');
        }
        router.push('/login');
    };

    const handleRegister = () => {
        // Save return URL
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('returnUrl', '/jobs');
        }
        router.push('/register');
    };

    return (
        <div className="fixed inset-0 bg-background/95 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Glassmorphism Card */}
                <div className="relative p-8 rounded-2xl bg-gradient-to-br from-secondary/40 to-secondary/20 border border-white/10 backdrop-blur-xl shadow-2xl">
                    {/* Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl blur-xl opacity-50" />

                    <div className="relative">
                        {/* Icon */}
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-6">
                            <Lock className="w-8 h-8 text-white" />
                        </div>

                        {/* Title */}
                        <h2 className="text-3xl font-bold text-center mb-3 bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary">
                            Authentication Required
                        </h2>

                        {/* Description */}
                        <p className="text-center text-muted-foreground mb-8">
                            Please sign in or create an account to access the Jobs platform and explore amazing opportunities.
                        </p>

                        {/* Features */}
                        <div className="space-y-3 mb-8">
                            <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5">
                                <Briefcase className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="font-semibold text-sm">Browse Tech Jobs</p>
                                    <p className="text-xs text-muted-foreground">Find opportunities from top companies</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5">
                                <Briefcase className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="font-semibold text-sm">Post Job Listings</p>
                                    <p className="text-xs text-muted-foreground">Hire talented developers for your team</p>
                                </div>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="space-y-3">
                            <button
                                onClick={handleLogin}
                                className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-primary to-accent text-white font-semibold hover:shadow-lg hover:shadow-primary/50 transition-all duration-300 hover:scale-105"
                            >
                                Sign In
                            </button>

                            <button
                                onClick={handleRegister}
                                className="w-full py-3 px-6 rounded-lg border-2 border-primary/50 text-primary font-semibold hover:bg-primary/10 transition-all duration-300"
                            >
                                Create Account
                            </button>
                        </div>

                        {/* Note */}
                        <p className="text-center text-xs text-muted-foreground mt-6">
                            You must be logged in to access the Jobs platform
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
