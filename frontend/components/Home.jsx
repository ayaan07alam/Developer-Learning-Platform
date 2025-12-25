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

const Home = () => {
  const [latestPosts, setLatestPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLatestPosts();
  }, []);

  const fetchLatestPosts = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/posts?status=PUBLISHED');
      if (response.ok) {
        const posts = await response.json();
        // Get latest 3 published posts
        setLatestPosts(posts.slice(0, 3));
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

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
                V2.0 NEBULA ONLINE
              </div>

              <h1 className="text-6xl lg:text-8xl font-black tracking-tighter leading-[0.9] mb-6">
                FUTURE <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-secondary animate-shimmer bg-[length:200%_auto]">
                  ENGINEER.
                </span>
              </h1>

              <p className="text-xl text-muted-foreground max-w-lg leading-relaxed mb-10">
                Master modern tech stacks with our premium, interactive roadmaps.
                Stop consuming. Start building.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="h-14 px-8 text-lg rounded-none border border-primary bg-primary/10 hover:bg-primary text-primary hover:text-black transition-all font-mono uppercase tracking-widest">
                  Start Learning
                </Button>
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-none border-white/20 hover:border-white hover:bg-white/5 transition-all font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground">
                  View Roadmaps
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

      {/* 
         BENTO GRID FEATURES
         Cyber-Minimalist: Strict borders, layout variety, tech icons
      */}
      <section className="py-24 bg-muted/30 border-t border-border">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 font-mono uppercase tracking-tighter">
              System <span className="text-primary">Capabilities</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Engineered for maximum efficiency. Our platform provides the tools you need to scale your skills.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-2 gap-4 h-auto md:h-[600px]">
            {/* Card 1: Large Left */}
            <div className="md:col-span-2 row-span-2 relative group overflow-hidden rounded-2xl border border-border bg-card p-8 flex flex-col justify-end">
              <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-100 transition-opacity duration-500">
                <Globe className="w-32 h-32 text-primary" />
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-2">Global Tech Ecosystem</h3>
                <p className="text-muted-foreground">Comprehensive coverage of the entire development landscape, from frontend frameworks to backend systems.</p>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
            </div>

            {/* Card 2: Top Right */}
            <div className="relative group overflow-hidden rounded-2xl border border-border bg-card p-8 hover:bg-accent/10 transition-colors">
              <Code2 className="w-10 h-10 text-secondary mb-4" />
              <h3 className="text-xl font-bold mb-2">Live Code Labs</h3>
              <p className="text-sm text-muted-foreground">Practice in real-time environments.</p>
            </div>

            {/* Card 3: Bottom Right */}
            <div className="relative group overflow-hidden rounded-2xl border border-border bg-card p-8 hover:bg-accent/10 transition-colors">
              <Cpu className="w-10 h-10 text-accent mb-4" />
              <h3 className="text-xl font-bold mb-2">AI-Powered Paths</h3>
              <p className="text-sm text-muted-foreground">Adaptive learning algorithms.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 
          STATS / TRUST / FOOTER PREVIEW 
      */}
      <section className="py-20 border-t border-border bg-muted/20 flex items-center justify-center">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center container mx-auto px-6">
          {[
            { number: "10K+", label: "Developers" },
            { number: "500+", label: "Tutorials" },
            { number: "99%", label: "Satisfaction" },
            { number: "24/7", label: "Uptime" },
          ].map((stat, i) => (
            <div key={i}>
              <div className="text-4xl font-bold mb-2 font-mono">{stat.number}</div>
              <div className="text-sm text-muted-foreground uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* LATEST ARTICLES */}
      <section className="py-24 container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Latest Articles</h2>
            <p className="text-muted-foreground">Fresh content from our blog.</p>
          </div>
          <Link href="/blogs" className="text-primary font-semibold hover:underline decoration-2 underline-offset-4 flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestPosts.map((post) => (
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
        )}
      </section>

    </div>
  );
};

export default Home;
