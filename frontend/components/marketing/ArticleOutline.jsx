"use client";
import { useEffect, useState, useRef } from "react";

export default function ArticleOutline({ containerSelector = ".article-content", tocItems }) {
    const [headings, setHeadings] = useState([]);
    const [activeId, setActiveId] = useState("");
    const navRef = useRef(null);

    useEffect(() => {
        // ── Strategy 1: Editor-curated tocItems from the database ────────────
        // If the author explicitly selected headings in the dashboard, use those.
        // tocItems arrives as a JSON string (stored in DB) or parsed array.
        if (tocItems) {
            let parsed = [];
            try {
                parsed = typeof tocItems === "string"
                    ? JSON.parse(tocItems)
                    : (Array.isArray(tocItems) ? tocItems : []);
            } catch { parsed = []; }

            if (parsed.length > 0) {
                setHeadings(parsed);
                setupScrollSpy(parsed);
                return;
            }
        }

        // ── Strategy 2: Auto-detect from DOM (legacy posts / no curation) ────
        // Delay lets BlogContent finish injecting IDs into heading elements.
        const timer = setTimeout(() => {
            const container = document.querySelector(containerSelector);
            if (!container) return;

            const elements = container.querySelectorAll("h2, h3");
            const items = Array.from(elements)
                .map((el) => ({
                    id: el.id,
                    text: el.textContent?.trim() || "",
                    level: el.tagName === "H3" ? 3 : 2,
                }))
                .filter((h) => h.id && h.text);

            setHeadings(items);
            setupScrollSpy(items);
        }, 700);

        return () => clearTimeout(timer);
    }, [containerSelector, tocItems]);

    const setupScrollSpy = (items) => {
        if (!items.length) return;

        const handleScroll = () => {
            const offset = 130;
            let current = items[0]?.id || "";
            for (const item of items) {
                const el = document.getElementById(item.id);
                if (el && el.getBoundingClientRect().top <= offset) {
                    current = item.id;
                }
            }
            setActiveId(current);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();
        // Note: cleanup is handled by the component's unmount (useEffect return)
        return () => window.removeEventListener("scroll", handleScroll);
    };

    const scrollTo = (id, e) => {
        e.preventDefault();
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
            if (window.history.pushState) {
                window.history.pushState(null, null, `#${id}`);
            }
        }
    };

    return (
        <div className="sticky top-24 flex flex-col gap-4">

            {/* ── TOC Panel ─────────────────────────────────────────── */}
            {headings.length >= 2 && (
                <nav
                    ref={navRef}
                    className="rounded-xl border border-border bg-card overflow-hidden"
                >
                    {/* Header */}
                    <div className="px-4 pt-3.5 pb-3 border-b border-border">
                        <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-primary">
                            On this page
                        </p>
                    </div>

                    {/* Scrollable list — capped so ads slot always shows */}
                    <ul
                        className="py-1.5 overflow-y-auto"
                        style={{ maxHeight: "38vh" }}
                    >
                        {headings.map((heading) => {
                            const isActive = activeId === heading.id;
                            return (
                                <li key={heading.id} className="relative">
                                    {/* Left border active indicator */}
                                    <span
                                        className="absolute left-0 top-0 bottom-0 w-0.5 rounded-r transition-all duration-200"
                                        style={{
                                            background: isActive
                                                ? "hsl(var(--primary))"
                                                : "transparent",
                                        }}
                                    />
                                    <a
                                        href={`#${heading.id}`}
                                        onClick={(e) => scrollTo(heading.id, e)}
                                        title={heading.text}
                                        className={[
                                            "block py-1.5 pr-3 text-[12px] leading-snug transition-colors duration-150 no-underline truncate",
                                            heading.level === 3 ? "pl-7" : "pl-4",
                                            isActive
                                                ? "text-primary font-semibold"
                                                : "text-muted-foreground hover:text-foreground",
                                        ].join(" ")}
                                    >
                                        {heading.text}
                                    </a>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            )}

            {/* ── Google Ads slot ──────────────────────────────────── */}
            {/*
                Reserved for Google AdSense.
                Replace inner content with <ins class="adsbygoogle" ...> when ready.
                min-height ensures the slot holds space even before ad loads.
            */}
            <div
                className="rounded-xl border border-dashed border-border/50 bg-muted/20 flex flex-col items-center justify-center"
                style={{ minHeight: "260px" }}
                aria-label="Advertisement"
            >
                <span className="text-[9.5px] font-bold uppercase tracking-widest text-muted-foreground/30 select-none pointer-events-none">
                    Advertisement
                </span>
            </div>

        </div>
    );
}
