"use client";
import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import Link from 'next/link';
import { API_BASE_URL } from '@/lib/api-client';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/posts?status=PUBLISHED`);
      if (!response.ok) {
        throw new Error('Failed to fetch blogs');
      }
      const data = await response.json();

      // Sort blogs by publishedAt date (most recent first)
      const sortedBlogs = [...data].sort((a, b) => {
        const dateA = new Date(a.publishedAt || a.createdAt);
        const dateB = new Date(b.publishedAt || b.createdAt);
        return dateB - dateA; // Descending order (newest first)
      });

      setBlogs(sortedBlogs);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading articles...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-24 pb-12 bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Error Loading Blogs</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <button
            onClick={fetchBlogs}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-background relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-primary/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-secondary/20 rounded-full blur-[120px]" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            Latest Articles
          </h1>
          <p className="text-muted-foreground text-lg">
            Insights, tutorials, and news from the tech world.
            Stay ahead of the curve with our in-depth guides.
          </p>
        </div>

        {blogs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No published articles yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog, index) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={`/blogs/${blog.slug}`}>
                  <div className="group h-full bg-card border border-border rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 cursor-pointer">
                    {/* Image */}
                    <div className="relative h-56 overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20">
                      {blog.mainImage ? (
                        <img
                          src={blog.mainImage}
                          alt={blog.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-6xl">📝</span>
                        </div>
                      )}
                      {blog.categories && blog.categories[0] && (
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-semibold border border-white/10">
                            {blog.categories[0].name}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      {blog.tags && blog.tags.length > 0 && (
                        <div className="flex gap-2 mb-3 flex-wrap">
                          {blog.tags.slice(0, 3).map((tag, i) => (
                            <span key={i} className="text-xs font-medium text-muted-foreground bg-secondary/10 px-2 py-1 rounded">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <h2 className="text-xl font-bold mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-secondary transition-all line-clamp-2">
                        {blog.title}
                      </h2>

                      {blog.excerpt && (
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                          {blog.excerpt}
                        </p>
                      )}

                      <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t border-border">
                        <span>{blog.readTime || 5} min read</span>
                        <span className="text-primary group-hover:translate-x-1 transition-transform">
                          Read more →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Blogs;