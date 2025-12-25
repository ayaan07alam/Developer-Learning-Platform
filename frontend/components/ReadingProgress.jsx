"use client";
import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';

export default function ReadingProgress({ slug }) {
    const [progress, setProgress] = useState(0);
    const [hasSeenFireworks, setHasSeenFireworks] = useState(false);

    useEffect(() => {
        // Check if user has already seen fireworks for this blog
        const seenKey = `fireworks-seen-${slug}`;
        const alreadySeen = localStorage.getItem(seenKey);
        setHasSeenFireworks(!!alreadySeen);

        const handleScroll = () => {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollTop = window.scrollY;

            // Calculate progress percentage
            const scrollableHeight = documentHeight - windowHeight;
            const scrollPercentage = (scrollTop / scrollableHeight) * 100;

            setProgress(Math.min(scrollPercentage, 100));

            // Trigger fireworks when reaching 95% (near end) for first time
            if (scrollPercentage >= 95 && !alreadySeen && !hasSeenFireworks) {
                triggerFireworks();
                localStorage.setItem(seenKey, 'true');
                setHasSeenFireworks(true);
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial calculation

        return () => window.removeEventListener('scroll', handleScroll);
    }, [slug, hasSeenFireworks]);

    const triggerFireworks = () => {
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);

            // Fireworks from different positions
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
            });
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
            });
        }, 250);

        // Big finale
        setTimeout(() => {
            confetti({
                particleCount: 200,
                spread: 200,
                origin: { y: 0.6 },
                colors: ['#833ab4', '#fd1d1d', '#07e70d']
            });
        }, 1000);
    };

    return (
        <>
            {/* Progress Bar */}
            <div className="fixed top-0 left-0 right-0 h-1 bg-transparent z-50">
                <div
                    className="h-full bg-gradient-to-r from-primary via-accent to-primary transition-all duration-150 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Scroll Progress Indicator (Circular) */}
            <div className="fixed bottom-8 left-8 z-40">
                <div className="relative w-14 h-14">
                    {/* Background Circle */}
                    <svg className="transform -rotate-90 w-14 h-14">
                        <circle
                            cx="28"
                            cy="28"
                            r="24"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                            className="text-border"
                        />
                        {/* Progress Circle */}
                        <circle
                            cx="28"
                            cy="28"
                            r="24"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                            strokeDasharray={`${2 * Math.PI * 24}`}
                            strokeDashoffset={`${2 * Math.PI * 24 * (1 - progress / 100)}`}
                            className="text-primary transition-all duration-150 ease-out"
                            strokeLinecap="round"
                        />
                    </svg>
                    {/* Percentage Text */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-bold">{Math.round(progress)}%</span>
                    </div>
                </div>
            </div>
        </>
    );
}
