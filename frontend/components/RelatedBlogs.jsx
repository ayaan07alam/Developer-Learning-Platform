"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Clock, FileText } from 'lucide-react';
import { API_BASE_URL } from '@/lib/api-client';

const RelatedPostImage = ({ src, title }) => {
    const [error, setError] = useState(false);
    if (error || !src) {
        return (
            <div className="w-full h-full bg-muted flex items-center justify-center">
                <FileText className="w-4 h-4 text-muted-foreground/30" />
            </div>
        );
    }
    return (
        <Image
            src={src}
            alt={title || 'Article'}
            fill
            sizes="80px"
            className="object-cover"
            onError={() => setError(true)}
        />
    );
};

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

                setRelatedPosts(filtered.slice(0, 4));
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
            <div className="sticky top-24 space-y-3">
                <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-16 bg-muted/50 rounded-lg animate-pulse" />
                ))}
            </div>
        );
    }

    if (relatedPosts.length === 0) return null;

    return (
        <div className="sticky top-24">
            <p className="section-label mb-4">Related</p>
            <div className="space-y-3">
                {relatedPosts.map((post, index) => (
                    <motion.div
                        key={post.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.06 }}
                    >
                        <Link
                            href={`/blogs/${post.slug}`}
                            className="group flex gap-3 p-2.5 -mx-2.5 rounded-lg hover:bg-muted/60 transition-colors"
                        >
                            <div className="relative w-[72px] h-[52px] rounded-md overflow-hidden bg-muted shrink-0 border border-border/50">
                                <RelatedPostImage src={post.mainImage} title={post.title} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-[13px] font-semibold leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                                    {post.title}
                                </h4>
                                {post.readTime && (
                                    <span className="flex items-center gap-1 mt-1 text-[11px] text-muted-foreground">
                                        <Clock className="w-3 h-3" />
                                        {post.readTime} min
                                    </span>
                                )}
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default RelatedBlogs;
