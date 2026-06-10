"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { API_BASE_URL } from '@/lib/api-client';

const RelatedBlogs = ({ currentPost }) => {
    const [relatedPosts, setRelatedPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRelatedPosts = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/posts?status=PUBLISHED`);
                if (!response.ok) return;

                const allPosts = await response.json();
                if (!Array.isArray(allPosts)) return;

                const currentCategoryIds = currentPost.categories?.map(c => c.id) || [];

                const filtered = allPosts.filter(post => {
                    if (post.id === currentPost.id) return false;
                    const postCategoryIds = post.categories?.map(c => c.id) || [];
                    return postCategoryIds.some(id => currentCategoryIds.includes(id));
                });

                setRelatedPosts(filtered.slice(0, 6));
            } catch (error) {
                console.error('Error fetching related posts:', error);
            } finally {
                setLoading(false);
            }
        };

        if (currentPost?.id) {
            fetchRelatedPosts();
        }
    }, [currentPost]);

    if (loading) {
        return (
            <div className="sticky top-24 space-y-2">
                <div className="h-3 w-16 bg-muted rounded animate-pulse mb-4" />
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-10 bg-muted/50 rounded animate-pulse" />
                ))}
            </div>
        );
    }

    if (relatedPosts.length === 0) return null;

    return (
        <div className="sticky top-24">
            <p className="section-label mb-3">Related</p>
            <div className="space-y-0.5">
                {relatedPosts.map((post, index) => (
                    <motion.div
                        key={post.id}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <Link
                            href={`/blogs/${post.slug}`}
                            className="group block py-2 px-2.5 -mx-2.5 rounded-lg hover:bg-muted/60 transition-colors"
                        >
                            <h4 className="text-[12.5px] font-medium leading-snug line-clamp-2 text-muted-foreground group-hover:text-primary transition-colors">
                                {post.title}
                            </h4>
                            {post.readTime && (
                                <span className="flex items-center gap-1 mt-1 text-[11px] text-muted-foreground/60">
                                    <Clock className="w-2.5 h-2.5" />
                                    {post.readTime} min
                                </span>
                            )}
                        </Link>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default RelatedBlogs;
