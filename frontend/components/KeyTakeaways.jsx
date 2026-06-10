"use client";
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * KeyTakeaways — Reader-facing display component.
 *
 * Renders a premium "Key Takeaways" summary box.
 * Place it right after the featured image, before the article body.
 *
 * Props:
 *   keyTakeaways — JSON string (from API) or string[] of bullet points
 */
export default function KeyTakeaways({ keyTakeaways }) {
    // Parse from JSON string or use as-is if already an array
    let items = [];
    try {
        items = typeof keyTakeaways === 'string'
            ? JSON.parse(keyTakeaways || '[]')
            : (Array.isArray(keyTakeaways) ? keyTakeaways : []);
    } catch {
        items = [];
    }

    // Only render if there are valid non-empty strings
    const validItems = items.filter(t => typeof t === 'string' && t.trim());
    if (validItems.length === 0) return null;

    return (
        <motion.aside
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            aria-label="Key Takeaways"
            className="key-takeaways-box my-8 rounded-2xl overflow-hidden border border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background shadow-premium"
        >
            {/* Header strip */}
            <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-primary/15 bg-primary/5">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/15">
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary select-none">
                    Key Takeaways
                </span>
            </div>

            {/* Bullet list */}
            <ul className="px-5 py-4 space-y-3">
                {validItems.map((item, index) => (
                    <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.06 * index, duration: 0.3 }}
                        className="flex items-start gap-3 group"
                    >
                        {/* Numbered bullet */}
                        <span
                            className="mt-0.5 w-5 h-5 rounded-full bg-primary/12 border border-primary/20 text-primary text-[10px] font-bold flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200"
                            aria-hidden="true"
                        >
                            {index + 1}
                        </span>

                        {/* Takeaway text */}
                        <p className="text-[14px] leading-relaxed text-foreground/85 group-hover:text-foreground transition-colors duration-150">
                            {item}
                        </p>
                    </motion.li>
                ))}
            </ul>
        </motion.aside>
    );
}
