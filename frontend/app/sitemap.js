import { API_BASE_URL } from '@/lib/api-client';
import { parseApiDate } from '@/lib/seo-utils';

export const revalidate = 3600;

async function fetchSlugs() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/posts?status=PUBLISHED`, {
            next: { revalidate: 3600 },
        });
        if (!response.ok) return [];
        const posts = await response.json();
        if (!Array.isArray(posts)) return [];
        return posts
            .filter((post) => post?.slug)
            .map((post) => ({
                slug: post.slug,
                category: post.categories?.[0]?.name?.toLowerCase() || 'general',
                updated_Date: parseApiDate(post.updatedAt || post.publishedAt) || new Date(),
            }));
    } catch (error) {
        console.error('Failed to fetch slugs for sitemap:', error);
        return [];
    }
}

async function fetchCategories() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/categories`, {
            next: { revalidate: 3600 },
        });
        if (!response.ok) return [];
        const data = await response.json();
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error('Failed to fetch categories for sitemap:', error);
        return [];
    }
}

export default async function sitemap() {
    try {
    const allSlugs = await fetchSlugs();
    const categories = await fetchCategories();

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
    ];
    return [
        ...staticPages,
        ...allSlugs.map(data => ({
            url: `https://www.runtimeriver.com/blogs/${data.slug}`,
            lastModified: data.updated_Date,
            changeFrequency: 'daily',
            priority: 0.8,
        })),
        ...categories
            .filter((cat) => cat?.slug)
            .map(cat => ({
            url: `https://www.runtimeriver.com/categories/${cat.slug}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        }))
    ];
    } catch (error) {
        console.error('Sitemap generation failed:', error);
        return [
            { url: 'https://www.runtimeriver.com/', lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
            { url: 'https://www.runtimeriver.com/blogs', lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
        ];
    }
}
