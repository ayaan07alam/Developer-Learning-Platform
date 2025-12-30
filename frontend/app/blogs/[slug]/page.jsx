import React from 'react';
import { API_BASE_URL } from '@/lib/api-client';
import BlogClient from './BlogClient';

// Fetch data on the server
async function getPost(slug) {
    try {
        const res = await fetch(`${API_BASE_URL}/api/posts/slug/${slug}`, {
            next: { revalidate: 60 } // Revalidate every minute
        });

        if (!res.ok) {
            if (res.status === 404) return null;
            console.error(`Failed to fetch post. Status: ${res.status}`);
            return null;
        }

        return res.json();
    } catch (error) {
        console.error('Error fetching post:', error);
        return null;
    }
}

// Generate Metadata for SEO
export async function generateMetadata({ params }) {
    const post = await getPost(params.slug);

    if (!post) {
        return {
            title: 'Article Not Found | RuntimeRiver',
            description: 'The requested article could not be found.'
        };
    }

    const metaTitle = post.metaTitle ? `${post.metaTitle} | RuntimeRiver` : `${post.title} | RuntimeRiver`;
    const metaDescription = post.metaDescription || post.excerpt || post.smallDescription?.slice(0, 160) || `Read ${post.title} on RuntimeRiver.`;

    return {
        title: metaTitle,
        description: metaDescription,
        keywords: post.tags || ['tech blog', 'programming', 'software development'],
        openGraph: {
            title: metaTitle,
            description: metaDescription,
            type: 'article',
            url: `https://www.runtimeriver.dev/blogs/${params.slug}`,
            images: [
                {
                    url: post.mainImage || 'https://www.runtimeriver.dev/og-default.jpg',
                    width: 1200,
                    height: 630,
                    alt: post.title,
                },
            ],
            publishedTime: post.publishedAt || post.createdAt,
            authors: [post.createdBy?.displayName || 'RuntimeRiver Team'],
            tags: post.tags,
        },
        twitter: {
            card: 'summary_large_image',
            title: metaTitle,
            description: metaDescription,
            images: [post.mainImage || 'https://www.runtimeriver.dev/og-default.jpg'],
        }
    };
}

export default async function BlogPostPage({ params }) {
    const post = await getPost(params.slug);

    return <BlogClient initialPost={post} />;
}
