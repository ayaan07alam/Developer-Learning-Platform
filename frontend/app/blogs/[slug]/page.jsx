import React from 'react';
import { API_BASE_URL } from '@/lib/api-client';
import { parseApiDate } from '@/lib/seo-utils';
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

        const data = await res.json();
        return data;
    } catch (error) {
        console.error('Error fetching post:', error);
        return null;
    }
}

// Generate Metadata for SEO
export async function generateMetadata({ params }) {
    try {
        const post = await getPost(params.slug);

        if (!post) {
            return {
                title: 'Article Not Found | RuntimeRiver',
                description: 'The requested article could not be found.'
            };
        }

        const metaTitle = post.metaTitle ? `${post.metaTitle} | RuntimeRiver` : `${post.title} | RuntimeRiver`;
        const metaDescription = post.metaDescription
            || post.excerpt
            || (typeof post.smallDescription === 'string' ? post.smallDescription.slice(0, 160) : null)
            || `Read ${post.title} on RuntimeRiver.`;
        const publishedDate = parseApiDate(post.publishedAt || post.createdAt);

        return {
            title: metaTitle,
            description: metaDescription,
            keywords: post.tags || ['tech blog', 'programming', 'software development'],
            openGraph: {
                title: metaTitle,
                description: metaDescription,
                type: 'article',
                url: `https://www.runtimeriver.com/blogs/${params.slug}`,
                images: [
                    {
                        url: post.mainImage || 'https://www.runtimeriver.com/og-default.jpg',
                        width: 1200,
                        height: 630,
                        alt: post.title,
                    },
                ],
                publishedTime: publishedDate?.toISOString(),
                authors: [post.createdBy?.displayName || 'RuntimeRiver Team'],
                tags: post.tags,
            },
            twitter: {
                card: 'summary_large_image',
                title: metaTitle,
                description: metaDescription,
                images: [post.mainImage || 'https://www.runtimeriver.com/og-default.jpg'],
            }
        };
    } catch (error) {
        console.error('Error generating blog metadata:', error);
        return {
            title: 'RuntimeRiver Blog',
            description: 'Read the latest articles on RuntimeRiver.'
        };
    }
}

export default async function BlogPostPage({ params }) {
    const post = await getPost(params.slug);

    return <BlogClient initialPost={post} />;
}
