"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { API_BASE_URL } from "@/lib/api-client";
import {
  Search, FileText, Clock, Calendar, ChevronRight, SlidersHorizontal, X
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Robust image with fallback ───────────────────────────────────────────────
const PostImage = ({ src, title }) => {
  const [error, setError] = useState(false);
  if (error || !src) {
    return (
      <div className="w-full h-full bg-muted flex items-center justify-center">
        <FileText className="w-8 h-8 text-muted-foreground/30" />
      </div>
    );
  }
  return (
    <Image
      src={src}
      alt={title || "Article cover"}
      fill
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
      onError={() => setError(true)}
    />
  );
};

// ─── Blog card ────────────────────────────────────────────────────────────────
const BlogCard = ({ blog, index }) => {
  const formattedDate = blog.publishedAt || blog.createdAt
    ? new Date(blog.publishedAt || blog.createdAt).toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric"
      })
    : null;

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.06, 0.5) }}
    >
      <Link href={`/blogs/${blog.slug}`}>
        <div className="group flex flex-col h-full bg-card border border-border rounded-xl overflow-hidden hover:border-primary/40 hover:shadow-md transition-all duration-200">

          {/* Cover image */}
          <div className="relative h-48 overflow-hidden bg-muted shrink-0">
            <PostImage src={blog.mainImage} title={blog.title} />
            {blog.categories?.[0] && (
              <span className="absolute top-3 left-3 px-2.5 py-0.5 text-[11px] font-semibold rounded-md bg-background/90 text-foreground border border-border">
                {blog.categories[0].name}
              </span>
            )}
          </div>

          {/* Body */}
          <div className="flex flex-col flex-1 p-5">
            {/* Tags */}
            {blog.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {blog.tags.slice(0, 3).map((tag, i) => (
                  <span
                    key={i}
                    className="text-[11px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Title */}
            <h2 className="text-[15px] font-semibold text-foreground leading-snug line-clamp-2 mb-2.5 group-hover:text-primary transition-colors">
              {blog.title}
            </h2>

            {/* Excerpt */}
            {blog.excerpt && (
              <p className="text-[13px] text-muted-foreground line-clamp-3 leading-relaxed flex-1 mb-4">
                {blog.excerpt}
              </p>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between text-[12px] text-muted-foreground pt-3 border-t border-border mt-auto">
              <div className="flex items-center gap-3">
                {formattedDate && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formattedDate}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {blog.readTime || 5} min
                </span>
              </div>
              <span className="text-primary font-medium flex items-center">
                Read <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
};

// ─── Loading skeleton ─────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="flex flex-col h-full bg-card border border-border rounded-xl overflow-hidden animate-pulse">
    <div className="h-48 bg-muted" />
    <div className="p-5 flex flex-col gap-3">
      <div className="h-3 bg-muted rounded w-1/3" />
      <div className="h-4 bg-muted rounded w-full" />
      <div className="h-4 bg-muted rounded w-3/4" />
      <div className="h-3 bg-muted rounded w-2/3 mt-2" />
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

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/posts?status=PUBLISHED`);
      if (!res.ok) throw new Error("Failed to load articles");
      const data = await res.json();

      const sorted = [...data].sort((a, b) =>
        new Date(b.publishedAt || b.createdAt) - new Date(a.publishedAt || a.createdAt)
      );
      setBlogs(sorted);

      // Extract unique categories
      const cats = new Set();
      sorted.forEach(blog =>
        blog.categories?.forEach(c => c.name && cats.add(c.name))
      );
      setCategories(["All", ...Array.from(cats)]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filtered list
  const filtered = blogs.filter(blog => {
    const matchesSearch = !searchQuery || [blog.title, blog.excerpt, ...(blog.tags || [])].some(
      f => f?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const matchesCat = selectedCategory === "All" ||
      blog.categories?.some(c => c.name === selectedCategory);
    return matchesSearch && matchesCat;
  });

  return (
    <div className="min-h-screen bg-background">

      {/* ─── Page header ────────────────────────────────────────────────────── */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 md:px-6 max-w-screen-xl pt-24 pb-10 md:pt-28 md:pb-12">
          <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
            Engineering Blog
          </p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight mb-3">
            Articles &amp; Tutorials
          </h1>
          <p className="text-muted-foreground text-[16px] max-w-xl">
            In-depth guides, tutorials, and technical insights from the RuntimeRiver community.
          </p>
        </div>
      </div>

      {/* ─── Filters bar ────────────────────────────────────────────────────── */}
      <div className="sticky top-14 md:top-16 z-30 bg-background/95 backdrop-blur-sm border-b border-border">
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
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <SlidersHorizontal className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "text-xs font-medium px-3 py-1.5 rounded-md whitespace-nowrap transition-colors shrink-0",
                  selectedCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground border border-border"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Article grid ────────────────────────────────────────────────────── */}
      <div className="container mx-auto px-4 md:px-6 max-w-screen-xl py-10">

        {/* Error */}
        {error && (
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-4">{error}</p>
            <button
              onClick={fetchBlogs}
              className="px-5 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Try again
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-20">
            <FileText className="w-10 h-10 text-muted-foreground/40 mx-auto mb-4" />
            <p className="font-medium text-foreground mb-1">No articles found</p>
            <p className="text-sm text-muted-foreground">
              {searchQuery || selectedCategory !== "All"
                ? "Try adjusting your search or filter."
                : "No published articles yet. Check back soon."}
            </p>
            {(searchQuery || selectedCategory !== "All") && (
              <button
                onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}
                className="mt-4 text-sm text-primary hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        {/* Articles */}
        {!loading && !error && filtered.length > 0 && (
          <>
            <p className="text-sm text-muted-foreground mb-6">
              {filtered.length} article{filtered.length !== 1 ? "s" : ""}
              {selectedCategory !== "All" ? ` in "${selectedCategory}"` : ""}
              {searchQuery ? ` matching "${searchQuery}"` : ""}
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((blog, i) => (
                <BlogCard key={blog.id} blog={blog} index={i} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Blogs;