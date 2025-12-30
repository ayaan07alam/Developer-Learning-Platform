import { API_BASE_URL } from '@/lib/api-client';

export const revalidate = 3600;

async function fetchSlugs() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/posts?status=PUBLISHED`);
        if (!response.ok) return [];
        const posts = await response.json();
        return posts.map(post => ({
            slug: post.slug,
            category: post.category?.name?.toLowerCase() || 'general',
            updated_Date: new Date(post.updatedAt || post.publishedAt || Date.now())
        }));
    } catch (error) {
        console.error('Failed to fetch slugs for sitemap:', error);
        return [];
    }
}

export default async function sitemap() {
    const allSlugs = await fetchSlugs();
    const staticPages = [
        { url: 'https://www.runtimeriver.com/', lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
        { url: 'https://www.runtimeriver.com/about', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
        { url: 'https://www.runtimeriver.com/contact', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
        { url: 'https://www.runtimeriver.com/learn', lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
        { url: 'https://www.runtimeriver.com/roadmaps', lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
        { url: 'https://www.runtimeriver.com/tools', lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
        { url: 'https://www.runtimeriver.com/blogs', lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
        { url: 'https://www.runtimeriver.com/compiler', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
        { url: 'https://www.runtimeriver.com/privacy-policy', lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
        { url: 'https://www.runtimeriver.com/terms-of-service', lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
        // Add other static pages here
    ];
    return [
        ...staticPages,
        ...allSlugs.map(data => ({
            url: `https://www.runtimeriver.com/blogs/${data.slug}`, // Fixed URL structure to match blog route
            lastModified: data.updated_Date,
            changeFrequency: 'daily',
            priority: 0.8, // Slightly lower priority than main pages
        }))
    ]
}



