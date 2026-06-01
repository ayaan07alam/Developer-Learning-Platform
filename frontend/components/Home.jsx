"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight, BookOpen, Code2, Search,
  FileText, ImageIcon, Wrench, Briefcase, Terminal,
  PenLine, ChevronRight, Clock, Calendar,
  ArrowUpRight, ShieldCheck, Zap, Globe,
  BadgeCheck, ChevronLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { API_BASE_URL } from "@/lib/api-client";

// ─── Static data ──────────────────────────────────────────────────────────────

const quotes = [
  { text: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House", role: "Software Architect" },
  { text: "The best way to predict the future is to invent it.", author: "Alan Kay", role: "Computer Scientist" },
  { text: "First, solve the problem. Then, write the code.", author: "John Johnson", role: "Software Developer" },
  { text: "Make it work, make it right, make it fast.", author: "Kent Beck", role: "Creator of TDD" },
  { text: "Any fool can write code that a computer understands. Good programmers write code that humans understand.", author: "Martin Fowler", role: "Software Engineer" },
  { text: "Simplicity is the soul of efficiency.", author: "Austin Freeman", role: "Author" },
];

const pillars = [
  { icon: BookOpen,  title: "Engineering Blog",  description: "In-depth tutorials, technical guides, and insights from practitioners.", href: "/blogs",               cta: "Browse articles" },
  { icon: PenLine,   title: "Write & Publish",   description: "Share your knowledge. Write articles, build your author profile.",  href: "/dashboard/posts/new", cta: "Start writing" },
  { icon: Code2,     title: "Developer Tools",   description: "40+ free utilities — PDF, image, code formatting. No signup.",      href: "/tools",               cta: "Open tools" },
  { icon: Terminal,  title: "Online Compiler",   description: "Run code in 18+ languages directly in your browser.",               href: "/compiler",            cta: "Run code" },
  { icon: Briefcase, title: "Job Board",         description: "Curated tech roles and career roadmaps.",                          href: "/jobs",                cta: "Explore jobs", external: true },
];

const tools = [
  { icon: FileText,  title: "PDF Tools",       description: "Merge, split, compress, convert PDFs", href: "/tools/pdf",       count: "6 tools" },
  { icon: ImageIcon, title: "Image Tools",     description: "Resize, convert, optimize images",     href: "/tools/images",    count: "8 tools" },
  { icon: Code2,     title: "Code Formatter",  description: "Format & lint any language",           href: "/tools/developer", count: "12 tools" },
  { icon: Wrench,    title: "35+ More Tools",  description: "Word, Excel, PPT & utilities",         href: "/tools",           count: "Browse all" },
];

const techTags = [
  "JavaScript", "TypeScript", "React", "Next.js", "Node.js",
  "Python", "Rust", "Go", "SQL", "Docker",
  "Kubernetes", "AWS", "System Design", "DSA", "Web APIs",
  "Git", "CI/CD", "GraphQL", "REST", "CSS",
];

const trustSignals = [
  { icon: BadgeCheck, label: "Community reviewed" },
  { icon: ShieldCheck, label: "100% free, no ads" },
  { icon: Zap,         label: "Updated regularly" },
  { icon: Globe,       label: "Open to contributors" },
];

// ─── Image with fallback ──────────────────────────────────────────────────────
const PostImage = ({ src, title }) => {
  const [error, setError] = useState(false);
  if (error || !src) {
    return (
      <div className="w-full h-full bg-muted flex items-center justify-center">
        <FileText className="w-7 h-7 text-muted-foreground/25" />
      </div>
    );
  }
  return (
    <Image
      src={src} alt={title || "Article"} fill
      sizes="(max-width: 768px) 100vw, 50vw"
      className="object-cover group-hover:scale-[1.025] transition-transform duration-500 ease-out"
      onError={() => setError(true)}
    />
  );
};

// Format date consistently
const formatDate = (dateStr) =>
  dateStr
    ? new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : null;

// ─── FEATURED article card — editorial horizontal layout ──────────────────────
// (Smashing Magazine / LogRocket style: image left, content right)
const FeaturedCard = ({ post }) => {
  if (!post) return null;
  const date = formatDate(post.publishedAt || post.createdAt);
  const authorName = post.createdBy?.displayName || "RuntimeRiver Team";
  const authorInitial = authorName[0].toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <Link href={`/blogs/${post.slug}`} className="group block">
        <article className="flex flex-col md:flex-row bg-card border border-border rounded-xl overflow-hidden hover:border-primary/35 hover:shadow-md transition-all duration-200">

          {/* ── Image — left column on md+, full-width on mobile ── */}
          <div className="relative w-full md:w-[44%] h-52 md:h-auto shrink-0 overflow-hidden bg-muted">
            <PostImage src={post.mainImage} title={post.title} />
          </div>

          {/* ── Content — right column ── */}
          <div className="flex flex-col flex-1 p-6 md:p-8">

            {/* Category label — small-caps text, no background badge */}
            {post.categories?.[0] && (
              <p className="text-[11px] font-semibold text-primary uppercase tracking-[0.11em] mb-3">
                {post.categories[0].name}
              </p>
            )}

            {/* Title — large and prominent */}
            <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-foreground leading-snug mb-3 group-hover:text-primary transition-colors duration-150">
              {post.title}
            </h2>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-5 flex-1">
                {post.excerpt}
              </p>
            )}

            {/* Author + meta — the editorial byline */}
            <div className="flex items-center gap-2.5 text-[12.5px] text-muted-foreground mt-auto pt-4 border-t border-border">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary font-bold text-[10px] shrink-0">
                {authorInitial}
              </span>
              <span className="font-medium text-foreground/80">{authorName}</span>
              {date && (
                <>
                  <span className="text-border">·</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />{date}
                  </span>
                </>
              )}
              <span className="text-border">·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />{post.readTime || 5} min read
              </span>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
};

