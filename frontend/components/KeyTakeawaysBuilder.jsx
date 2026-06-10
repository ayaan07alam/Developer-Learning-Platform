"use client";
import { useState } from 'react';
import { Sparkles, Plus, Trash2, GripVertical, Eye, EyeOff } from 'lucide-react';

/**
 * KeyTakeawaysBuilder — Dashboard component for managing "Key Takeaways".
 *
 * Props:
 *   items     — string[] of current takeaway bullets
 *   onChange  — callback(updatedItems: string[])
 */
export default function KeyTakeawaysBuilder({ items = [], onChange }) {
    const [showPreview, setShowPreview] = useState(false);

    const update = (index, value) => {
        const updated = [...items];
        updated[index] = value;
        onChange(updated);
    };

    const add = () => onChange([...items, '']);

    const remove = (index) => onChange(items.filter((_, i) => i !== index));

    const move = (from, to) => {
        if (to < 0 || to >= items.length) return;
        const updated = [...items];
        const [moved] = updated.splice(from, 1);
        updated.splice(to, 0, moved);
        onChange(updated);
    };

    const validItems = items.filter(t => t.trim());

    return (
        <div className="space-y-4">
            {/* ── Header ────────────────────────────────────────── */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <h3 className="text-sm font-semibold text-foreground">Key Takeaways</h3>
                    {validItems.length > 0 && (
                        <span className="text-xs text-muted-foreground">{validItems.length} point{validItems.length !== 1 ? 's' : ''}</span>
                    )}
                </div>
                {validItems.length > 0 && (
                    <button
                        type="button"
                        onClick={() => setShowPreview(p => !p)}
                        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                        {showPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        {showPreview ? 'Hide' : 'Preview'}
                    </button>
                )}
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
                Optional — add 3–6 bullet points summarising the article.
                This helps Google AI Overviews and improves featured snippet chances.
                Leave empty to hide the box.
            </p>

            {/* ── Live preview ──────────────────────────────────── */}
            {showPreview && validItems.length > 0 && (
                <div className="rounded-xl border border-primary/25 bg-primary/4 overflow-hidden">
                    <div className="flex items-center gap-2 px-4 py-3 border-b border-primary/15">
                        <Sparkles className="w-3.5 h-3.5 text-primary" />
                        <span className="text-[11px] font-bold uppercase tracking-widest text-primary">
                            Key Takeaways — reader preview
                        </span>
                    </div>
                    <ul className="px-4 py-3 space-y-2">
                        {validItems.map((item, i) => (
                            <li key={i} className="flex items-start gap-2.5 text-[12.5px] text-muted-foreground">
                                <span className="mt-0.5 w-4 h-4 rounded-full bg-primary/15 text-primary text-[10px] font-bold flex items-center justify-center shrink-0">
                                    {i + 1}
                                </span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* ── Input list ────────────────────────────────────── */}
            <div className="space-y-2">
                {items.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 group">
                        {/* Drag handle (visual only) */}
                        <div className="flex flex-col gap-0.5 shrink-0">
                            <button
                                type="button"
                                onClick={() => move(index, index - 1)}
                                disabled={index === 0}
                                className="text-muted-foreground/30 hover:text-muted-foreground disabled:opacity-0 transition-colors leading-none text-xs"
                                title="Move up"
                            >▴</button>
                            <button
                                type="button"
                                onClick={() => move(index, index + 1)}
                                disabled={index === items.length - 1}
                                className="text-muted-foreground/30 hover:text-muted-foreground disabled:opacity-0 transition-colors leading-none text-xs"
                                title="Move down"
                            >▾</button>
                        </div>

                        {/* Number badge */}
                        <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center shrink-0">
                            {index + 1}
                        </span>

                        {/* Text input */}
                        <input
                            type="text"
                            value={item}
                            onChange={e => update(index, e.target.value)}
                            placeholder={`Takeaway point ${index + 1}…`}
                            maxLength={200}
                            className="flex-1 px-3 py-2 text-sm bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all placeholder:text-muted-foreground/40"
                        />

                        {/* Remove */}
                        <button
                            type="button"
                            onClick={() => remove(index)}
                            className="p-1.5 text-muted-foreground/40 hover:text-destructive transition-colors rounded-md hover:bg-destructive/10 shrink-0"
                            title="Remove"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    </div>
                ))}
            </div>

            {/* ── Add button ────────────────────────────────────── */}
            {items.length < 8 && (
                <button
                    type="button"
                    onClick={add}
                    className="w-full flex items-center justify-center gap-2 py-2.5 border border-dashed border-border rounded-lg text-sm text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
                >
                    <Plus className="w-3.5 h-3.5" />
                    Add point {items.length > 0 ? `(${items.length}/8)` : ''}
                </button>
            )}
        </div>
    );
}
