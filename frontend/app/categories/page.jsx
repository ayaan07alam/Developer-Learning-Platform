"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Folder, FileText } from 'lucide-react';
import { API_BASE_URL } from '@/lib/api-client';

export default function CategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/categories`);
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-24 pb-12">
                <div className="container mx-auto px-6">
                    <div className="text-center">Loading categories...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12">
            <div className="container mx-auto px-6 max-w-6xl">
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Categories</h1>
                    <p className="text-lg text-muted-foreground">
                        Browse posts by category
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            href={`/categories/${category.slug}`}
                            className="group"
                        >
                            <div className="h-full p-6 bg-card border border-border rounded-xl hover:border-primary hover:shadow-lg transition-all duration-300">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                                        <Folder className="w-6 h-6 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                                            {category.name}
                                        </h3>
                                        {category.description && (
                                            <p className="text-sm text-muted-foreground mb-3">
                                                {category.description}
                                            </p>
                                        )}
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <FileText className="w-4 h-4" />
                                            <span>{category.postCount} {category.postCount === 1 ? 'post' : 'posts'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {categories.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">No categories found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
