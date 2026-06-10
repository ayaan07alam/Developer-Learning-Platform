"use client";
import { useState, useEffect } from 'react';
import { List, Eye, EyeOff, RefreshCw, CheckSquare, Square } from 'lucide-react';

/**
 * TOCBuilder — Dashboard component for curating the "On this page" sidebar TOC.
 *
 * Props:
 *   content     — the rich-text HTML string from the editor (used to extract headings)
 *   tocItems    — current saved array of selected heading objects
 *   onChange    — callback(updatedItems[]) called whenever selection changes
 */
export default function TOCBuilder({ content, tocItems = [], onChange }) {
    const [allHeadings, setAllHeadings] = useState([]);  // every H2/H3/H4 in the article
    const [selected, setSelected] = useState(tocItems);  // which ones are in the sidebar TOC

    // ── Extract headings from HTML content ───────────────────────────────────
    const extractHeadings = () => {
        if (typeof document === 'undefined' || !content) {
            setAllHeadings([]);
            return;
        }

        const div = document.createElement('div');
        div.innerHTML = content;

        const els = div.querySelectorAll('h2, h3, h4');
        const extracted = Array.from(els).map((el, index) => {
            const text = el.textContent?.trim() || '';
            const level = parseInt(el.tagName.substring(1), 10);
            const id =
                text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') ||
                `heading-${index}`;
            return { id, text, level, order: index };
        }).filter(h => h.text);

        setAllHeadings(extracted);

        // First time (no saved selection) → auto-select all H2s
        if (tocItems.length === 0 && extracted.length > 0) {
            const defaultSelected = extracted.filter(h => h.level === 2);
            setSelected(defaultSelected);
            onChange(defaultSelected);
        }
    };

    useEffect(() => {
        extractHeadings();
    }, [content]);

    // Keep local state in sync if parent resets tocItems (e.g. on post load)
    useEffect(() => {
        setSelected(tocItems);
    }, [tocItems]);

    // ── Toggle a heading in/out of TOC ───────────────────────────────────────
    const toggle = (heading) => {
        const isSelected = selected.some(h => h.id === heading.id);
        const updated = isSelected
            ? selected.filter(h => h.id !== heading.id)
            : [...selected, heading].sort((a, b) => a.order - b.order);

        setSelected(updated);
        onChange(updated);
    };

    const selectAll = () => {
        setSelected(allHeadings);
        onChange(allHeadings);
    };

    const selectNone = () => {
        setSelected([]);
        onChange([]);
    };

    const isSelected = (h) => selected.some(s => s.id === h.id);

    const levelLabel = { 2: 'H2', 3: 'H3', 4: 'H4' };
    const levelIndent = { 2: '', 3: 'pl-4', 4: 'pl-8' };

    return (
        <div className="space-y-4">
            {/* ── Header ──────────────────────────────────────────────── */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <List className="w-4 h-4 text-primary" />
                    <h3 className="text-sm font-semibold text-foreground">
                        Sidebar TOC
                    </h3>
                    {allHeadings.length > 0 && (
                        <span className="text-xs text-muted-foreground">
                            {selected.length}/{allHeadings.length} selected
                        </span>
                    )}
                </div>
                <button
                    type="button"
                    onClick={extractHeadings}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium border border-border rounded-md hover:bg-muted transition-colors text-muted-foreground"
                    title="Re-scan headings from content"
                >
                    <RefreshCw className="w-3 h-3" />
                    Refresh
                </button>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
                Choose which headings appear in the "On this page" sidebar panel.
                Unselected headings won't show in the sidebar TOC.
            </p>

            {/* ── No headings state ────────────────────────────────────── */}
            {allHeadings.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-6 border border-dashed border-border rounded-xl text-center">
                    <List className="w-8 h-8 text-muted-foreground/30" />
                    <p className="text-sm text-muted-foreground">No headings found</p>
                    <p className="text-xs text-muted-foreground/60">
                        Add H2, H3, or H4 headings to your article to build a TOC.
                    </p>
                </div>
            ) : (
                <div className="rounded-xl border border-border overflow-hidden">
                    {/* Quick-action bar */}
                    <div className="flex items-center justify-between px-3 py-2 bg-muted/40 border-b border-border">
                        <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                            Headings
                        </span>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={selectAll}
                                className="text-[11px] font-medium text-primary hover:underline"
                            >
                                All
                            </button>
                            <span className="text-muted-foreground/30">·</span>
                            <button
                                type="button"
                                onClick={selectNone}
                                className="text-[11px] font-medium text-muted-foreground hover:text-foreground"
                            >
                                None
                            </button>
                        </div>
                    </div>

                    {/* Heading list */}
                    <div className="divide-y divide-border max-h-64 overflow-y-auto">
                        {allHeadings.map((heading) => {
                            const active = isSelected(heading);
                            return (
                                <button
                                    key={heading.id}
                                    type="button"
                                    onClick={() => toggle(heading)}
                                    className={[
                                        "w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors",
                                        levelIndent[heading.level] || '',
                                        active
                                            ? "bg-primary/5"
                                            : "hover:bg-muted/50",
                                    ].join(' ')}
                                >
                                    {/* Checkbox icon */}
                                    {active
                                        ? <CheckSquare className="w-3.5 h-3.5 text-primary shrink-0" />
                                        : <Square className="w-3.5 h-3.5 text-muted-foreground/40 shrink-0" />
                                    }

                                    {/* Heading text */}
                                    <span className={`text-[12.5px] flex-1 leading-snug truncate ${active ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                                        {heading.text}
                                    </span>

                                    {/* Level badge */}
                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${active ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                                        {levelLabel[heading.level] || `H${heading.level}`}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* ── Preview of what will appear in sidebar ───────────────── */}
            {selected.length > 0 && (
                <div className="rounded-xl border border-border bg-card overflow-hidden">
                    <div className="px-3 py-2 border-b border-border bg-muted/30">
                        <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-primary">
                            Sidebar preview
                        </p>
                    </div>
                    <ul className="py-1">
                        {selected.map((h) => (
                            <li
                                key={h.id}
                                className={`py-1.5 pr-3 text-[11.5px] text-muted-foreground truncate ${h.level === 3 ? 'pl-7' : h.level === 4 ? 'pl-10' : 'pl-4'}`}
                            >
                                {h.text}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
