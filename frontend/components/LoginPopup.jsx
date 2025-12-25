"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import Link from 'next/link';
import { useGoogleLogin } from '@react-oauth/google';

export default function LoginPopup() {
    const { isAuthenticated, handleGoogleLogin } = useAuth();
    const pathname = usePathname();
    const router = useRouter();
    const [showPopup, setShowPopup] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Don't show if user is already authenticated
        if (isAuthenticated) return;

        // Don't show on login/register pages
        if (pathname === '/login' || pathname === '/register') return;

        const POPUP_DELAY = 10000; // 10 seconds
        const SESSION_DURATION = 30 * 60 * 1000; // 30 minutes
        const STORAGE_KEY = 'loginPopupLastShown';
        const SESSION_KEY = 'loginPopupSession';

        // Check if popup was shown recently
        const lastShown = localStorage.getItem(STORAGE_KEY);
        const sessionActive = sessionStorage.getItem(SESSION_KEY);
        const now = Date.now();

        // If session is active (user is navigating within site), don't show
        if (sessionActive) {
            return;
        }

        // If popup was shown within last 30 minutes, don't show
        if (lastShown) {
            const timeSinceLastShown = now - parseInt(lastShown);
            if (timeSinceLastShown < SESSION_DURATION) {
                // Set session to prevent showing during navigation
                sessionStorage.setItem(SESSION_KEY, 'true');
                return;
            }
        }

        // Show popup after delay
        const timer = setTimeout(() => {
            setShowPopup(true);
            localStorage.setItem(STORAGE_KEY, now.toString());
            sessionStorage.setItem(SESSION_KEY, 'true');
        }, POPUP_DELAY);

        return () => clearTimeout(timer);
    }, [isAuthenticated, pathname]);

    const handleClose = () => {
        setShowPopup(false);
    };

    const handleSignInClick = (href) => {
        // Save current URL for redirect after login
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('returnUrl', window.location.pathname);
        }
        handleClose();
    };

    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setIsLoading(true);
            try {
                await handleGoogleLogin(tokenResponse.access_token);
                handleClose();

                // Redirect back to the page they were on
                const returnUrl = sessionStorage.getItem('returnUrl');
                if (returnUrl && returnUrl !== '/login' && returnUrl !== '/register') {
                    router.push(returnUrl);
                    sessionStorage.removeItem('returnUrl');
                } else {
                    router.push('/');
                }
            } catch (error) {
                console.error('Google login failed:', error);
            } finally {
                setIsLoading(false);
            }
        },
        onError: () => {
            console.error('Google Login Failed');
            setIsLoading(false);
        }
    });

    if (!showPopup) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
            {/* Backdrop with blur */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={handleClose}></div>

            {/* Popup Card with Glassmorphism */}
            <div className="relative bg-gradient-to-br from-card/95 to-card/90 backdrop-blur-xl border border-border/50 rounded-3xl shadow-2xl max-w-md w-full p-8 animate-in zoom-in-95 duration-300">
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 rounded-3xl pointer-events-none"></div>

                {/* Glass Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent rounded-3xl pointer-events-none"></div>

                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-all duration-200 backdrop-blur-sm z-10"
                    aria-label="Close"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Content */}
                <div className="relative text-center">
                    <div className="mb-6">
                        <h2 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] animate-gradient">
                            Welcome! 👋
                        </h2>
                        <p className="text-muted-foreground">
                            Sign in to save your progress and unlock all features
                        </p>
                    </div>

                    <div className="space-y-3">
                        {/* Google Sign In Button */}
                        <button
                            onClick={() => googleLogin()}
                            disabled={isLoading}
                            className="w-full px-6 py-3 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            {isLoading ? 'Signing in...' : 'Continue with Google'}
                        </button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-border/50"></div>
                            </div>
                            <div className="relative flex justify-center text-xs">
                                <span className="px-2 bg-card/80 backdrop-blur-sm text-muted-foreground">or</span>
                            </div>
                        </div>

                        <Link href="/register" onClick={() => handleSignInClick('/register')}>
                            <button className="w-full px-6 py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl font-semibold hover:shadow-lg hover:shadow-primary/50 transition-all duration-200 hover:scale-[1.02]">
                                Create Free Account
                            </button>
                        </Link>
                        <Link href="/login" onClick={() => handleSignInClick('/login')}>
                            <button className="w-full px-6 py-3 bg-white/10 backdrop-blur-sm text-foreground rounded-xl font-semibold hover:bg-white/20 transition-all duration-200 border border-white/20">
                                Sign In with Email
                            </button>
                        </Link>
                        <button
                            onClick={handleClose}
                            className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors pt-2"
                        >
                            Continue browsing
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