// ─── SECONDARY article card — compact vertical stack ─────────────────────────
// (Used in the right column of the Start Reading section and in grid sections)
const ArticleCard = ({ post, index = 0, compact = false }) => {
  const date = formatDate(post.publishedAt || post.createdAt);
  const authorName = post.createdBy?.displayName || "RuntimeRiver Team";
  const authorInitial = authorName[0].toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.06, 0.4) }}
    >
      <Link href={`/blogs/${post.slug}`} className="group block h-full">
        <article className={cn(
          "flex h-full bg-card border border-border rounded-xl overflow-hidden hover:border-primary/35 hover:shadow-md transition-all duration-200",
          compact ? "flex-row" : "flex-col"
        )}>

          {/* ── Image ── */}
          <div className={cn(
            "relative overflow-hidden bg-muted shrink-0",
            compact ? "w-28 h-28 sm:w-36 sm:h-full" : "h-44 w-full"
          )}>
            <PostImage src={post.mainImage} title={post.title} />
          </div>

          {/* ── Content ── */}
          <div className={cn("flex flex-col flex-1", compact ? "p-4" : "p-5")}>

            {/* Category */}
            {post.categories?.[0] && (
              <p className="text-[10.5px] font-semibold text-primary uppercase tracking-[0.1em] mb-2">
                {post.categories[0].name}
              </p>
            )}

            {/* Title */}
            <h3 className={cn(
              "font-semibold text-foreground leading-snug group-hover:text-primary transition-colors duration-150",
              compact ? "text-[13.5px] line-clamp-3 mb-2" : "text-[14.5px] line-clamp-2 mb-2.5"
            )}>
              {post.title}
            </h3>

            {/* Excerpt — only in non-compact mode */}
            {!compact && post.excerpt && (
              <p className="text-[12.5px] text-muted-foreground line-clamp-2 leading-relaxed flex-1 mb-3">
                {post.excerpt}
              </p>
            )}

            {/* Meta row */}
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-auto pt-3 border-t border-border">
              <span className="flex items-center justify-center w-4 h-4 rounded-full bg-primary/10 text-primary font-bold text-[9px] shrink-0">
                {authorInitial}
              </span>
              <span className="font-medium text-foreground/70 truncate">{authorName}</span>
              <span className="text-border shrink-0">·</span>
              <span className="shrink-0 flex items-center gap-0.5">
                <Clock className="w-2.5 h-2.5" />{post.readTime || 5}m
              </span>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
};

