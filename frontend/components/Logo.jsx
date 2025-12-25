import React from "react";

export const Logo = ({ className }) => {
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 100 100"
                className="w-10 h-10"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                {/* Brain/Circuit Shape */}
                <path
                    d="M50 20 C 30 20, 15 35, 15 55 C 15 75, 30 85, 45 88"
                    stroke="hsl(263, 70%, 50%)" /* Primary - Lavender */
                    strokeWidth="6"
                />
                <path
                    d="M55 88 C 70 85, 85 75, 85 55 C 85 35, 70 20, 50 20"
                    stroke="hsl(29, 96%, 61%)" /* Secondary - Orange */
                    strokeWidth="6"
                />

                {/* Circuit Nodes/Connections */}
                <circle cx="30" cy="45" r="4" fill="hsl(142, 71%, 58%)" /> {/* Green */}
                <circle cx="70" cy="45" r="4" fill="hsl(142, 71%, 58%)" /> {/* Green */}
                <circle cx="50" cy="30" r="4" fill="hsl(142, 71%, 58%)" /> {/* Green */}
                <circle cx="50" cy="70" r="4" fill="hsl(142, 71%, 58%)" /> {/* Green */}

                <path
                    d="M30 45 L 50 30 L 70 45"
                    stroke="hsl(142, 71%, 58%)"
                    strokeWidth="3"
                />
                <path
                    d="M30 45 L 30 65 L 50 70"
                    stroke="hsl(263, 70%, 50%)"
                    strokeWidth="3"
                />
                <path
                    d="M70 45 L 70 65 L 50 70"
                    stroke="hsl(29, 96%, 61%)"
                    strokeWidth="3"
                />
            </svg>
            <span className="text-xl font-bold tracking-tight">
                <span className="text-primary">Intelli</span>
                <span className="text-secondary">geek</span>
                <span className="text-accent text-2xl">.</span>
            </span>
        </div>
    );
};
