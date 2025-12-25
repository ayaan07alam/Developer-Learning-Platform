"use client";
import { useState, useEffect } from 'react';
import { ChevronRight, List } from 'lucide-react';

export default function TableOfContents({ tocItems }) {
    const [headings, setHeadings] = useState([]);
    const [activeId, setActiveId] = useState('');
    const [isOpen, setIsOpen] = useState(true);

    useEffect(() => {
        // Parse TOC items if it's a string
        let parsedItems = [];
        if (typeof tocItems === 'string') {
            try {
                parsedItems = JSON.parse(tocItems);
            } catch (e) {
                console.error('Failed to parse TOC items:', e);
                parsedItems = [];
            }
        } else if (Array.isArray(tocItems)) {
            parsedItems = tocItems;
        }

        setHeadings(parsedItems);

        // Scroll spy
        const handleScroll = () => {
            const headingElements = parsedItems.map(h => document.getElementById(h.id)).filter(Boolean);

            for (let i = headingElements.length - 1; i >= 0; i--) {
                const heading = headingElements[i];
                if (heading && heading.getBoundingClientRect().top < 100) {
                    setActiveId(heading.id);
                    break;
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [tocItems]);

    const scrollToHeading = (id, event) => {
        // Prevent default link behavior
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        const element = document.getElementById(id);
        if (element) {
            // Smooth scroll to element
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });

            // Update URL hash without jumping
            if (window.history.pushState) {
                window.history.pushState(null, null, `#${id}`);
            }
        }
    };

    if (headings.length === 0) return null;

    return (
        <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
            <div className="bg-card border border-border rounded-lg p-4">
                {/* Header */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center justify-between w-full mb-3 text-lg font-semibold"
                >
                    <div className="flex items-center gap-2">
                        <List className="w-5 h-5 text-primary" />
                        <span>Table of Contents</span>
                    </div>
                    <ChevronRight className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                </button>

                {/* TOC List */}
                {isOpen && (
                    <nav className="space-y-1">
                        {headings.map((heading) => (
                            <a
                                key={heading.id}
                                href={`#${heading.id}`}
                                onClick={(e) => scrollToHeading(heading.id, e)}
                                className={`block w-full text-left py-2 px-3 rounded-lg transition-colors text-sm no-underline ${heading.level === 3 ? 'pl-6' : ''
                                    } ${activeId === heading.id
                                        ? 'bg-primary/10 text-primary font-medium'
                                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                    }`}
                            >
                                {heading.text}
                            </a>
                        ))}
                    </nav>
                )}
            </div>
        </div>
    );
}
