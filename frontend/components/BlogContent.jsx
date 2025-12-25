"use client";
import { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import CodeBlockRenderer from './CodeBlockRenderer';

export default function BlogContent({ htmlContent }) {
    const contentRef = useRef(null);

    useEffect(() => {
        if (!contentRef.current) return;

        // Add IDs to all headings for TOC navigation
        const headings = contentRef.current.querySelectorAll('h2, h3, h4, h5, h6');
        headings.forEach((heading, index) => {
            if (!heading.id) {
                const text = heading.textContent || '';
                // Generate ID same way as TOCBuilder does
                const id = text
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)/g, '') || `heading-${index}`;
                heading.id = id;

                // Ensure heading is scrollable with offset for fixed header
                heading.style.scrollMarginTop = '100px';
            }
        });

        // Find all code blocks in the HTML
        const codeBlocks = contentRef.current.querySelectorAll('pre code');

        codeBlocks.forEach((codeElement) => {
            const preElement = codeElement.parentElement;
            if (!preElement) return;

            // Extract language from class (e.g., "language-python")
            const className = codeElement.className || '';
            const languageMatch = className.match(/language-(\w+)/);
            const language = languageMatch ? languageMatch[1] : 'text';

            // Get the code content
            const code = codeElement.textContent || '';

            // Try to extract saved output from data attributes
            const savedOutput = preElement.getAttribute('data-saved-output');

            // Create a wrapper div
            const wrapper = document.createElement('div');
            preElement.parentNode?.replaceChild(wrapper, preElement);

            // Render the interactive code block
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