// ─── Section header ───────────────────────────────────────────────────────────
const SectionHeader = ({ label, title, description, action }) => (
  <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
    <div>
      {label && (
        <p className="text-[10.5px] font-semibold text-primary uppercase tracking-[0.14em] mb-2">{label}</p>
      )}
      <h2 className="text-2xl md:text-[1.7rem] font-bold text-foreground tracking-tight leading-tight">{title}</h2>
      {description && (
        <p className="text-muted-foreground mt-1.5 text-sm max-w-lg leading-relaxed">{description}</p>
      )}
    </div>
    {action && (
      <Link href={action.href} className="text-sm font-medium text-primary hover:text-primary/80 flex items-center gap-1 shrink-0 transition-colors">
        {action.label} <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    )}
  </div>
);

// ─── Loading state ────────────────────────────────────────────────────────────
const SkeletonCard = ({ featured = false }) => (
  <div className={cn(
    "bg-card border border-border rounded-xl overflow-hidden animate-pulse",
    featured ? "flex flex-col md:flex-row" : "flex flex-col"
  )}>
    <div className={cn("bg-muted shrink-0", featured ? "w-full md:w-[44%] h-52 md:h-auto min-h-[200px]" : "h-44 w-full")} />
    <div className="p-6 flex flex-col gap-3 flex-1">
      <div className="h-2.5 bg-muted rounded w-16" />
      <div className="h-5 bg-muted rounded w-full" />
      <div className="h-5 bg-muted rounded w-3/4" />
      <div className="h-3 bg-muted rounded w-1/2 mt-2" />
    </div>
  </div>
);

// ─── Animated counter (scrolls up to target on viewport enter) ────────────────
const Counter = ({ target, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const end = parseInt(target);
        const duration = 1000;
        const step = Math.ceil(end / (duration / 16));
        let cur = 0;
        const timer = setInterval(() => {
          cur = Math.min(cur + step, end);
          setCount(cur);
          if (cur >= end) clearInterval(timer);
        }, 16);
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);

  return <span ref={ref}>{count}{suffix}</span>;
};

