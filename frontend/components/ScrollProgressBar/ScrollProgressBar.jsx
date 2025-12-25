import { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import styles from './ScrollProgressBar.module.css';

// Global flag to ensure confetti only triggers once per page load
let confettiShown = false;

export default function ScrollProgressBar({ articleId }) {
    const [progress, setProgress] = useState(0);
    const [showConfetti, setShowConfetti] = useState(false);
    const barColor = 'linear-gradient(90deg, rgba(58,75,180,1) 0%, rgba(129,29,253,1) 50%, rgba(231,7,159,1) 100%)';

    const updateProgressBar = () => {
        if (typeof window === 'undefined' || !document) return;

        const articleElement = document.getElementById(articleId);
        if (!articleElement) return;

        const articleHeight = articleElement.scrollHeight - window.innerHeight;
        const scrollTop = window.scrollY - articleElement.offsetTop;

        const scrollProgress = (scrollTop / articleHeight) * 100;
        setProgress(scrollProgress);

        if (scrollProgress >= 98 && !confettiShown) {
            setShowConfetti(true);
            confettiShown = true; // Set the flag to true so it won't show again
            setTimeout(() => setShowConfetti(false), 4000); // Show confetti for 4 seconds
        }
    };

    useEffect(() => {
        const handleScroll = () => updateProgressBar();

        if (typeof window !== 'undefined') {
            window.addEventListener('scroll', handleScroll);
        }

        return () => {
            if (typeof window !== 'undefined') {
                window.removeEventListener('scroll', handleScroll);
            }
        };
    }, [articleId]); // Reattach listener when articleId changes to handle different articles correctly

    return (
        <div className={styles.progressContainer} onClick={updateProgressBar}>
            {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}
            <div
                className={styles.progressBar}
                style={{ width: `${progress}%`, background: barColor }}
            ></div>
        </div>
    );
}
