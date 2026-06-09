"use client";
import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

export default function ReadingProgress({ slug }) {
    const [progress, setProgress] = useState(0);
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollTop = window.scrollY;
            const scrollableHeight = documentHeight - windowHeight;
            const scrollPercentage = scrollableHeight > 0
                ? (scrollTop / scrollableHeight) * 100
                : 0;

            setProgress(Math.min(scrollPercentage, 100));
            setShowButton(scrollTop > 400);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, [slug]);

    return (
        <>
            <div className="fixed top-0 left-0 right-0 h-[2px] bg-border/40 z-50">
                <div
                    className="h-full bg-primary transition-[width] duration-150 ease-out shadow-[0_0_8px_hsl(var(--primary)/0.4)]"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {showButton && (
                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="fixed bottom-6 right-6 z-40 flex items-center justify-center w-10 h-10 rounded-full bg-card border border-border text-muted-foreground hover:text-primary hover:border-primary/40 shadow-premium transition-all duration-200 hover:-translate-y-0.5"
                    aria-label="Scroll to top"
                >
                    <ArrowUp className="w-4 h-4" />
                </button>
            )}
        </>
    );
}
