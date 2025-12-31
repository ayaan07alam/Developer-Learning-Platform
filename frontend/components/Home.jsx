"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Code, Sparkles, Users, Search, X, Play, Zap, Globe, CheckCircle2, Star, TrendingUp, PenTool, Terminal, Layers, Briefcase, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { API_BASE_URL } from "@/lib/api-client";

// Card Data for Features Grid
const features = [
  {
    icon: <Terminal className="w-6 h-6 text-primary" />,
    title: "Interactive Coding",
    description: "Run code directly in your browser with our advanced sandboxes."
  },
  {
    icon: <Layers className="w-6 h-6 text-secondary" />,
    title: "Structured Paths",
    description: "Follow curated learning paths designed by industry experts."
  },
  {
    icon: <Users className="w-6 h-6 text-accent" />,
    title: "Community Driven",
    description: "Join thousands of developers sharing knowledge and code."
  },
];

const testimonials = [
  {
    name: "Alex Johnson",
    role: "Frontend Engineer @ Vercel",
    content: "RuntimeRiver completely changed how I learn. The live execution flow is game-changing.",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    name: "Sarah Williams",
    role: "Full Stack Dev",
    content: "The best resource for modern web development. Highly recommended!",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg"
  }
];

const quotes = [
  { text: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House", type: "tech" },
  { text: "The best way to predict the future is to invent it.", author: "Alan Kay", type: "tech" },
  { text: "Simplicity is the soul of efficiency.", author: "Austin Freeman", type: "general" },
  { text: "First, solve the problem. Then, write the code.", author: "John Johnson", type: "tech" },
  { text: "Excellence is not a destination; it is a continuous journey.", author: "Brian Tracy", type: "general" },
  { text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.", author: "Martin Fowler", type: "tech" }
];

const Home = () => {
  const [latestPosts, setLatestPosts] = useState([]);
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [categoryCount, setCategoryCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentQuote, setCurrentQuote] = useState(0);
  const postsPerSlide = 3;

  useEffect(() => {
    fetchLatestPosts();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/categories`);
      if (response.ok) {
        const data = await response.json();
        setCategoryCount(data.length);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchLatestPosts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/posts?status=PUBLISHED`);
      if (response.ok) {
        const posts = await response.json();

        // Sort posts by publishedAt date (most recent first)
        const sortedByDate = [...posts].sort((a, b) => {
          const dateA = new Date(a.publishedAt || a.createdAt);
          const dateB = new Date(b.publishedAt || b.createdAt);
          return dateB - dateA; // Descending order (newest first)
        });

        // Latest posts for "Latest Articles" section (sorted by date)
        setLatestPosts(sortedByDate);

        // Filter for "Trending" category
        const trendingOnly = sortedByDate.filter(post =>
          post.categories && post.categories.some(cat => cat.name && cat.name.toLowerCase() === 'trending')
        );

        // If we have trending posts, use them. Otherwise fallback to latest (optional, but good for empty state)
        // For now, based on your request, we will strictly use the filter.
        setTrendingPosts(trendingOnly.slice(0, 6));
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Auto-slide quotes every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const totalSlides = Math.ceil(latestPosts.length / postsPerSlide);
  const canGoPrev = currentSlide > 0;
  const canGoNext = currentSlide < totalSlides - 1;

  const nextSlide = () => {
    if (canGoNext) {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const prevSlide = () => {
    if (canGoPrev) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  const visiblePosts = latestPosts.slice(
    currentSlide * postsPerSlide,
    (currentSlide + 1) * postsPerSlide
  );

  return (
    <div className="flex flex-col min-h-screen">
      {/* 
        HERO SECTION 
        Cyber-Minimalist: Massive Typography, Left Aligned, Right "Portal"
      */}
      <section className="relative pt-32 pb-32 lg:pt-48 lg:pb-40 overflow-hidden">
        {/* Deep River Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-blue-950/5 to-background z-0" />

        {/* Animated Flow Lines (River Current) */}
        <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
          <div className="absolute top-[20%] -left-[10%] w-[120%] h-[300px] bg-gradient-to-r from-cyan-500/20 via-blue-600/20 to-purple-600/20 blur-[80px] rotate-[-5deg] animate-pulse" />
          <div className="absolute top-[60%] -right-[10%] w-[120%] h-[300px] bg-gradient-to-r from-blue-600/20 via-cyan-500/20 to-teal-400/20 blur-[80px] rotate-[5deg] animate-pulse delay-1000" />
        </div>

        {/* Abstract "Islands" */}
        <div className="absolute top-20 right-[10%] w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] animate-blob" />
        <div className="absolute bottom-20 left-[10%] w-64 h-64 bg-cyan-500/10 rounded-full blur-[100px] animate-blob animation-delay-2000" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Left: Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-mono text-cyan-400 mb-8 backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
                WHERE KNOWLEDGE FLOWS & CODE RUNS
              </div>

              <h1 className="text-6xl lg:text-8xl font-black tracking-tighter leading-[0.9] mb-6">
                <span className="text-foreground">RUNTIME</span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 animate-gradient-x bg-[length:200%_auto]">
                  RIVER
                </span>
              </h1>

              <p className="text-xl text-muted-foreground max-w-lg leading-relaxed mb-10">
                The open ecosystem for developers. Catch the <span className="text-cyan-400 font-medium">stream</span> of technical articles, build with free tools, and let your code <span className="text-blue-400 font-medium">flow</span> in our online compiler.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="h-14 px-8 text-lg rounded-full border-0 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-lg shadow-blue-500/25 transition-all hover:scale-105" asChild>
                  <Link href="/blogs">
                    🌊 Start Flowing
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full border-white/10 hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all text-muted-foreground hover:text-cyan-400" asChild>
                  <Link href="/compiler">
                    <Terminal className="w-5 h-5 mr-2" /> Run Code
                  </Link>
                </Button>
              </div>
            </motion.div>



            {/* Right: Search/Demo Section - Modern & Clean */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative"
            >
              {/* Search Bar Card */}
              <div className="relative bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 shadow-xl">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-2">What do you want to learn today?</h3>
                  <p className="text-muted-foreground text-sm">Flow through 40+ tools, tutorials, and articles</p>
                </div>

                {/* Search Input */}
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const input = e.target.querySelector('input');
                  const query = input.value.trim().toLowerCase();

                  if (!query) return;

                  // Smart routing based on keywords
                  if (query.includes('pdf') || query.includes('excel') || query.includes('image') || query.includes('word') || query.includes('ppt')) {
                    window.location.href = '/tools';
                  } else if (query.includes('react') || query.includes('javascript') || query.includes('typescript') || query.includes('css')) {
                    const techMap = {
                      'react': '/react',
                      'javascript': '/javascript',
                      'typescript': '/typescript',
                      'css': '/css'
                    };
                    const tech = Object.keys(techMap).find(t => query.includes(t));
                    window.location.href = tech ? techMap[tech] : '/react';
                  } else if (query.includes('job')) {
                    window.location.href = '/jobs';
                  } else {
                    // Default to blogs with search
                    window.location.href = `/blogs?search=${encodeURIComponent(query)}`;
                  }
                }} className="relative group">
                  <input
                    type="text"
                    placeholder="Try 'PDF merge', 'React hooks', 'JavaScript'..."
                    className="w-full px-6 py-4 pr-14 rounded-xl bg-background border-2 border-border focus:border-primary outline-none transition-all text-lg placeholder:text-muted-foreground/50"
                  />
                  <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-lg bg-primary hover:bg-primary/90 flex items-center justify-center transition-all group-hover:scale-105">
                    <ArrowRight className="w-5 h-5 text-white" />
                  </button>
                </form>

                {/* Quick Links */}
                <div className="mt-6 flex flex-wrap gap-2">
                  <span className="text-xs text-muted-foreground">Popular:</span>
                  <Link href="/tools/pdf" className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                    PDF Tools
                  </Link>
                  <Link href="/react" className="text-xs px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-colors">
                    React
                  </Link>
                  <Link href="/blogs" className="text-xs px-3 py-1 rounded-full bg-purple-500/10 text-purple-500 hover:bg-purple-500/20 transition-colors">
                    Latest Posts
                  </Link>
                </div>
              </div>

              {/* Stats Row Below */}
              <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-xl bg-card/30 border border-border/50">
                  <div className="text-2xl font-black text-green-500 mb-1">40+</div>
                  <div className="text-xs text-muted-foreground">Free Tools</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-card/30 border border-border/50">
                  <div className="text-2xl font-black text-blue-500 mb-1">{categoryCount > 0 ? categoryCount : '4'}</div>
                  <div className="text-xs text-muted-foreground">Categories</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-card/30 border border-border/50">
                  <div className="text-2xl font-black text-purple-500 mb-1">∞</div>
                  <div className="text-xs text-muted-foreground">Opportunities</div>
                </div>
              </div>
            </motion.div>



          </div>
        </div>
      </section>

      {/* TRENDING NOW - First Content Section */}
      <section className="py-24 border-t border-border">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 font-mono uppercase tracking-tighter">
              Riding the <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Current</span> 🌊
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              What's flowing in the developer community
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : trendingPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No trending posts yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingPosts.map((post) => (
                <Link
                  href={`/blogs/${post.slug}`}
                  key={post.id}
                  className="group relative overflow-hidden rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-xl transition-all duration-300">
                  <div className="relative h-48 overflow-hidden">
                    {post.mainImage ? (
                      <Image
                        src={post.mainImage}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                        <BookOpen className="w-12 h-12 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{post.readTime || 5} min read</span>
                      <span className="text-primary font-semibold">Read →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* PLATFORM OVERVIEW - 4 Pillars */}
      <section className="py-24 border-t border-border overflow-hidden">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4 font-mono uppercase tracking-tighter">
              One Platform, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Infinite Streams</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Navigate through learning, tools, and opportunities — all flowing together.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {/* Blog Platform */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Link href="/blogs" className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 block h-full">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 group-hover:scale-150 transition-all duration-500"></div>
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-purple-500/20 transition-all duration-300">
                    <BookOpen className="w-7 h-7 text-purple-400 group-hover:text-purple-300 transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-purple-400 transition-colors">Knowledge Stream 📚</h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    Read in-depth tutorials, guides, and tech insights
                  </p>
                  <div className="text-purple-400 text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                    Start Reading <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Contribution Platform */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <Link href="/dashboard/posts/new" className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 hover:border-pink-500/50 hover:shadow-xl hover:shadow-pink-500/10 transition-all duration-300 block h-full">
                <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl group-hover:bg-pink-500/20 group-hover:scale-150 transition-all duration-500"></div>
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-xl bg-pink-500/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-pink-500/20 transition-all duration-300">
                    <PenTool className="w-7 h-7 text-pink-400 group-hover:text-pink-300 transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-pink-400 transition-colors">Contribution Flow ✍️</h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    Write articles, share wisdom, and build your profile
                  </p>
                  <div className="text-pink-400 text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                    Start Writing <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Developer Tools */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Link href="/tools" className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 hover:border-green-500/50 hover:shadow-xl hover:shadow-green-500/10 transition-all duration-300 block h-full">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl group-hover:bg-green-500/20 group-hover:scale-150 transition-all duration-500"></div>
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-xl bg-green-500/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-green-500/20 transition-all duration-300">
                    <Code className="w-7 h-7 text-green-400 group-hover:text-green-300 transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-green-400 transition-colors">Tool Tributaries 🛠️</h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    40+ Essential developer tools, formatters, and utilities
                  </p>
                  <div className="text-green-400 text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                    Browse <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Learning Platform */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Link href="/compiler" className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 block h-full">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 group-hover:scale-150 transition-all duration-500"></div>
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all duration-300">
                    <Sparkles className="w-7 h-7 text-blue-400 group-hover:text-blue-300 transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">Execution Stream ⚡</h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    Online Compiler & IDE supporting 18+ languages
                  </p>
                  <div className="text-blue-400 text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                    Start <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Jobs Platform */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Link href="/jobs" target="_blank" rel="noopener noreferrer" className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 hover:border-orange-500/50 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 block h-full">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl group-hover:bg-orange-500/20 group-hover:scale-150 transition-all duration-500"></div>
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-xl bg-orange-500/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-orange-500/20 transition-all duration-300">
                    <Users className="w-7 h-7 text-orange-400 group-hover:text-orange-300 transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-orange-400 transition-colors">Career Current 💼</h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    Tech Job Board and Career Roadmaps
                  </p>
                  <div className="text-orange-400 text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                    Explore <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* POPULAR TOOLS SHOWCASE */}
      <section className="py-20 bg-muted/20 border-t border-border">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Popular Developer Tools</h2>
              <p className="text-muted-foreground">Free utilities — no signup required.</p>
            </div>
            <Link href="/tools" className="text-primary font-semibold hover:underline decoration-2 underline-offset-4 flex items-center gap-1">
              View All 40+ Tools <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/tools/pdf" className="p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition-all group">
              <div className="text-4xl mb-3">📄</div>
              <h3 className="font-bold mb-1">PDF Tools</h3>
              <p className="text-xs text-muted-foreground">Merge, split, compress</p>
            </Link>
            <Link href="/tools/images" className="p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition-all group">
              <div className="text-4xl mb-3">🖼️</div>
              <h3 className="font-bold mb-1">Image Tools</h3>
              <p className="text-xs text-muted-foreground">Resize, convert, optimize</p>
            </Link>
            <Link href="/tools/developer" className="p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition-all group">
              <div className="text-4xl mb-3">💻</div>
              <h3 className="font-bold mb-1">Code Tools</h3>
              <p className="text-xs text-muted-foreground">Format, validate, test</p>
            </Link>
            <Link href="/tools" className="p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition-all group">
              <div className="text-4xl mb-3">✨</div>
              <h3 className="font-bold mb-1">+ 35 More</h3>
              <p className="text-xs text-muted-foreground">Word, Excel, PPT & more</p>
            </Link>
          </div>
        </div>
      </section>

      {/* LATEST ARTICLES */}
      <section className="py-24 border-t border-border">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Latest <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Articles</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Fresh content published recently
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : latestPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No posts yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestPosts.slice(0, 6).map((post) => (
                <Link
                  href={`/blogs/${post.slug}`}
                  key={post.id}
                  className="group relative overflow-hidden rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-xl transition-all duration-300">
                  <div className="relative h-48 overflow-hidden">
                    {post.mainImage ? (
                      <Image
                        src={post.mainImage}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                        <BookOpen className="w-12 h-12 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{post.readTime || 5} min read</span>
                      <span className="text-primary font-semibold">Read →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* INSPIRATIONAL QUOTES CAROUSEL */}
      <section className="py-20 border-t border-border bg-gradient-to-b from-muted/20 to-background">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="relative bg-card border border-border rounded-2xl p-12 md:p-16 overflow-hidden">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>

              <div className="relative z-10">
                {/* Quote Icon */}
                <div className="mb-8">
                  <Sparkles className="w-12 h-12 text-primary" />
                </div>

                {/* Quote Text */}
                <motion.div
                  key={currentQuote}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="min-h-[160px]"
                >
                  <blockquote className="text-2xl md:text-3xl font-bold mb-6 leading-relaxed">
                    "{quotes[currentQuote].text}"
                  </blockquote>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-semibold text-primary">— {quotes[currentQuote].author}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {quotes[currentQuote].type === 'tech' ? '💻 Tech' : '✨ Life'}
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Navigation Controls */}
                <div className="flex items-center justify-between mt-8 pt-8 border-t border-border">
                  <div className="flex items-center gap-2">
                    {quotes.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentQuote(index)}
                        className={`h-2 rounded-full transition-all duration-300 ${index === currentQuote
                          ? 'w-8 bg-primary'
                          : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                          }`}
                        aria-label={`Go to quote ${index + 1}`}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentQuote((prev) => (prev - 1 + quotes.length) % quotes.length)}
                      className="p-2 rounded-lg border border-border hover:bg-secondary/10 hover:border-primary transition-all"
                      aria-label="Previous quote"
                    >
                      <ArrowRight className="w-5 h-5 rotate-180" />
                    </button>
                    <button
                      onClick={() => setCurrentQuote((prev) => (prev + 1) % quotes.length)}
                      className="p-2 rounded-lg border border-border hover:bg-secondary/10 hover:border-primary transition-all"
                      aria-label="Next quote"
                    >
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FROM OUR DEVELOPER COMMUNITY */}
      <section className="py-24 border-t border-border">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              From Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Developer Community</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Fresh insights, tutorials, and experiences from developers worldwide
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-4">Loading articles...</p>
            </div>
          ) : latestPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No published articles yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visiblePosts.map((post) => (
                <Link
                  href={`/blogs/${post.slug}`}
                  key={post.id}
                  className="group relative overflow-hidden rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-xl transition-all duration-300">
                  <div className="relative h-48 overflow-hidden">
                    {post.mainImage ? (
                      <Image
                        src={post.mainImage}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                        <BookOpen className="w-12 h-12 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{post.readTime || 5} min read</span>
                      <span className="text-primary font-semibold">Read →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section >

      {/* MULTI-PATH CTA */}
      < section className="py-20 border-t border-border bg-gradient-to-b from-background to-muted/20" >
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-muted-foreground text-lg mb-10 max-w-2xl mx-auto">
            Choose your path and join thousands of developers building, learning, and connecting.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <Link href="/react" className="p-6 rounded-xl border border-border bg-card hover:border-primary hover:bg-primary/5 transition-all group">
              <div className="text-3xl mb-2">📚</div>
              <div className="font-bold mb-1">Learn</div>
              <div className="text-xs text-muted-foreground">Start tutorials</div>
            </Link>
            <Link href="/tools" className="p-6 rounded-xl border border-border bg-card hover:border-primary hover:bg-primary/5 transition-all group">
              <div className="text-3xl mb-2">🛠️</div>
              <div className="font-bold mb-1">Use Tools</div>
              <div className="text-xs text-muted-foreground">Free utilities</div>
            </Link>
            <Link href="/dashboard/posts/new" className="p-6 rounded-xl border border-border bg-card hover:border-primary hover:bg-primary/5 transition-all group">
              <div className="text-3xl mb-2">✍️</div>
              <div className="font-bold mb-1">Write</div>
              <div className="text-xs text-muted-foreground">Share knowledge</div>
            </Link>
            <Link href="/jobs" target="_blank" rel="noopener noreferrer" className="p-6 rounded-xl border border-border bg-card hover:border-primary hover:bg-primary/5 transition-all group">
              <div className="text-3xl mb-2">💼</div>
              <div className="font-bold mb-1">Find Jobs</div>
              <div className="text-xs text-muted-foreground">Hire or get hired</div>
            </Link>
          </div>
        </div>
      </section >

    </div >
  );
};

export default Home;
