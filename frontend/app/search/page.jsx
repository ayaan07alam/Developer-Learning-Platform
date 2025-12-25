"use client";
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, Calendar, User, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SearchPage() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (query) {
            searchBlogs(query);
        } else {
            setLoading(false);
        }
    }, [query]);

    const searchBlogs = async (searchQuery) => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:8080/api/posts/search?q=${encodeURIComponent(searchQuery)}`);
            if (response.ok) {
                const data = await response.json();
                setResults(data);
            }
        } catch (error) {
            console.error('Search error:', error);
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

    return (
        <div className="min-h-screen pt-32 pb-20">
            <div className="container mx-auto px-6">
                {/* Search Header */}
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-4">
                        <Search className="w-8 h-8 text-primary" />
                        <h1 className="text-4xl md:text-5xl font-bold">Search Results</h1>
                    </div>
                    {query && (
                        <p className="text-lg text-muted-foreground">
                            Showing results for: <span className="text-primary font-semibold">"{query}"</span>
                        </p>
                    )}
                    {!loading && (
                        <p className="text-sm text-muted-foreground mt-2">
                            Found {results.length} {results.length === 1 ? 'result' : 'results'}
                        </p>
                    )}
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                )}

                {/* No Query */}
                {!query && !loading && (
                    <div className="text-center py-20">
                        <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <h2 className="text-2xl font-bold mb-2">No search query</h2>
                        <p className="text-muted-foreground mb-6">Please enter a search term to find blogs</p>
                        <Link href="/blogs">
                            <Button>
                                Browse All Blogs
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </Link>
                    </div>
                )}

                {/* No Results */}
                {query && !loading && results.length === 0 && (
                    <div className="text-center py-20">
                        <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <h2 className="text-2xl font-bold mb-2">No results found</h2>
                        <p className="text-muted-foreground mb-6">
                            We couldn't find any blogs matching "{query}". Try different keywords.
                        </p>
                        <Link href="/blogs">
                            <Button>
                                Browse All Blogs
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </Link>
                    </div>
                )}

                {/* Results Grid */}
                {!loading && results.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {results.map((post) => (
                            <Link
                                key={post.id}
                                href={`/blogs/${post.slug}`}
                                className="group block"
                            >
                                <div className="h-full bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10">
                                    {/* Featured Image */}
                                    {post.mainImage && (
                                        <div className="relative h-48 overflow-hidden">
                                            <img
                                                src={post.mainImage}
                                                alt={post.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                                        </div>
                                    )}

                                    {/* Content */}
                                    <div className="p-6">
                                        {/* Categories */}
                                        {post.categories && post.categories.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mb-3">
                                                {post.categories.slice(0, 2).map((category) => (
                                                    <span
                                                        key={category.id}
                                                        className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20"
                                                    >
                                                        {category.title}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        {/* Title */}
                                        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                                            {post.title}
                                        </h3>

                                        {/* Excerpt */}
                                        {post.excerpt && (
                                            <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                                                {post.excerpt}
                                            </p>
                                        )}

                                        {/* Meta */}
                                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                <span>{formatDate(post.createdAt)}</span>
                                            </div>
                                            {post.author && (
                                                <div className="flex items-center gap-1">
                                                    <User className="w-3 h-3" />
                                                    <span>{post.author.username || post.author.email}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
