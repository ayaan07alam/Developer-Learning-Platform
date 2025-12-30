"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { X, ArrowRight } from "lucide-react";
import { API_BASE_URL } from "@/lib/api-client";

const Learn = () => {
  const [selectedId, setSelectedId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/categories`);
      const data = await response.json();

      const customCategories = [
        {
          id: 'careers-jobs',
          title: 'Careers & Jobs',
          subtitle: 'Job market & career advice',
          description: 'Latest job opportunities, interview tips, and career growth strategies',
          link: '/categories/careers-and-jobs',
          accent: "text-emerald-500"
        },
        {
          id: 'interview-experiences',
          title: 'Interview Experiences',
          subtitle: 'Real stories from candidates',
          description: 'Read about real interview experiences and hiring processes at top tech companies',
          link: '/categories/interview-experiences',
          accent: "text-violet-500"
        },
        {
          id: 'interview-questions',
          title: 'Interview Questions',
          subtitle: 'Prepare for your dream job',
          description: 'Curated lists of frequently asked technical interview questions and answers',
          link: '/categories/interview-questions',
          accent: "text-blue-500"
        },
        {
          id: 'roadmaps',
          title: 'Roadmaps',
          subtitle: 'Step-by-step learning paths',
          description: 'Complete guides and roadmaps to become a frontend, backend, or full-stack developer',
          link: '/categories/roadmaps',
          accent: "text-cyan-500"
        },
        {
          id: 'tech-insights',
          title: 'Tech Insights',
          subtitle: 'Latest tech revolution & updates',
          description: 'Deep dives into technology trends, new stacks, and industry analysis',
          link: '/categories/tech-insights',
          accent: "text-amber-500"
        },
        {
          id: 'trending',
          title: 'Trending',
          subtitle: 'What everyone is reading',
          description: 'Most popular topics and viral tech discussions happening right now',
          link: '/categories/trending',
          accent: "text-rose-500"
        }
      ];

      const transformedData = data.map((cat, index) => ({
        id: cat.id,
        title: cat.name,
        subtitle: cat.description || 'Learn more',
        description: cat.description || `Explore ${cat.name} tutorials and guides`,
        link: `/categories/${cat.slug}`,
        accent: getAccentForIndex(index)
      }));

      // Combine custom categories with API categories
      setCategories([...customCategories, ...transformedData]);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAccentForIndex = (index) => {
    const accents = [
      "text-blue-500", "text-purple-500", "text-emerald-500", "text-rose-500",
      "text-cyan-500", "text-indigo-500", "text-teal-500", "text-pink-500",
      "text-violet-500", "text-fuchsia-500", "text-sky-500", "text-amber-500",
      "text-lime-500", "text-orange-500", "text-red-500"
    ];
    return accents[index % accents.length];
  };

  useEffect(() => {
    if (selectedId !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflowY = "scroll";
    }
  }, [selectedId]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20 relative overflow-hidden pt-24 pb-12">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Explore Topics
          </h1>
          <p className="text-muted-foreground">
            Browse through our curated collection of tech categories
          </p>
        </div>

        <motion.div
          layout
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
        >
          {loading ? (
            <div className="col-span-full text-center py-12 text-muted-foreground">Loading...</div>
          ) : categories.length === 0 ? (
            <div className="col-span-full text-center py-12 text-muted-foreground">No categories available</div>
          ) : (
            categories.map((item) => (
              <motion.div
                layoutId={item.id}
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                whileHover={{ y: -6, rotateX: 5 }}
                whileTap={{ scale: 0.98 }}
                className="group cursor-pointer relative bg-card/80 backdrop-blur-sm hover:bg-card border border-border/50 rounded-xl p-5 transition-all duration-300 shadow-lg hover:shadow-xl hover:border-border min-h-[120px] flex flex-col"
                style={{
                  transformStyle: 'preserve-3d',
                  perspective: '1000px'
                }}
              >
                {/* 3D depth layer */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Bottom shadow for 3D effect */}
                <div className="absolute -bottom-1 left-2 right-2 h-1 bg-black/10 dark:bg-black/30 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Category name with colored text */}
                <h3 className={cn(
                  "text-base font-semibold transition-all duration-300 leading-tight mb-2",
                  item.accent,
                  "group-hover:scale-105"
                )}>
                  {item.title}
                </h3>

                {/* One-line description */}
                <p className="text-xs text-muted-foreground/70 leading-snug line-clamp-2 flex-grow">
                  {item.subtitle}
                </p>

                {/* Arrow on hover */}
                <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 mt-3 transform group-hover:translate-x-0.5">
                  <ArrowRight className={cn("w-3.5 h-3.5", item.accent)} />
                </div>
              </motion.div>
            ))
          )}
        </motion.div>

        <AnimatePresence>
          {selectedId && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedId(null)}
                className="absolute inset-0 bg-black/60 backdrop-blur-md"
              />

              <motion.div
                layoutId={selectedId}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative w-full max-w-md bg-card/95 backdrop-blur-xl rounded-2xl border border-border shadow-2xl overflow-hidden"
              >
                <button
                  onClick={() => setSelectedId(null)}
                  className="absolute top-4 right-4 z-20 p-2 rounded-lg hover:bg-accent/80 transition-colors"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>

                <div className="p-8">
                  <h2 className={cn(
                    "text-2xl font-bold mb-2 transition-colors",
                    categories.find((item) => item.id === selectedId)?.accent
                  )}>
                    {categories.find((item) => item.id === selectedId)?.title}
                  </h2>

                  <p className="text-sm text-muted-foreground mb-6">
                    {categories.find((item) => item.id === selectedId)?.description}
                  </p>

                  <Link
                    href={categories.find((item) => item.id === selectedId)?.link || '#'}
                    className="inline-flex items-center justify-center w-full px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all duration-200 gap-2 shadow-lg hover:shadow-xl"
                  >
                    Start Learning
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Learn;