// ═══════════════════════════════════════════════════════════════════════════════
const Home = () => {
  const [latestPosts, setLatestPosts] = useState([]);
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [categoryCount, setCategoryCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentQuote, setCurrentQuote] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => { fetchLatestPosts(); fetchCategories(); }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/categories`);
      if (res.ok) setCategoryCount((await res.json()).length);
    } catch {}
  };

  const fetchLatestPosts = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/posts?status=PUBLISHED`);
      if (res.ok) {
        const posts = await res.json();
        const sorted = [...posts].sort((a, b) =>
          new Date(b.publishedAt || b.createdAt) - new Date(a.publishedAt || a.createdAt)
        );
        setLatestPosts(sorted);
        setTrendingPosts(
          sorted.filter(p => p.categories?.some(c => c.name?.toLowerCase() === "trending")).slice(0, 3)
        );
      }
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => {
    const t = setInterval(() => setCurrentQuote(q => (q + 1) % quotes.length), 7000);
    return () => clearInterval(t);
  }, []);

  const featuredPost = latestPosts[0] || null;
  const sidebarPosts = latestPosts.slice(1, 4);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchQuery.trim().toLowerCase();
    if (!q) return;
    if (["pdf", "excel", "image", "word", "ppt"].some(k => q.includes(k))) window.location.href = "/tools";
    else if (q.includes("job")) window.location.href = "/jobs";
    else window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
  };

  return (
    <div className="flex flex-col min-h-screen">

      {/* ═══ HERO ════════════════════════════════════════════════════════════ */}
      <section className="pt-20 pb-14 md:pt-28 md:pb-20 border-b border-border">
        <div className="container mx-auto px-4 md:px-6 max-w-screen-xl">
          <div className="grid lg:grid-cols-[1fr_400px] gap-10 lg:gap-14 items-start">

            {/* Left: headline */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
              {/* Label — no animated pulse dot */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-primary/20 bg-primary/5 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span className="text-[11px] font-semibold text-primary tracking-widest uppercase">
                  Where Knowledge Flows &amp; Code Runs
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-[3.1rem] font-extrabold leading-[1.09] tracking-tight text-foreground mb-5">
                The Developer Platform{" "}
                <span className="text-primary">Built for Learning</span>
              </h1>

              <p className="text-[16px] text-muted-foreground leading-relaxed mb-7 max-w-[510px]">
                Read technical articles, run code in your browser, use 40+ free developer tools —
                all in one continuous flow.
              </p>

              <div className="flex flex-wrap gap-3 mb-8">
                <Button
                  size="lg"
                  className="h-11 px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-md"
                  asChild
                >
                  <Link href="/blogs">Browse Articles</Link>
                </Button>
                <Button
                  size="lg" variant="outline"
                  className="h-11 px-5 font-medium rounded-md border-border text-foreground hover:bg-muted"
                  asChild
                >
                  <Link href="/compiler"><Terminal className="w-4 h-4 mr-2" />Try the Compiler</Link>
                </Button>
              </div>

              {/* Trust signals */}
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                {trustSignals.map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
                    <Icon className="w-3.5 h-3.5 text-primary/70 shrink-0" />
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right: search card */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.12 }}>
              <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
                <p className="text-[13px] font-semibold text-foreground mb-0.5">Quick search</p>
                <p className="text-[12px] text-muted-foreground mb-4">Articles, tools, learning paths</p>
                <form onSubmit={handleSearch} className="flex gap-2 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="React, Python, PDF tools..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-3 py-2.5 text-sm bg-background border border-border rounded-md focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                    />
                  </div>
                  <Button type="submit" size="sm" className="h-10 px-3.5 bg-primary hover:bg-primary/90 rounded-md shrink-0">
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </form>

                <div className="flex flex-wrap gap-1.5 mb-5">
                  <span className="text-[11px] text-muted-foreground mr-0.5">Popular:</span>
                  {["React", "JavaScript", "System Design", "PDF Tools"].map(q => (
                    <Link
                      key={q}
                      href={q === "PDF Tools" ? "/tools/pdf" : `/search?q=${encodeURIComponent(q)}`}
                      className="text-[11px] px-2 py-0.5 rounded border border-border bg-muted hover:border-primary/40 hover:text-primary text-muted-foreground transition-colors"
                    >
                      {q}
                    </Link>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-2.5 pt-4 border-t border-border">
                  {[
                    { value: "40", suffix: "+", label: "Free tools" },
                    { value: String(categoryCount || 4), suffix: "", label: "Categories" },
                    { value: "18", suffix: "+", label: "Languages" },
                  ].map(({ value, suffix, label }) => (
                    <div key={label} className="text-center p-2 rounded-lg bg-secondary">
                      <div className="text-lg font-bold text-foreground">
                        <Counter target={value} suffix={suffix} />
                      </div>
                      <div className="text-[10.5px] text-muted-foreground mt-0.5">{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ START READING — editorial featured layout ════════════════════════ */}
      <section className="py-14 border-b border-border">
        <div className="container mx-auto px-4 md:px-6 max-w-screen-xl">
          <SectionHeader
            label="Latest articles"
            title="Start Reading"
            description="Fresh technical articles from the RuntimeRiver community."
            action={{ href: "/blogs", label: "All articles" }}
          />

          {loading ? (
            /* Loading skeletons */
            <div className="grid lg:grid-cols-[1.5fr_1fr] gap-5">
              <SkeletonCard featured />
              <div className="flex flex-col gap-4">
                <SkeletonCard /><SkeletonCard /><SkeletonCard />
              </div>
            </div>
          ) : latestPosts.length === 0 ? (
            <div className="text-center py-14 text-muted-foreground text-sm">
              No published articles yet. Check back soon.
            </div>
          ) : (
            <div className="grid lg:grid-cols-[1.5fr_1fr] gap-5">
              {/* Featured article — big horizontal card */}
              <FeaturedCard post={featuredPost} />

              {/* Side articles — compact list */}
              <div className="flex flex-col gap-4">
                {sidebarPosts.map((post, i) => (
                  <ArticleCard key={post.id} post={post} index={i} compact />
                ))}
                {sidebarPosts.length === 0 && (
                  <p className="text-sm text-muted-foreground py-4">More articles coming soon.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ═══ WHAT WE COVER ═══════════════════════════════════════════════════ */}
      <section className="py-10 border-b border-border">
        <div className="container mx-auto px-4 md:px-6 max-w-screen-xl">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
            <p className="text-[10.5px] font-semibold text-primary uppercase tracking-[0.14em] shrink-0 sm:w-24">
              We cover
            </p>
            <div className="flex flex-wrap gap-2">
              {techTags.map(tag => (
                <Link
                  key={tag}
                  href={`/search?q=${encodeURIComponent(tag)}`}
                  className="text-[12px] font-medium px-3 py-1 rounded-md border border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all duration-150"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ TRENDING ════════════════════════════════════════════════════════ */}
      {(loading || trendingPosts.length > 0) && (
        <section className="py-14 border-b border-border">
          <div className="container mx-auto px-4 md:px-6 max-w-screen-xl">
            <SectionHeader
              label="Trending this week"
              title="What Developers Are Reading"
              description="The most-read technical articles in the RuntimeRiver community."
              action={{ href: "/blogs", label: "View all" }}
            />
            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[0,1,2].map(i => <SkeletonCard key={i} />)}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {trendingPosts.map((post, i) => <ArticleCard key={post.id} post={post} index={i} />)}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ═══ PLATFORM PILLARS ════════════════════════════════════════════════ */}
      <section className="py-14 border-b border-border">
        <div className="container mx-auto px-4 md:px-6 max-w-screen-xl">
          <SectionHeader
            label="Platform overview"
            title="Everything a Developer Needs"
            description="From reading and writing to building and shipping."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {pillars.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <Link
                  href={p.href}
                  target={p.external ? "_blank" : undefined}
                  rel={p.external ? "noopener noreferrer" : undefined}
                  className="group flex flex-col h-full bg-card border border-border rounded-xl p-5 hover:border-primary/35 hover:shadow-sm transition-all duration-200"
                >
                  <div className="w-8 h-8 rounded-md bg-primary/8 flex items-center justify-center mb-4 group-hover:bg-primary/14 transition-colors">
                    <p.icon className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="text-[13.5px] font-semibold text-foreground mb-1.5 group-hover:text-primary transition-colors leading-snug">
                    {p.title}
                  </h3>
                  <p className="text-[12.5px] text-muted-foreground leading-relaxed flex-1 mb-4">
                    {p.description}
                  </p>
                  <span className="text-[12.5px] font-medium text-primary flex items-center gap-1">
                    {p.cta}
                    {p.external ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ POPULAR TOOLS ═══════════════════════════════════════════════════ */}
      <section className="py-14 border-b border-border">
        <div className="container mx-auto px-4 md:px-6 max-w-screen-xl">
          <SectionHeader
            label="Developer utilities"
            title="Popular Free Tools"
            description="File and code utilities — no account or signup required."
            action={{ href: "/tools", label: "View all 40+ tools" }}
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {tools.map((t, i) => (
              <motion.div
                key={t.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.06 }}
              >
                <Link
                  href={t.href}
                  className="group flex flex-col p-5 rounded-xl border border-border bg-card hover:border-primary/35 hover:shadow-sm transition-all duration-200 h-full"
                >
                  <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center mb-3 group-hover:bg-primary/10 transition-colors">
                    <t.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground mb-1">{t.title}</h3>
                  <p className="text-[12px] text-muted-foreground leading-relaxed flex-1 mb-2">{t.description}</p>
                  <span className="text-[11px] font-medium text-primary/80">{t.count}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ LATEST ARTICLES ══════════════════════════════════════════════════ */}
      <section className="py-14 border-b border-border">
        <div className="container mx-auto px-4 md:px-6 max-w-screen-xl">
          <SectionHeader
            label="Fresh content"
            title="Latest Articles"
            description="New tutorials and write-ups added by community contributors."
            action={{ href: "/blogs", label: "See all articles" }}
          />
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[0,1,2,3,4,5].map(i => <SkeletonCard key={i} />)}
            </div>
          ) : latestPosts.length === 0 ? (
            <p className="text-center py-14 text-sm text-muted-foreground">No published articles yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {latestPosts.slice(0, 6).map((post, i) => <ArticleCard key={post.id} post={post} index={i} />)}
            </div>
          )}
        </div>
      </section>

      {/* ═══ DEVELOPER QUOTE ══════════════════════════════════════════════════ */}
      <section className="py-14 border-b border-border">
        <div className="container mx-auto px-4 md:px-6 max-w-screen-xl">
          <div className="max-w-2xl mx-auto">
            <div className="bg-card border border-border rounded-xl p-8 md:p-10 relative overflow-hidden">
              {/* Teal left accent — editorial feel */}
              <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary rounded-l-xl" />

              <motion.div
                key={currentQuote}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="min-h-[88px]"
              >
                <blockquote className="text-base md:text-[17px] font-medium text-foreground leading-relaxed mb-5 italic">
                  &ldquo;{quotes[currentQuote].text}&rdquo;
                </blockquote>
                <div>
                  <p className="text-sm font-semibold text-foreground">{quotes[currentQuote].author}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{quotes[currentQuote].role}</p>
                </div>
              </motion.div>

              {/* Progress dots */}
              <div className="flex items-center gap-1.5 mt-6 pt-5 border-t border-border">
                {quotes.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentQuote(i)}
                    className={cn("h-1 rounded-full transition-all duration-250", i === currentQuote ? "w-6 bg-primary" : "w-1.5 bg-border hover:bg-muted-foreground/30")}
                    aria-label={`Quote ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ COMMUNITY ARTICLES ═══════════════════════════════════════════════ */}
      <section className="py-14 border-b border-border">
        <div className="container mx-auto px-4 md:px-6 max-w-screen-xl">
          <SectionHeader
            label="Community"
            title="Written by Developers, for Developers"
            description="Fresh perspectives from contributors around the world."
            action={{ href: "/blogs", label: "Read all" }}
          />
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[0,1,2].map(i => <SkeletonCard key={i} />)}
            </div>
          ) : latestPosts.length === 0 ? (
            <p className="text-center py-14 text-sm text-muted-foreground">No articles yet. Be the first to write.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {latestPosts.slice(0, 3).map((post, i) => <ArticleCard key={post.id} post={post} index={i} />)}
            </div>
          )}
        </div>
      </section>

      {/* ═══ CTA — Two-column editorial format ════════════════════════════════ */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-6 max-w-screen-xl">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Read CTA */}
            <div className="bg-primary rounded-xl p-8 md:p-10">
              <BookOpen className="w-6 h-6 text-primary-foreground/50 mb-4" />
              <h2 className="text-xl md:text-2xl font-bold text-primary-foreground mb-2 tracking-tight">
                Start reading today
              </h2>
              <p className="text-primary-foreground/75 text-sm mb-6 leading-relaxed">
                Hundreds of articles on JavaScript, Python, React, System Design, and more.
              </p>
              <Button className="h-10 px-5 bg-white text-primary hover:bg-white/90 font-semibold rounded-md text-sm" asChild>
                <Link href="/blogs">Browse articles <ArrowRight className="w-3.5 h-3.5 ml-1.5" /></Link>
              </Button>
            </div>
            {/* Write CTA */}
            <div className="bg-card border border-border rounded-xl p-8 md:p-10">
              <PenLine className="w-6 h-6 text-primary/40 mb-4" />
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2 tracking-tight">
                Share your knowledge
              </h2>
              <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                Write technical articles, build your author profile, and reach thousands of developers.
              </p>
              <Button variant="outline" className="h-10 px-5 rounded-md border-primary/30 text-primary hover:bg-primary/5 font-semibold text-sm" asChild>
                <Link href="/register">Create free account <ArrowRight className="w-3.5 h-3.5 ml-1.5" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
