import { fetchSlugs } from '@/lib/utils'

export const revalidate = 3600;

export default async function sitemap() {
    const allSlugs = await fetchSlugs();
    const staticPages = [
        { url: 'https://www.intelforgeeks.com/', lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
        { url: 'https://www.intelforgeeks.com/about', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
        { url: 'https://www.intelforgeeks.com/contact', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
        { url: 'https://www.intelforgeeks.com/learn', lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
        { url: 'https://www.intelforgeeks.com/roadmaps', lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
        { url: 'https://www.intelforgeeks.com/tools', lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
        { url: 'https://www.intelforgeeks.com/blogs', lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
        { url: 'https://www.intelforgeeks.com/privacy-policy', lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
        { url: 'https://www.intelforgeeks.com/terms-of-service', lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
        // Add other static pages here
    ];
    return [
        ...staticPages,
        ...allSlugs.map(data => ({
            url: `https://www.intelforgeeks.com/learn/${data.category}/${data.slug}`,
            lastModified: data.updated_Date,
            changeFrequency: 'daily',
            priority: 1,
        }))
    ]
}



