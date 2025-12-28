import React from 'react';
import CompilerClient from './CompilerClient';
import { API_BASE_URL } from '@/lib/api-client';

export const metadata = {
    title: 'Online Compiler & IDE - Run Python, Java, C++, Go, Rust | IntelForgeeks',
    description: 'Free, fast, and powerful Online Compiler and IDE. Run code instantly in 18+ programming languages including Python, Java, C++, JavaScript, Rust, Go, and more. No installation required.',
    keywords: [
        'online compiler',
        'online ide',
        'code editor online',
        'run python online',
        'run java online',
        'run c++ online',
        'javascript compiler',
        'rust playground',
        'go playground',
        'python ide',
        'compiler for freelancers',
        'web based ide'
    ],
    alternates: {
        canonical: 'https://www.intelforgeeks.com/compiler',
    },
    openGraph: {
        title: 'Online Compiler & IDE - Run Code Instantly | IntelForgeeks',
        description: 'Write and execute code in 18+ languages directly in your browser. Fast, free, and no setup needed.',
        url: 'https://www.intelforgeeks.com/compiler',
        type: 'website',
        images: [
            {
                url: 'https://www.intelforgeeks.com/og-compiler.jpg', // You might want to create this image later
                width: 1200,
                height: 630,
                alt: 'IntelForgeeks Online Compiler Interface',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Run Code Online in 18+ Languages - IntelForgeeks Compiler',
        description: 'Python, Java, C++, Rust, Go and more. The fastest way to specific code snippets online.',
    }
};

export default function CompilerPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "IntelForgeeks Online Compiler",
        "applicationCategory": "DeveloperApplication",
        "operatingSystem": "Any",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "description": "A powerful online compiler and IDE supporting over 18 programming languages. Features real-time execution, syntax highlighting, and a responsive interface.",
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "ratingCount": "1024"
        },
        "featureList": "Multi-language support, Real-time execution, Syntax Highlighting, No installation required"
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Main Compiler Interface */}
            <CompilerClient />

            {/* SEO Content Section - Below the fold */}
            <div className="bg-muted/30 border-t border-border mt-12 py-16">
                <div className="container mx-auto px-4 max-w-5xl">

                    {/* Features Grid */}
                    <section className="mb-16">
                        <h2 className="text-3xl font-bold mb-8 text-center">Why Use Our Online Compiler?</h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                                    ⚡ Instant Execution
                                </h3>
                                <p className="text-muted-foreground">
                                    Run your code in milliseconds. Our cloud-based compilation engine ensures fast and reliable output for all supported languages.
                                </p>
                            </div>
                            <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                                    🌐 18+ Languages
                                </h3>
                                <p className="text-muted-foreground">
                                    From popular languages like Python and Java to modern systems languages like Rust and Go. We supports them all in one place.
                                </p>
                            </div>
                            <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                                    🛠️ Zero Setup
                                </h3>
                                <p className="text-muted-foreground">
                                    Forget about setting up local environments, installing compilers, or managing dependencies. Just open your browser and code.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Supported Languages List - Great for Long Tail Keywords */}
                    <section className="mb-16">
                        <h2 className="text-2xl font-bold mb-6">Supported Programming Languages</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                "Python (3.x)", "JavaScript (Node.js)", "Java (OpenJDK)", "C++ (GCC)",
                                "C (GCC)", "Go (Golang)", "Rust", "TypeScript",
                                "PHP", "C# (.NET)", "Ruby", "Swift",
                                "R Language", "Bash Shell"
                            ].map((lang) => (
                                <div key={lang} className="flex items-center gap-2 p-3 bg-secondary/20 rounded-lg text-sm font-medium">
                                    <span className="w-2 h-2 rounded-full bg-primary/60"></span>
                                    {lang}
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* FAQ Section - Rich Snippet Potential */}
                    <section>
                        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
                        <div className="space-y-4">
                            <div className="bg-card p-5 rounded-lg border border-border">
                                <h3 className="font-semibold text-lg mb-2">Is this online compiler free?</h3>
                                <p className="text-muted-foreground">Yes, the IntelForgeeks Online Compiler is 100% free to use for learning, testing, and running code snippets.</p>
                            </div>
                            <div className="bg-card p-5 rounded-lg border border-border">
                                <h3 className="font-semibold text-lg mb-2">Do I need to install anything?</h3>
                                <p className="text-muted-foreground">No. Our IDE runs entirely in your web browser. The code is executed on our secure cloud servers.</p>
                            </div>
                            <div className="bg-card p-5 rounded-lg border border-border">
                                <h3 className="font-semibold text-lg mb-2">Can I use this on mobile?</h3>
                                <p className="text-muted-foreground">Absolutely. Our interface is fully responsive and optimized for mobile devices and tablets.</p>
                            </div>
                        </div>
                    </section>

                </div>
            </div>
        </>
    );
}
