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

        // Style TOC tables (apply styles via JavaScript to bypass backend sanitization)
        const tocTables = contentElement.querySelectorAll('table[data-toc="true"]');
        const allTables = tocTables.length === 0 ? contentElement.querySelectorAll('table') : tocTables;

        allTables.forEach((table) => {
            const firstCell = table.querySelector('td');
            if (!firstCell) return;

            // Check if this is a TOC table
            if (tocTables.length === 0 && !firstCell.textContent.includes('Table of Contents')) return;

            // Apply container styles
            table.style.width = '100%';
            table.style.height = 'auto'; // ensure height matches content
            table.style.background = 'hsl(var(--card))'; // Use theme card color
            table.style.border = '1px solid hsl(var(--border))';
            table.style.padding = '24px';
            table.style.borderRadius = '12px';
            table.style.margin = '32px 0';
            table.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
            table.style.borderCollapse = 'separate';
            table.style.borderSpacing = '0';

            // Style the header div
            const headerDiv = firstCell.querySelector('div');
            if (headerDiv) {
                headerDiv.style.display = 'flex';
                headerDiv.style.alignItems = 'center';
                headerDiv.style.gap = '12px';
                headerDiv.style.marginBottom = '20px';
                headerDiv.style.paddingBottom = '16px';
                headerDiv.style.borderBottom = '1px solid hsl(var(--border))';

                // Style icon and title
                const icon = headerDiv.querySelector('span:first-child');
                const title = headerDiv.querySelector('span:last-child');
                if (icon) {
                    icon.style.fontSize = '20px';
                    icon.style.color = 'hsl(var(--primary))'; // Cyan
                }
                if (title) {
                    title.style.fontSize = '18px';
                    title.style.fontWeight = '600';
                    title.style.color = 'hsl(var(--foreground))';
                }
            }

            // Remove bullets from any lists inside the TOC cells
            const lists = firstCell.querySelectorAll('ul, ol');
            lists.forEach(list => {
                list.style.listStyle = 'none';
                list.style.paddingLeft = '0';
                list.style.margin = '0';
            });

            const listItems = firstCell.querySelectorAll('li');
            listItems.forEach(li => {
                li.style.listStyle = 'none';
                li.style.marginTop = '8px'; // Add some spacing
                // Force removal of markers if prose adds them
                li.className = (li.className || '') + ' list-none';
            });

            // Style all links
            const links = firstCell.querySelectorAll('a');
            links.forEach(link => {
                link.style.color = 'hsl(var(--primary))'; // Cyan
                link.style.textDecoration = 'none';
                link.style.display = 'inline-block';
                link.style.padding = '4px 0';
                link.style.fontSize = '15px';
                link.style.opacity = '0.9';

                // Add hover effect
                link.addEventListener('mouseenter', () => {
                    link.style.opacity = '1';
                    link.style.textDecoration = 'underline';
                });
                link.addEventListener('mouseleave', () => {
                    link.style.opacity = '0.9';
                    link.style.textDecoration = 'none';
                });
            });

            // Style the View all button
            const button = firstCell.querySelector('button');
            if (button) {
                button.style.background = 'transparent';
                button.style.color = 'hsl(var(--primary))';
                button.style.border = 'none';
                button.style.padding = '8px 0';
                button.style.cursor = 'pointer';
                button.style.fontSize = '14px';
                button.style.fontWeight = '500';
                button.style.marginTop = '16px';
            }
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
