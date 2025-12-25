"use client";
import { useState, useEffect } from 'react';
import { List, Eye, EyeOff, GripVertical, RefreshCw } from 'lucide-react';

export default function TOCBuilder({ content, tocItems = [], showToc = true, onChange, onShowTocChange }) {
    const [headings, setHeadings] = useState([]);
    const [selectedHeadings, setSelectedHeadings] = useState(tocItems);

    // Extract headings from HTML content
    const extractHeadings = () => {
        if (!content) return;

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = content;

        const headingElements = tempDiv.querySelectorAll('h2, h3, h4');
        const extracted = Array.from(headingElements).map((heading, index) => {
            const text = heading.textContent || '';
            const level = parseInt(heading.tagName.substring(1));
            const id = text
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '') || `heading-${index}`;

            return {
                id,
                text,
                level,
                order: index
            };
        });

        setHeadings(extracted);

        // Auto-select all if no previous selection
        if (tocItems.length === 0 && extracted.length > 0) {
            setSelectedHeadings(extracted);
            onChange(extracted);
        }
    };

    useEffect(() => {
        extractHeadings();
    }, [content]);

    const toggleHeading = (heading) => {
        const isSelected = selectedHeadings.some(h => h.id === heading.id);
        let updated;

        if (isSelected) {
            updated = selectedHeadings.filter(h => h.id !== heading.id);
        } else {
            updated = [...selectedHeadings, heading].sort((a, b) => a.order - b.order);
        }

        setSelectedHeadings(updated);
        onChange(updated);
    };

    const moveHeading = (index, direction) => {
        const updated = [...selectedHeadings];
        const newIndex = direction === 'up' ? index - 1 : index + 1;

        if (newIndex < 0 || newIndex >= updated.length) return;

        [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
        setSelectedHeadings(updated);
        onChange(updated);
    };

    const isSelected = (heading) => selectedHeadings.some(h => h.id === heading.id);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <List className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold">Table of Contents</h3>
                    <span className="text-sm text-muted-foreground">
                        ({selectedHeadings.length} of {headings.length} headings)
                    </span>
                </div>
                <button
                    type="button"
                    onClick={extractHeadings}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm border border-border rounded-lg hover:bg-muted transition-colors"
                    title="Refresh headings from content"
                >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                </button>
            </div>

            {/* Show TOC Checkbox */}
            <div className="flex items-center gap-2 p-3 bg-muted/50 border border-border rounded-lg">
                <input
                    type="checkbox"
                    id="showToc"
                    checked={showToc}
                    onChange={(e) => onShowTocChange && onShowTocChange(e.target.checked)}
                    className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-2 focus:ring-primary cursor-pointer"
                />
                <label htmlFor="showToc" className="text-sm font-medium cursor-pointer">
                    Show Table of Contents on live site
                </label>
            </div>

            {headings.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-border rounded-lg">
                    <List className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-muted-foreground mb-2">No headings found in content</p>
                    <p className="text-sm text-muted-foreground">Add H2, H3, or H4 headings to your blog post</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {/* Available Headings */}
                    <div className="border border-border rounded-lg p-4">
                        <h4 className="text-sm font-medium mb-3">Available Headings (click to toggle)</h4>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                            {headings.map((heading) => (
                                <button
                                    key={heading.id}
                                    type="button"
                                    onClick={() => toggleHeading(heading)}
                                    className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors text-left ${isSelected(heading)
                                        ? 'bg-primary/10 border border-primary'
                                        : 'hover:bg-muted border border-transparent'
                                        }`}
                                >
                                    {isSelected(heading) ? (
                                        <Eye className="w-4 h-4 text-primary flex-shrink-0" />
                                    ) : (
                                        <EyeOff className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                    )}
                                    <span
                                        className={`text-sm ${heading.level === 3 ? 'ml-4' : heading.level === 4 ? 'ml-8' : ''
                                            }`}
                                    >
                                        {heading.text}
                                    </span>
                                    <span className="ml-auto text-xs text-muted-foreground">
                                        H{heading.level}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Selected TOC Order */}
                    {selectedHeadings.length > 0 && (
                        <div className="border border-border rounded-lg p-4 bg-muted/30">
                            <h4 className="text-sm font-medium mb-3">TOC Order (drag to reorder)</h4>
                            <div className="space-y-2">
                                {selectedHeadings.map((heading, index) => (
                                    <div
                                        key={heading.id}
                                        className="flex items-center gap-2 p-2 bg-background border border-border rounded-lg"
                                    >
                                        <GripVertical className="w-4 h-4 text-muted-foreground cursor-move" />
                                        <span className="text-sm flex-1">{heading.text}</span>
                                        <div className="flex gap-1">
                                            <button
                                                type="button"
                                                onClick={() => moveHeading(index, 'up')}
                                                disabled={index === 0}
                                                className="p-1 text-xs hover:bg-muted rounded disabled:opacity-30"
                                            >
                                                ↑
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => moveHeading(index, 'down')}
                                                disabled={index === selectedHeadings.length - 1}
                                                className="p-1 text-xs hover:bg-muted rounded disabled:opacity-30"
                                            >
                                                ↓
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
