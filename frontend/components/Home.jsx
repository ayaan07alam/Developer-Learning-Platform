"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Code2, Terminal, Cpu, Globe, Zap, Layers, BookOpen, Users, Code, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
    content: "IntelForgeeks completely changed how I learn. The interactive examples are game-changing.",
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
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentQuote, setCurrentQuote] = useState(0);
  const postsPerSlide = 3;

  useEffect(() => {
    fetchLatestPosts();
  }, []);

  const fetchLatestPosts = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/posts?status=PUBLISHED');
      if (response.ok) {
        const posts = await response.json();
        // Get all published posts for carousel
        setLatestPosts(posts);
        // Get latest 6 posts for trending section
        setTrendingPosts(posts.slice(0, 6));
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
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Mesh (Absolute) */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/3 pointer-events-none animate-pulse-glow" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[120px] translate-y-1/3 -translate-x-1/4 pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Left: Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-primary mb-8 backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                COMPLETE DEVELOPER ECOSYSTEM
              </div>

              <h1 className="text-6xl lg:text-8xl font-black tracking-tighter leading-[0.9] mb-6">
                YOUR <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-secondary animate-shimmer bg-[length:200%_auto]">
                  COMPLETE
                </span><br />
                PLATFORM.
              </h1>

              <p className="text-xl text-muted-foreground max-w-lg leading-relaxed mb-10">
                Write · Build · Learn · Connect — Everything developers need in one ecosystem.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="h-14 px-8 text-lg rounded-none border border-primary bg-primary/10 hover:bg-primary text-primary hover:text-black transition-all font-mono uppercase tracking-widest" asChild>
                  <Link href="/blogs">Explore Blog</Link>
                </Button>
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-none border-white/20 hover:border-white hover:bg-white/5 transition-all font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground" asChild>
                  <Link href="/tools">Browse Tools</Link>
                </Button>
              </div>
            </motion.div>

            {/* Right: Visual (Code Interface Mockup) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-10 bg-card border border-border rounded-xl p-2 shadow-2xl shadow-primary/10">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                  </div>
                  <div className="text-xs font-mono text-muted-foreground ml-4">main.tsx — nebula-v2</div>
                </div>
                <div className="p-6 font-mono text-sm leading-relaxed text-muted-foreground">
                  <div className="mb-2"><span className="text-purple-400">const</span> <span className="text-blue-400">Engineer</span> = <span className="text-yellow-400">()</span> <span className="text-purple-400">=&gt;</span> {"{"}</div>
                  <div className="pl-6 mb-2"><span className="text-purple-400">const</span> stack = [<span className="text-green-400">"React"</span>, <span className="text-green-400">"Next.js"</span>, <span className="text-green-400">"AI"</span>];</div>
                  <div className="pl-6 mb-2"><span className="text-purple-400">return</span> (</div>
                  <div className="pl-12 mb-2">&lt;<span className="text-red-400">Future</span></div>
                  <div className="pl-16 mb-2"><span className="text-orange-400">skills</span>={"{"}stack{"}"}</div>
                  <div className="pl-16 mb-2"><span className="text-orange-400">mode</span>=<span className="text-green-400">"limitless"</span></div>
                  <div className="pl-12 mb-2">/&gt;</div>
                  <div className="pl-6">);</div>
                  <div>{"}"};</div>
                </div>
                {/* Floating Elements */}
                <motion.div
                  animate={{ y: [0, -20, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-10 -right-10 bg-card border border-border p-4 rounded-lg shadow-xl backdrop-blur-xl z-20"
                >
                  <Zap className="w-8 h-8 text-yellow-400 select-none" />
                </motion.div>
              </div>

              {/* Decorative Grid Behind */}
              <div className="absolute inset-0 z-0 bg-transparent bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] mask-image-[radial-gradient(ellipse_at_center,black,transparent)]" />
            </motion.div>

          </div>
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
              Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Complete</span> Ecosystem
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Everything you need to grow as a developer — all in one platform.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                  <h3 className="text-xl font-bold mb-2 group-hover:text-purple-400 transition-colors">Blog Platform</h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    Share your expertise and build your audience
                  </p>
                  <div className="text-purple-400 text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                    Write <ArrowRight className="w-4 h-4" />
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
                  <h3 className="text-xl font-bold mb-2 group-hover:text-green-400 transition-colors">40+ Free Tools</h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    Utilities for everyday development work
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
              <Link href="/react" className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 block h-full">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 group-hover:scale-150 transition-all duration-500"></div>
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all duration-300">
                    <Sparkles className="w-7 h-7 text-blue-400 group-hover:text-blue-300 transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">Interactive Learning</h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    Tutorials on modern tech stacks
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
              <Link href="/jobs" className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 hover:border-orange-500/50 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 block h-full">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl group-hover:bg-orange-500/20 group-hover:scale-150 transition-all duration-500"></div>
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-xl bg-orange-500/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-orange-500/20 transition-all duration-300">
                    <Users className="w-7 h-7 text-orange-400 group-hover:text-orange-300 transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-orange-400 transition-colors">Job Board</h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    Connecting talent with opportunities
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

      {/* TRENDING BLOGS SECTION */}
      <section className="py-24 bg-muted/30 border-t border-border">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 font-mono uppercase tracking-tighter">
              Trending <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Now</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Latest insights and tutorials making waves in the developer community
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
                  className="group relative overflow-hidden rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-xl transition-all duration-300"
                >
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

      {/* LATEST ARTICLES - Priority Section for SEO */}
      <section className="py-24 container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">From Our Developer Community</h2>
            <p className="text-muted-foreground">Fresh insights, tutorials, and experiences from developers worldwide.</p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/blogs" className="text-primary font-semibold hover:underline decoration-2 underline-offset-4 flex items-center gap-1">
              Browse All Posts <ArrowRight className="w-4 h-4" />
            </Link>

            {/* Carousel Navigation */}
            {latestPosts.length > postsPerSlide && (
              <div className="flex items-center gap-2">
                <button
                  onClick={prevSlide}
                  disabled={!canGoPrev}
                  className={`p-2 rounded-lg border border-border transition-all ${canGoPrev
                    ? 'hover:bg-secondary/10 hover:border-primary cursor-pointer'
                    : 'opacity-30 cursor-not-allowed'
                    }`}
                  aria-label="Previous posts"
                >
                  <ArrowRight className="w-5 h-5 rotate-180" />
                </button>
                <span className="text-sm text-muted-foreground font-mono">
                  {currentSlide + 1} / {totalSlides}
                </span>
                <button
                  onClick={nextSlide}
                  disabled={!canGoNext}
                  className={`p-2 rounded-lg border border-border transition-all ${canGoNext
                    ? 'hover:bg-secondary/10 hover:border-primary cursor-pointer'
                    : 'opacity-30 cursor-not-allowed'
                    }`}
                  aria-label="Next posts"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
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
          <div className="relative overflow-hidden">
            <div
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentSlide * 100}%)`,
                display: 'grid'
              }}
            >
              {visiblePosts.map((post) => (
                <Link href={`/blogs/${post.slug}`} key={post.id} className="group">
                  <div className="rounded-3xl overflow-hidden border border-border/50 bg-card shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col">
                    <div className="relative h-60 overflow-hidden">
                      {post.mainImage ? (
                        <Image
                          src={post.mainImage}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                          <BookOpen className="w-16 h-16 text-muted-foreground" />
                        </div>
                      )}
                      {post.categories && post.categories[0] && (
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-semibold border border-white/10">
                            {post.categories[0].name}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex gap-2 mb-4 flex-wrap">
                          {post.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="text-xs font-medium text-muted-foreground bg-secondary/10 px-2 py-1 rounded">#{tag}</span>
                          ))}
                        </div>
                      )}
                      <h3 className="text-xl font-bold mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-secondary transition-all">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{post.excerpt}</p>
                      )}
                      <div className="mt-auto pt-4 flex items-center justify-between text-sm text-muted-foreground border-t border-border/50">
                        <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" /> {post.readTime || 5} min read</span>
                        <span>Read Article →</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* MULTI-PATH CTA */}
      <section className="py-20 border-t border-border bg-gradient-to-b from-background to-muted/20">
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
            <Link href="/blogs" className="p-6 rounded-xl border border-border bg-card hover:border-primary hover:bg-primary/5 transition-all group">
              <div className="text-3xl mb-2">✍️</div>
              <div className="font-bold mb-1">Write</div>
              <div className="text-xs text-muted-foreground">Share knowledge</div>
            </Link>
            <Link href="/jobs" className="p-6 rounded-xl border border-border bg-card hover:border-primary hover:bg-primary/5 transition-all group">
              <div className="text-3xl mb-2">💼</div>
              <div className="font-bold mb-1">Find Jobs</div>
              <div className="text-xs text-muted-foreground">Hire or get hired</div>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
