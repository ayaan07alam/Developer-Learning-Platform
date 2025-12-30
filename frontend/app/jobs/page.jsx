"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import ForcedLoginPopup from '@/components/ForcedLoginPopup';
import { API_BASE_URL } from '@/lib/api-client';


export default function JobsPage() {
    const router = useRouter();
    const { isAuthenticated, user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [showLoginPopup, setShowLoginPopup] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const checkAuthAndRole = async () => {
            console.log('Jobs page - isAuthenticated:', isAuthenticated);
            console.log('Jobs page - user:', user);

            // Small delay to ensure auth context is loaded
            await new Promise(resolve => setTimeout(resolve, 500));

            // Check if user is authenticated
            if (!isAuthenticated) {
                console.log('Not authenticated, showing login popup');
                setShowLoginPopup(true);
                setLoading(false);
                return;
            }

            // Check if user has selected a job role
            try {
                const token = localStorage.getItem('token');
                console.log('Token exists:', !!token);

                const response = await fetch(`${API_BASE_URL}/api/users/job-role`, {
                    headers: {
                        'Authorization': `Bearer ${token} `,
                    },
                });

                console.log('Job role response status:', response.status);

                if (response.ok) {
                    const data = await response.json();
                    console.log('Job role data:', data);

                    if (!data.hasSelected || !data.jobRole) {
                        // Redirect to role selection
                        console.log('No role selected, redirecting to select-role');
                        router.push('/jobs/select-role');
                    } else {
                        // Redirect to appropriate dashboard
                        console.log('Role found:', data.jobRole);
                        if (data.jobRole === 'JOB_SEEKER') {
                            router.push('/jobs/seeker');
                        } else if (data.jobRole === 'EMPLOYER') {
                            router.push('/jobs/employer');
                        }
                    }
                } else {
                    const errorText = await response.text();
                    console.error('Failed to fetch job role:', response.status, errorText);
                    setError('Failed to load job platform. Please try again.');
                }
            } catch (error) {
                console.error('Error checking job role:', error);
                setError('Network error. Please check if backend is running.');
            } finally {
                setLoading(false);
            }
        };

        checkAuthAndRole();
    }, [isAuthenticated, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading job platform...</p>
                </div>
            </div>
        );
    }

    if (showLoginPopup) {
        return <ForcedLoginPopup />;
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center max-w-md">
                    <div className="mb-4 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500">
                        {error}
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    // Fallback - should not reach here
    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center">
                <p className="text-muted-foreground">Redirecting...</p>
            </div>
        </div>
    );
}
