"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { API_BASE_URL } from "@/lib/api-client";
import { Search, FileText, Clock, Calendar, ChevronRight, SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";

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
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      className="object-cover group-hover:scale-[1.025] transition-transform duration-500 ease-out"
      onError={() => setError(true)}
    />
  );
};

// ─── Article card — consistent with Home.jsx ArticleCard ─────────────────────
const ArticleCard = ({ post, index = 0 }) => {
  const date = post.publishedAt || post.createdAt
    ? new Date(post.publishedAt || post.createdAt).toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric"
      })
    : null;
  const authorName = post.createdBy?.displayName || "RuntimeRiver Team";
  const authorInitial = authorName[0].toUpperCase();

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.45) }}
    >
      <Link href={`/blogs/${post.slug}`} className="group block h-full">
        <div className="flex flex-col h-full bg-card border border-border rounded-xl overflow-hidden hover:border-primary/35 hover:shadow-md transition-all duration-200">

          {/* Image */}
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted shrink-0 border-b border-border/50">
            <PostImage src={post.mainImage} title={post.title} />
          </div>

          {/* Content */}
          <div className="flex flex-col flex-1 p-5">

            {/* Category */}
            {post.categories?.[0] && (
              <p className="text-xs font-bold text-primary uppercase tracking-widest mb-3">
                {post.categories[0].name}
              </p>
            )}

            {/* Tags */}
            {post.tags?.length > 0 && !post.categories?.[0] && (
              <div className="flex flex-wrap gap-2 mb-3">
                {post.tags.slice(0, 3).map((tag, i) => (
                  <span key={i} className="text-xs font-medium text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-md border border-border/50">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Title */}
            <h2 className="text-lg md:text-xl font-bold text-foreground leading-tight line-clamp-2 mb-3 group-hover:text-primary transition-colors duration-200">
              {post.title}
            </h2>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed flex-1 mb-6">
                {post.excerpt}
              </p>
            )}

            {/* Author + meta */}
            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-auto pt-4 border-t border-border/60">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary font-bold text-xs shrink-0">
                {authorInitial}
              </span>
              <span className="font-semibold text-foreground/80 truncate">{authorName}</span>
              {date && (
                <>
                  <span className="text-muted-foreground/30 shrink-0">•</span>
                  <span className="shrink-0 font-medium">{date}</span>
                </>
              )}
              <span className="text-muted-foreground/30 shrink-0">•</span>
              <span className="shrink-0 flex items-center gap-1 font-medium">
                <Clock className="w-3 h-3" />{post.readTime || 5}m
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
};

// ─── Skeleton card ────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="flex flex-col bg-card border border-border rounded-xl overflow-hidden animate-pulse">
    <div className="h-44 bg-muted" />
    <div className="p-5 flex flex-col gap-3">
      <div className="h-2.5 bg-muted rounded w-16" />
      <div className="h-4 bg-muted rounded w-full" />
      <div className="h-4 bg-muted rounded w-3/4" />
      <div className="h-3 bg-muted rounded w-1/2 mt-2" />
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState(["All"]);

  useEffect(() => { fetchBlogs(); }, []);

  const fetchBlogs = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/posts?status=PUBLISHED`);
      if (!res.ok) throw new Error("Failed to load articles");
      const data = await res.json();
      const sorted = [...data].sort((a, b) =>
        new Date(b.publishedAt || b.createdAt) - new Date(a.publishedAt || a.createdAt)
      );
      setBlogs(sorted);
      const cats = new Set();
      sorted.forEach(b => b.categories?.forEach(c => c.name && cats.add(c.name)));
      setCategories(["All", ...Array.from(cats)]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filtered = blogs.filter(blog => {
    const matchesSearch = !searchQuery ||
      [blog.title, blog.excerpt, ...(blog.tags || [])].some(f => f?.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCat = selectedCategory === "All" ||
      blog.categories?.some(c => c.name === selectedCategory);
    return matchesSearch && matchesCat;
  });

  return (
    <div className="min-h-screen bg-background">

      {/* ─── Page header ─────────────────────────────────────────────── */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 md:px-6 max-w-screen-xl pt-24 pb-10 md:pt-28 md:pb-12">
          <p className="text-[10.5px] font-semibold text-primary uppercase tracking-[0.14em] mb-3">
            Engineering Blog
          </p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight mb-3">
            Articles &amp; Tutorials
          </h1>
          <p className="text-muted-foreground text-[15.5px] max-w-xl">
            In-depth guides, tutorials, and technical insights from the RuntimeRiver community.
          </p>
        </div>
      </div>

      {/* ─── Sticky filter bar ───────────────────────────────────────── */}
      <div className="sticky top-14 md:top-16 z-30 bg-background border-b border-border">
        <div className="container mx-auto px-4 md:px-6 max-w-screen-xl py-3 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-sm rounded-md bg-muted border border-border focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category filters */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-0.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "text-xs font-medium px-3 py-1.5 rounded-md whitespace-nowrap transition-colors shrink-0",
                  selectedCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground border border-border"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Article grid ────────────────────────────────────────────── */}
      <div className="container mx-auto px-4 md:px-6 max-w-screen-xl py-10">

        {/* Error */}
        {error && (
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-4">{error}</p>
            <button onClick={fetchBlogs} className="px-5 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
              Try again
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-20">
            <FileText className="w-10 h-10 text-muted-foreground/30 mx-auto mb-4" />
            <p className="font-medium text-foreground mb-1">No articles found</p>
            <p className="text-sm text-muted-foreground mb-4">
              {searchQuery || selectedCategory !== "All"
                ? "Try adjusting your search or filter."
                : "No published articles yet. Check back soon."}
            </p>
            {(searchQuery || selectedCategory !== "All") && (
              <button onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }} className="text-sm text-primary hover:underline">
                Clear filters
              </button>
            )}
          </div>
        )}

        {/* Articles */}
        {!loading && !error && filtered.length > 0 && (
          <>
            <p className="text-sm text-muted-foreground mb-6">
              <span className="font-medium text-foreground">{filtered.length}</span>{" "}
              article{filtered.length !== 1 ? "s" : ""}
              {selectedCategory !== "All" ? ` in "${selectedCategory}"` : ""}
              {searchQuery ? ` for "${searchQuery}"` : ""}
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((blog, i) => (
                <ArticleCard key={blog.id} blog={blog} post={blog} index={i} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Blogs;