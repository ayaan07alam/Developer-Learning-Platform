"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight, BookOpen, Code2, Users, Search,
  FileText, ImageIcon, Wrench, Briefcase, Terminal,
  PenLine, ChevronRight, Clock, Calendar, Quote,
  ArrowUpRight, ShieldCheck, Zap, Infinity, Eye,
  BadgeCheck, Layers, Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { API_BASE_URL } from "@/lib/api-client";

// ─── Static data ─────────────────────────────────────────────────────────────

const quotes = [
  { text: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House", role: "Software Architect" },
  { text: "The best way to predict the future is to invent it.", author: "Alan Kay", role: "Computer Scientist" },
  { text: "First, solve the problem. Then, write the code.", author: "John Johnson", role: "Software Developer" },
  { text: "Make it work, make it right, make it fast.", author: "Kent Beck", role: "Creator of TDD" },
  { text: "Any fool can write code a computer understands. Good programmers write code humans understand.", author: "Martin Fowler", role: "Software Engineer" },
  { text: "Simplicity is the soul of efficiency.", author: "Austin Freeman", role: "Author" },
];

const pillars = [
  { icon: BookOpen,  title: "Engineering Blog",  description: "In-depth tutorials, technical guides, and insights from practitioners.", href: "/blogs", cta: "Browse articles" },
  { icon: PenLine,   title: "Write & Publish",   description: "Share your knowledge. Write articles, build your author profile.", href: "/dashboard/posts/new", cta: "Start writing" },
  { icon: Code2,     title: "Developer Tools",   description: "40+ free utilities — PDF, image, code formatting. No signup needed.", href: "/tools", cta: "Open tools" },
  { icon: Terminal,  title: "Online Compiler",   description: "Run code in 18+ languages directly in your browser.", href: "/compiler", cta: "Run code" },
  { icon: Briefcase, title: "Job Board",         description: "Curated tech roles and career roadmaps.", href: "/jobs", cta: "Explore jobs", external: true },
];

const tools = [
  { icon: FileText,  title: "PDF Tools",        description: "Merge, split, compress, convert PDFs", href: "/tools/pdf",       count: "6 tools" },
  { icon: ImageIcon, title: "Image Tools",      description: "Resize, convert, optimize images",    href: "/tools/images",    count: "8 tools" },
  { icon: Code2,     title: "Code Formatter",   description: "Format & lint any language",          href: "/tools/developer", count: "12 tools" },
  { icon: Wrench,    title: "35+ More Tools",   description: "Word, Excel, PPT & more utilities",   href: "/tools",           count: "Browse all" },
];

// Technologies we cover — the "What we cover" trust section
const techTags = [
  "JavaScript", "TypeScript", "React", "Next.js", "Node.js",
  "Python", "Rust", "Go", "SQL", "Docker",
  "Kubernetes", "AWS", "System Design", "DSA", "Web APIs",
  "Git", "CI/CD", "GraphQL", "REST", "CSS",
];

// Trust signals — below hero
const trustSignals = [
  { icon: BadgeCheck, label: "Community reviewed" },
  { icon: ShieldCheck, label: "100% free, no ads" },
  { icon: Zap, label: "Updated regularly" },
  { icon: Globe, label: "Open to contributors" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

const PostImage = ({ src, title }) => {
  const [error, setError] = useState(false);
  if (error || !src) {
    return (
      <div className="w-full h-full bg-muted flex items-center justify-center">
        <FileText className="w-7 h-7 text-muted-foreground/30" />
      </div>
    );
  }
  return (
    <Image
      src={src} alt={title || "Article"} fill
      sizes="(max-width: 768px) 100vw, 50vw"
      className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
      onError={() => setError(true)}
    />
  );
};

// Editorial article card — date, category, author-initial badge
const BlogCard = ({ post, index = 0, featured = false }) => {
  const date = post.publishedAt || post.createdAt
    ? new Date(post.publishedAt || post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : null;

  const authorInitial = (post.createdBy?.displayName || post.createdBy?.email || "A")[0].toUpperCase();

  if (featured) {
    return (
      <Link href={`/blogs/${post.slug}`} className="group block h-full">
        <div className="h-full bg-card border border-border rounded-xl overflow-hidden hover:border-primary/40 hover:shadow-lg transition-all duration-250">
          <div className="relative h-64 md:h-full min-h-[220px] bg-muted overflow-hidden">
            <PostImage src={post.mainImage} title={post.title} />
            {post.categories?.[0] && (
              <span className="absolute top-3 left-3 px-2.5 py-1 text-[11px] font-semibold rounded-md bg-primary text-primary-foreground">
                {post.categories[0].name}
              </span>
            )}
          </div>
          <div className="p-6">
            <h2 className="text-xl md:text-2xl font-bold text-foreground leading-snug mb-3 group-hover:text-primary transition-colors">
              {post.title}
            </h2>
            {post.excerpt && (
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-4">{post.excerpt}</p>
            )}
            <div className="flex items-center gap-3 text-[12px] text-muted-foreground">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary font-semibold text-[10px]">
                {authorInitial}
              </span>
              <span>{post.createdBy?.displayName || "RuntimeRiver"}</span>
              {date && <><span className="text-border">·</span><span>{date}</span></>}
              <span className="text-border">·</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime || 5} min</span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.38, delay: index * 0.06 }}
    >
      <Link href={`/blogs/${post.slug}`} className="group flex flex-col h-full bg-card border border-border rounded-xl overflow-hidden hover:border-primary/40 hover:shadow-md transition-all duration-200">
        <div className="relative h-44 overflow-hidden bg-muted shrink-0">
          <PostImage src={post.mainImage} title={post.title} />
          {post.categories?.[0] && (
            <span className="absolute top-3 left-3 px-2.5 py-0.5 text-[11px] font-semibold rounded-md bg-background/90 text-foreground border border-border">
              {post.categories[0].name}
            </span>
          )}
        </div>
        <div className="flex flex-col flex-1 p-5">
          <h3 className="text-[14.5px] font-semibold leading-snug text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-2">
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="text-[12.5px] text-muted-foreground line-clamp-2 mb-3 leading-relaxed flex-1">{post.excerpt}</p>
          )}
          <div className="flex items-center justify-between text-[11.5px] text-muted-foreground mt-auto pt-3 border-t border-border">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-4.5 h-4.5 rounded-full bg-primary/10 text-primary font-semibold text-[9px] w-5 h-5">
                {authorInitial}
              </span>
              <span>{post.createdBy?.displayName || "RuntimeRiver"}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground/70">
              {date && <span>{date}</span>}
              <span className="flex items-center gap-0.5"><Clock className="w-2.5 h-2.5" />{post.readTime || 5}m</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const SectionHeader = ({ label, title, description, action }) => (
  <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
    <div>
      {label && <p className="text-[11px] font-semibold text-primary uppercase tracking-[0.12em] mb-2">{label}</p>}
      <h2 className="text-2xl md:text-[1.75rem] font-bold text-foreground tracking-tight leading-tight">{title}</h2>
      {description && <p className="text-muted-foreground mt-1.5 text-sm max-w-lg leading-relaxed">{description}</p>}
    </div>
    {action && (
      <Link href={action.href} className="text-sm font-medium text-primary hover:text-primary/80 flex items-center gap-1 shrink-0 transition-colors">
        {action.label} <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    )}
  </div>
);

const Spinner = () => (
  <div className="py-14 text-center">
    <div className="inline-block w-7 h-7 border-2 border-border border-t-primary rounded-full animate-spin" />
    <p className="text-muted-foreground text-sm mt-3">Loading articles...</p>
  </div>
);

// ─── Animated counter ─────────────────────────────────────────────────────────
const Counter = ({ target, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const end = parseInt(target);
        const duration = 1200;
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
  const [totalPosts, setTotalPosts] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentQuote, setCurrentQuote] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchLatestPosts();
    fetchCategories();
  }, []);

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
        setTotalPosts(sorted.length);
        setTrendingPosts(
          sorted.filter(p => p.categories?.some(c => c.name?.toLowerCase() === "trending")).slice(0, 6)
        );
      }
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => {
    const t = setInterval(() => setCurrentQuote(q => (q + 1) % quotes.length), 6000);
    return () => clearInterval(t);
  }, []);

  const featuredPost = latestPosts[0];
  const recentPosts = latestPosts.slice(1, 4);

  return (
    <div className="flex flex-col min-h-screen">

      {/* ═══ HERO ═══════════════════════════════════════════════════════════ */}
      <section className="pt-20 pb-14 md:pt-28 md:pb-20 border-b border-border">
        <div className="container mx-auto px-4 md:px-6 max-w-screen-xl">
          <div className="grid lg:grid-cols-[1fr_420px] gap-10 lg:gap-14 items-start">

            {/* ── Left copy ── */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-primary/20 bg-primary/5 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-[11px] font-semibold text-primary tracking-wide uppercase">
                  Where Knowledge Flows &amp; Code Runs
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold leading-[1.08] tracking-tight text-foreground mb-5">
                The Developer Platform{" "}
                <span className="text-primary">Built for Learning</span>
              </h1>

              <p className="text-[16.5px] text-muted-foreground leading-relaxed mb-7 max-w-[520px]">
                Read technical articles, run code in your browser, use 40+ free developer
                tools — and build your knowledge in one continuous flow.
              </p>

              <div className="flex flex-wrap gap-3 mb-8">
                <Button
                  size="lg"
                  className="h-11 px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-md shadow-sm"
                  asChild
                >
                  <Link href="/blogs">Browse Articles</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-11 px-5 font-medium rounded-md border-border text-foreground hover:bg-muted"
                  asChild
                >
                  <Link href="/compiler">
                    <Terminal className="w-4 h-4 mr-2" />
                    Try the Compiler
                  </Link>
                </Button>
              </div>

              {/* Trust signals — the X-factor */}
              <div className="flex flex-wrap gap-x-5 gap-y-2.5">
                {trustSignals.map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
                    <Icon className="w-3.5 h-3.5 text-primary/70 shrink-0" />
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* ── Right: search + stats ── */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.12 }}
            >
              <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
                <p className="text-[13px] font-semibold text-foreground mb-1">Quick search</p>
                <p className="text-[12px] text-muted-foreground mb-4">Articles, tools, learning paths</p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const q = searchQuery.trim().toLowerCase();
                    if (!q) return;
                    if (q.includes("pdf") || q.includes("excel") || q.includes("image") || q.includes("word")) {
                      window.location.href = "/tools";
                    } else if (q.includes("job")) {
                      window.location.href = "/jobs";
                    } else {
                      window.location.href = `/search?q=${encodeURIComponent(q)}`;
                    }
                  }}
                  className="flex gap-2 mb-4"
                >
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="React, Python, system design..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-3 py-2.5 text-sm bg-background border border-border rounded-md focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                    />
                  </div>
                  <Button type="submit" size="sm" className="h-10 px-3 bg-primary hover:bg-primary/90 rounded-md shrink-0">
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </form>

                <div className="flex flex-wrap gap-1.5 mb-5">
                  <span className="text-[11px] text-muted-foreground">Popular:</span>
                  {["React", "JavaScript", "System Design", "PDF Tools"].map(q => (
                    <Link
                      key={q}
                      href={q === "PDF Tools" ? "/tools/pdf" : `/search?q=${encodeURIComponent(q)}`}
                      className="text-[11px] px-2 py-0.5 rounded border border-border bg-muted hover:border-primary/40 hover:bg-primary/5 hover:text-primary text-muted-foreground transition-colors"
                    >
                      {q}
                    </Link>
                  ))}
                </div>

                {/* Stat counters */}
                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border">
                  {[
                    { value: "40", suffix: "+", label: "Free tools" },
                    { value: categoryCount > 0 ? String(categoryCount) : "4", suffix: "", label: "Categories" },
                    { value: "18", suffix: "+", label: "Languages" },
                  ].map(({ value, suffix, label }) => (
                    <div key={label} className="text-center p-2.5 rounded-lg bg-muted/50">
                      <div className="text-lg font-bold text-foreground">
                        <Counter target={value} suffix={suffix} />
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ FEATURED + RECENT — the X-factor editorial layout ══════════════ */}
      {!loading && latestPosts.length > 0 && (
        <section className="py-14 border-b border-border">
          <div className="container mx-auto px-4 md:px-6 max-w-screen-xl">
            <SectionHeader
              label="Editor's pick"
              title="Start Reading"
              description="The latest technical articles from our community."
              action={{ href: "/blogs", label: "All articles" }}
            />
            <div className="grid lg:grid-cols-[1.4fr_1fr] gap-5">
              {/* Featured card — big */}
              {featuredPost && (
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                  className="lg:row-span-2"
                >
                  <BlogCard post={featuredPost} featured index={0} />
                </motion.div>
              )}
              {/* Recent stack — 2 smaller cards */}
              <div className="flex flex-col gap-5">
                {recentPosts.map((post, i) => (
                  <BlogCard key={post.id} post={post} index={i + 1} />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══ WHAT WE COVER — the X-factor trust section ═════════════════════ */}
      <section className="py-12 border-b border-border bg-muted/20">
        <div className="container mx-auto px-4 md:px-6 max-w-screen-xl">
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-10">
            <p className="text-[11px] font-semibold text-primary uppercase tracking-[0.12em] shrink-0 md:w-28">
              What we cover
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

      {/* ═══ TRENDING ═══════════════════════════════════════════════════════ */}
      {(loading || trendingPosts.length > 0) && (
        <section className="py-14 border-b border-border">
          <div className="container mx-auto px-4 md:px-6 max-w-screen-xl">
            <SectionHeader
              label="Trending this week"
              title="What Developers Are Reading"
              description="The most-read technical articles in the RuntimeRiver community."
              action={{ href: "/blogs", label: "View all" }}
            />
            {loading ? <Spinner /> : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {trendingPosts.map((post, i) => <BlogCard key={post.id} post={post} index={i} />)}
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
            description="From reading and writing to building and shipping — RuntimeRiver covers the full flow."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {pillars.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.06 }}
              >
                <Link
                  href={p.href}
                  target={p.external ? "_blank" : undefined}
                  rel={p.external ? "noopener noreferrer" : undefined}
                  className="group flex flex-col h-full bg-card border border-border rounded-xl p-5 hover:border-primary/40 hover:shadow-sm transition-all duration-200"
                >
                  <div className="w-8 h-8 rounded-md bg-primary/8 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
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

      {/* ═══ POPULAR TOOLS ════════════════════════════════════════════════════ */}
      <section className="py-14 border-b border-border bg-muted/20">
        <div className="container mx-auto px-4 md:px-6 max-w-screen-xl">
          <SectionHeader
            label="Developer utilities"
            title="Popular Free Tools"
            description="Powerful file and code utilities — no account or signup required."
            action={{ href: "/tools", label: "View all 40+ tools" }}
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {tools.map((t, i) => (
              <motion.div
                key={t.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.32, delay: i * 0.06 }}
              >
                <Link
                  href={t.href}
                  className="group flex flex-col p-5 rounded-xl border border-border bg-card hover:border-primary/40 hover:shadow-sm transition-all duration-200 h-full"
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

      {/* ═══ LATEST ARTICLES ═════════════════════════════════════════════════ */}
      <section className="py-14 border-b border-border">
        <div className="container mx-auto px-4 md:px-6 max-w-screen-xl">
          <SectionHeader
            label="Fresh content"
            title="Latest Articles"
            description="New tutorials, guides, and technical write-ups — added by community contributors."
            action={{ href: "/blogs", label: "See all articles" }}
          />
          {loading ? <Spinner /> : latestPosts.length === 0 ? (
            <div className="text-center py-14">
              <p className="text-muted-foreground text-sm">No published articles yet. Check back soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {latestPosts.slice(0, 6).map((post, i) => <BlogCard key={post.id} post={post} index={i} />)}
            </div>
          )}
        </div>
      </section>

      {/* ═══ DEVELOPER QUOTES ═════════════════════════════════════════════════ */}
      <section className="py-14 border-b border-border bg-muted/20">
        <div className="container mx-auto px-4 md:px-6 max-w-screen-xl">
          <div className="max-w-2xl mx-auto">
            <div className="bg-card border border-border rounded-xl p-8 md:p-10 relative overflow-hidden">
              {/* Indigo left-border accent — editorial feel */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-xl" />
              <Quote className="w-7 h-7 text-primary/20 mb-5" />
              <motion.div
                key={currentQuote}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="min-h-[90px]"
              >
                <blockquote className="text-base md:text-[17px] font-medium text-foreground leading-relaxed mb-5">
                  &ldquo;{quotes[currentQuote].text}&rdquo;
                </blockquote>
                <div>
                  <p className="text-sm font-semibold text-foreground">{quotes[currentQuote].author}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{quotes[currentQuote].role}</p>
                </div>
              </motion.div>
              <div className="flex items-center gap-2 mt-6 pt-5 border-t border-border">
                {quotes.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentQuote(i)}
                    className={cn("h-1 rounded-full transition-all duration-200", i === currentQuote ? "w-6 bg-primary" : "w-1 bg-border hover:bg-muted-foreground/30")}
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
            description="Fresh perspectives and tutorials from contributors around the world."
            action={{ href: "/blogs", label: "Read all" }}
          />
          {loading ? <Spinner /> : latestPosts.length === 0 ? (
            <div className="text-center py-14">
              <p className="text-muted-foreground text-sm">No articles yet. Be the first to write.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {latestPosts.slice(0, 3).map((post, i) => <BlogCard key={post.id} post={post} index={i} />)}
            </div>
          )}
        </div>
      </section>

      {/* ═══ CTA ══════════════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-6 max-w-screen-xl">
          {/* Two-column editorial CTA — different from competitors' generic full-width banners */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Read CTA */}
            <div className="bg-primary rounded-xl p-8 md:p-10">
              <BookOpen className="w-7 h-7 text-primary-foreground/60 mb-4" />
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
              <PenLine className="w-7 h-7 text-primary/50 mb-4" />
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
