"use client";
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';
import { API_BASE_URL } from '@/lib/api-client';
import LoadingPage from '@/components/Loader/Loader';

export default function CategoryPostsPage() {
    const params = useParams();
    const slug = params.slug;
    const [category, setCategory] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (slug) {
            fetchCategoryAndPosts();
        }
    }, [slug]);

    const fetchCategoryAndPosts = async () => {
        try {
            // Fetch category details
            const categoryResponse = await fetch(`${API_BASE_URL}/api/categories/${slug}`);
            const categoryData = await categoryResponse.json();
            setCategory(categoryData);

            // Fetch all posts and filter by category
            const postsResponse = await fetch(`${API_BASE_URL}/api/posts`);
            const allPosts = await postsResponse.json();

            // Filter posts that have this category
            const filteredPosts = allPosts.filter(post =>
                post.status === 'PUBLISHED' &&
                post.categories &&
                post.categories.some(cat => cat.slug === slug)
            );

            setPosts(filteredPosts);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-24 pb-12">
                <div className="container mx-auto px-6">
                    <LoadingPage fullScreen={false} />
                </div>
            </div>
        );
    }

    if (!category) {
        return (
            <div className="min-h-screen pt-24 pb-12">
                <div className="container mx-auto px-6">
                    <div className="text-center">Category not found</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12">
            <div className="container mx-auto px-6 max-w-4xl">
                <Link
                    href="/categories"
                    className="inline-flex items-center gap-2 text-primary hover:underline mb-8"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Categories
                </Link>

                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">{category.name}</h1>
                    {category.description && (
                        <p className="text-lg text-muted-foreground mb-4">
                            {category.description}
                        </p>
                    )}
                    <p className="text-sm text-muted-foreground">
                        {posts.length} {posts.length === 1 ? 'post' : 'posts'}
                    </p>
                </div>

                <div className="space-y-8">
                    {posts.map((post) => (
                        <article key={post.id} className="group">
                            <Link href={`/blogs/${post.slug}`}>
                                <div className="p-6 bg-card border border-border rounded-xl hover:border-primary hover:shadow-lg transition-all duration-300">
                                    {post.mainImage && (
                                        <div className="mb-4 rounded-lg overflow-hidden">
                                            <img
                                                src={post.mainImage}
                                                alt={post.title}
                                                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                    )}
                                    <h2 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                                        {post.title}
                                    </h2>
                                    {post.excerpt && (
                                        <p className="text-muted-foreground mb-4 line-clamp-2">
                                            {post.excerpt}
                                        </p>
                                    )}
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                                        </div>
                                        {post.readTime > 0 && (
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                <span>{post.readTime} min read</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        </article>
                    ))}
                </div>

                {posts.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">No posts in this category yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
