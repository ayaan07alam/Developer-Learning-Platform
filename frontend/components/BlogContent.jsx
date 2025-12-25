"use client";
import { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import CodeBlockRenderer from './CodeBlockRenderer';

export default function BlogContent({ htmlContent }) {
    const contentRef = useRef(null);

    // First useEffect: Setup content (headings, code blocks) when HTML changes
    useEffect(() => {
        if (!contentRef.current) return;

        const contentElement = contentRef.current;

        // Add IDs to all headings for TOC navigation (only if they don't have one)
        const headings = contentElement.querySelectorAll('h1, h2, h3, h4, h5, h6');
        headings.forEach((heading, index) => {
            if (!heading.id || heading.id.trim() === '') {
                const text = heading.textContent || '';
                const id = text
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)/g, '') || `heading-${index}`;
                heading.id = id;
            }
            heading.style.scrollMarginTop = '100px';
        });

        // Find all code blocks in the HTML
        const codeBlocks = contentElement.querySelectorAll('pre code');
        codeBlocks.forEach((codeElement) => {
            const preElement = codeElement.parentElement;
            if (!preElement) return;

            const className = codeElement.className || '';
            const languageMatch = className.match(/language-(\w+)/);
            const language = languageMatch ? languageMatch[1] : 'text';
            const code = codeElement.textContent || '';
            const savedOutput = preElement.getAttribute('data-saved-output');

            const wrapper = document.createElement('div');
            preElement.parentNode?.replaceChild(wrapper, preElement);

            const root = createRoot(wrapper);
            root.render(
                <CodeBlockRenderer
                    code={code}
                    language={language}
                    savedOutput={savedOutput}
                />
            );
        });
    }, [htmlContent]);

    // Second useEffect: Global click handler (runs ONCE, never removed until unmount)
    useEffect(() => {
        const handleHashLinkClick = (e) => {
            const link = e.target.closest('a');
            if (!link) return;

            const href = link.getAttribute('href');

            if (href && href.startsWith('#')) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();

                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    // NOTE: Not updating URL to avoid Next.js navigation issues
                }

                return false;
            }
        };

        // Add listener ONCE on mount
        document.addEventListener('click', handleHashLinkClick, true);

        // Remove ONLY on unmount
        return () => {
            document.removeEventListener('click', handleHashLinkClick, true);
        };
    }, []); // Empty array = runs once on mount, cleanup on unmount only

    return (
        <div
            ref={contentRef}
            className="prose prose-lg dark:prose-invert max-w-none text-foreground leading-relaxed space-y-6 
                       prose-headings:scroll-mt-24
                       prose-a:text-primary prose-a:underline prose-a:decoration-primary/30 
                       hover:prose-a:decoration-primary prose-a:transition-colors
                       prose-a:cursor-pointer"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
    );
}
