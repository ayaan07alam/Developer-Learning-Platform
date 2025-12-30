"use client";
import React, { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { generateBlogPostSchemas } from '@/lib/schema';
import BlogContent from '@/components/BlogContent';
import SchemaMarkup from '@/components/SchemaMarkup';
import FAQSection from '@/components/FAQSection';
import AuthorCard from '@/components/AuthorCard';
import ReadingProgress from '@/components/ReadingProgress';
import RelatedBlogs from '@/components/RelatedBlogs';
import { notFound } from 'next/navigation';
import CustomDialog from '@/components/CustomDialog';
import { useDialog } from '@/lib/useDialog';
import { API_BASE_URL } from '@/lib/api-client';

const BlogPost = ({ initialPost }) => {
    const params = useParams();
    const [post, setPost] = useState(initialPost || null);
    const [loading, setLoading] = useState(!initialPost);
    const [error, setError] = useState(null);
    const { showAlert, dialogState, handleClose, handleConfirm } = useDialog();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/posts/slug/${params.slug}`);
                if (!response.ok) {
                    throw new Error('Post not found');
                }
                const data = await response.json();
                console.log('Post data:', data);
                console.log('FAQs:', data.faqs);
                setPost(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (!initialPost && params.slug) {
            fetchPost();
        }
    }, [params.slug, initialPost]);

    if (loading) {
        return (
            <div className="min-h-screen pt-24 pb-12 bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4"></div>
                    <p className="text-muted-foreground">Loading article...</p>
                </div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="min-h-screen pt-24 pb-12 bg-background flex items-center justify-center">
                <div className="text-center max-w-md">
                    <h1 className="text-4xl font-bold mb-4">404</h1>
                    <p className="text-muted-foreground mb-6">Article not found</p>
                    <Link href="/blogs" className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                        Back to Blogs
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Reading Progress Indicator */}
            <ReadingProgress slug={params.slug} />

            <div className="min-h-screen pt-24 pb-12 bg-background">
                {/* New Schema Markup Component */}
                <SchemaMarkup post={post} faqs={post.faqs || []} />

                {/* Background Decor */}
                <div className="absolute top-20 left-10 w-64 h-64 bg-primary/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-20 right-10 w-80 h-80 bg-secondary/20 rounded-full blur-[120px]" />

                <div className="container mx-auto px-6 max-w-screen-2xl relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Left Sidebar - Related Content (2 cols) */}
                        <aside className="hidden lg:block lg:col-span-2">
                            <RelatedBlogs currentPost={post} />
                        </aside>

                        {/* Main Content (8 cols) - Centered */}
                        <article className="lg:col-span-8">
                            {/* Back Button */}
                            <Link
                                href="/blogs"
                                className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
                            >
                                ← Back to all articles
                            </Link>

                            {/* Article Header */}
                            <motion.header
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-12"
                            >
                                <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                                    {post.title}
                                </h1>

                                {/* Author Byline */}
                                {post.createdBy && (
                                    <p className="text-lg text-muted-foreground mb-6">
                                        by <span className="font-medium text-foreground">{post.createdBy.displayName || 'Anonymous'}</span>
                                    </p>
                                )}

                                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                                    <span className="flex items-center gap-1">
                                        📅 {new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </span>
                                    <span>•</span>
                                    <span>{post.readTime} min read</span>
                                </div>

                                {post.excerpt && (
                                    <p className="text-xl text-muted-foreground leading-relaxed">
                                        {post.excerpt}
                                    </p>
                                )}

                            </motion.header>

                            {/* Featured Image */}
                            {post.mainImage && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="mb-12 rounded-2xl overflow-hidden"
                                >
                                    <img
                                        src={post.mainImage}
                                        alt={post.title}
                                        className="w-full h-auto max-h-[500px] object-cover"
                                    />
                                </motion.div>
                            )}

                            {/* Article Content */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <BlogContent htmlContent={post.content || post.smallDescription} />
                            </motion.div>

                            {/* Tags */}
                            {post.tags && post.tags.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                    className="mt-12 pt-8 border-t border-border"
                                >
                                    <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Tags</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {post.tags.map((tag, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 bg-secondary/50 text-secondary-foreground rounded-full text-sm"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* FAQ Section */}
                            <FAQSection faqs={post.faqs || []} />

                            {/* Categories */}
                            {post.categories && post.categories.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.45 }}
                                    className="mt-12 pt-8 border-t border-border"
                                >
                                    <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Categories</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {post.categories.map((category) => (
                                            <Link
                                                key={category.id}
                                                href={`/categories/${category.slug}`}
                                                className="px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-lg text-sm font-medium hover:bg-primary/20 transition-colors"
                                            >
                                                {category.name}
                                            </Link>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* Author Card */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                            >
                                <AuthorCard author={post.createdBy} />
                            </motion.div>

                            {/* Share Button */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="mt-8 flex justify-center items-center gap-4"
                            >
                                {/* Share Button with Dropdown */}
                                <div className="relative group">
                                    <button className="flex items-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-full hover:bg-secondary/80 transition-colors">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                        </svg>
                                        Share
                                    </button>

                                    {/* Dropdown Menu */}
                                    <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-48 bg-card border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                        <div className="py-2">
                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText(window.location.href);
                                                    showAlert('Link copied to clipboard!', {
                                                        title: 'Success'
                                                    });
                                                }}
                                                className="w-full flex items-center gap-3 px-4 py-2 hover:bg-muted transition-colors text-left"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                </svg>
                                                <span>Copy Link</span>
                                            </button>

                                            <a
                                                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-full flex items-center gap-3 px-4 py-2 hover:bg-muted transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                                </svg>
                                                <span>LinkedIn</span>
                                            </a>

                                            <a
                                                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&text=${encodeURIComponent(post.title)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-full flex items-center gap-3 px-4 py-2 hover:bg-muted transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                                </svg>
                                                <span>X (Twitter)</span>
                                            </a>

                                            <a
                                                href={`https://reddit.com/submit?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&title=${encodeURIComponent(post.title)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-full flex items-center gap-3 px-4 py-2 hover:bg-muted transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.520c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
                                                </svg>
                                                <span>Reddit</span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>


                        </article>

                        {/* Right Sidebar - Ad Space (2 cols) */}
                        <aside className="hidden lg:block lg:col-span-2">
                            <div className="sticky top-24 space-y-6">
                                {/* Ad Space - Invisible Container */}
                                <div className="h-[600px] w-full" />
                            </div>
                        </aside>
                    </div>
                </div>
            </div>

            {/* Custom Dialog */}
            <CustomDialog
                isOpen={dialogState.isOpen}
                onClose={handleClose}
                onConfirm={handleConfirm}
                title={dialogState.title}
                message={dialogState.message}
                type={dialogState.type}
                confirmText={dialogState.confirmText}
                cancelText={dialogState.cancelText}
                variant={dialogState.variant}
            />
        </>
    );
};

export default BlogPost;
