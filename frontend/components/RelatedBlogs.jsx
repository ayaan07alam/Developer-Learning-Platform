"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, Clock } from 'lucide-react';

const RelatedBlogs = ({ currentPost }) => {
    const [relatedPosts, setRelatedPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRelatedPosts = async () => {
            try {
                // Since we don't have a direct related posts API, we'll fetch all and filter
                // In a production app with many posts, this should be a backend endpoint
                const response = await fetch('http://localhost:8080/api/post');
                if (response.ok) {
                    const allPosts = await response.json();

                    // Filter posts:
                    // 1. Must share at least one category with current post
                    // 2. Must not be the current post
                    // 3. Status must be PUBLISHED
                    const currentCategoryIds = currentPost.categories?.map(c => c.id) || [];

                    const filtered = allPosts.filter(post => {
                        if (post.id === currentPost.id) return false;
                        if (post.status !== 'PUBLISHED') return false;

                        const postCategoryIds = post.categories?.map(c => c.id) || [];
                        return postCategoryIds.some(id => currentCategoryIds.includes(id));
                    });

                    // Take top 5
                    setRelatedPosts(filtered.slice(0, 5));
                }
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

    if (loading || relatedPosts.length === 0) return null;

    return (
        <div className="sticky top-24 space-y-6">
            <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                Related Articles
            </h3>

            <div className="space-y-4">
                {relatedPosts.map((post, index) => (
                    <motion.div
                        key={post.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group"
                    >
                        <Link href={`/blogs/${post.slug}`} className="block p-4 rounded-xl bg-secondary/5 border border-transparent hover:border-primary/20 hover:bg-secondary/10 transition-all duration-300">
                            <h4 className="font-semibold text-sm mb-0 line-clamp-2 group-hover:text-primary transition-colors">
                                {post.title}
                            </h4>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default RelatedBlogs;
