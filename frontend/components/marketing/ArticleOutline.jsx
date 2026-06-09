"use client";
import { useEffect, useState } from "react";
import { List } from "lucide-react";

export default function ArticleOutline({ containerSelector = ".article-content" }) {
    const [headings, setHeadings] = useState([]);
    const [activeId, setActiveId] = useState("");

    useEffect(() => {
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
        if (!items.length) return;

        const handleScroll = () => {
            const offset = 120;
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
        return () => window.removeEventListener("scroll", handleScroll);
    }, [containerSelector]);

    if (headings.length < 2) return null;

    const scrollTo = (id, e) => {
        e.preventDefault();
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
        <nav className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto">
            <div className="rounded-xl border border-border bg-card/80 backdrop-blur-sm p-4">
                <div className="flex items-center gap-2 mb-3 pb-3 border-b border-border">
                    <List className="w-4 h-4 text-primary" />
                    <span className="text-xs font-semibold uppercase tracking-widest text-foreground">
                        On this page
                    </span>
                </div>
                <ul className="space-y-0.5">
                    {headings.map((heading) => (
                        <li key={heading.id}>
                            <a
                                href={`#${heading.id}`}
                                onClick={(e) => scrollTo(heading.id, e)}
                                className={`block py-1.5 text-[13px] leading-snug transition-colors rounded-md no-underline ${
                                    heading.level === 3 ? "pl-4" : "pl-1"
                                } ${
                                    activeId === heading.id
                                        ? "text-primary font-medium"
                                        : "text-muted-foreground hover:text-foreground"
                                }`}
                            >
                                {heading.text}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
}
