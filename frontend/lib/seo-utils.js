/**
 * SEO Utility Functions
 */

/**
 * Generate URL-friendly slug from text
 */
export function generateSlug(text) {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/--+/g, '-') // Replace multiple hyphens with single
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Truncate text to specified length with ellipsis
 */
export function truncateText(text, maxLength = 160) {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
}

/**
 * Extract meta description from HTML content
 */
export function extractDescription(htmlContent, maxLength = 160) {
    if (!htmlContent) return '';

    // Remove HTML tags
    const textOnly = htmlContent.replace(/<[^>]*>/g, ' ');

    // Remove extra whitespace
    const cleaned = textOnly.replace(/\s+/g, ' ').trim();

    return truncateText(cleaned, maxLength);
}

/**
 * Extract keywords from content
 */
export function extractKeywords(text, maxKeywords = 10) {
    if (!text) return [];

    // Common stop words to exclude
    const stopWords = new Set([
        'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
        'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'be',
        'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will',
        'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that',
        'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they'
    ]);

    // Extract words
    const words = text
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter(word => word.length > 3 && !stopWords.has(word));

    // Count frequency
    const frequency = {};
    words.forEach(word => {
        frequency[word] = (frequency[word] || 0) + 1;
    });

    // Sort by frequency and return top keywords
    return Object.entries(frequency)
        .sort((a, b) => b[1] - a[1])
        .slice(0, maxKeywords)
        .map(([word]) => word);
}

/**
 * Generate canonical URL
 */
export function getCanonicalUrl(path) {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourwebsite.com';
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${baseUrl}${cleanPath}`;
}

/**
 * Build breadcrumb path
 */
export function buildBreadcrumbs(pathname) {
    const paths = pathname.split('/').filter(Boolean);
    const breadcrumbs = [{ name: 'Home', url: '/' }];

    let currentPath = '';
    paths.forEach((path, index) => {
        currentPath += `/${path}`;
        const name = path
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

        breadcrumbs.push({
            name,
            url: currentPath
        });
    });

    return breadcrumbs;
}

/**
 * Format date for schema markup
 */
export function formatSchemaDate(date) {
    if (!date) return new Date().toISOString();
    return new Date(date).toISOString();
}

/**
 * Get reading time estimate
 */
export function getReadingTime(text) {
    if (!text) return 0;
    const wordsPerMinute = 200;
    const words = text.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
}

/**
 * Generate page title with site name
 */
export function generatePageTitle(pageTitle, includeSiteName = true) {
    const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Your Website';

    if (!includeSiteName) return pageTitle;

    // Ensure title is not too long (max 60 chars recommended)
    const maxLength = 60;
    const separator = ' | ';
    const titleWithSite = `${pageTitle}${separator}${siteName}`;

    if (titleWithSite.length <= maxLength) {
        return titleWithSite;
    }

    // Truncate page title if too long
    const availableLength = maxLength - separator.length - siteName.length;
    const truncatedTitle = truncateText(pageTitle, availableLength);
    return `${truncatedTitle}${separator}${siteName}`;
}

/**
 * Validate and clean meta description
 */
export function cleanMetaDescription(description) {
    if (!description) return '';

    // Remove HTML entities
    let cleaned = description.replace(/&[^;]+;/g, ' ');

    // Remove extra whitespace
    cleaned = cleaned.replace(/\s+/g, ' ').trim();

    // Ensure proper length (150-160 chars)
    return truncateText(cleaned, 160);
}

/**
 * Generate Open Graph image URL
 */
export function getOgImage(imagePath) {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourwebsite.com';

    if (!imagePath) return `${baseUrl}/og-default.png`;

    // If already full URL
    if (imagePath.startsWith('http')) return imagePath;

    // If relative path
    const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    return `${baseUrl}${cleanPath}`;
}

/**
 * Check if URL should be indexed
 */
export function shouldIndex(pathname) {
    const noIndexPaths = [
        '/admin',
        '/dashboard',
        '/api',
        '/login',
        '/register',
        '/apply',
        '/thank-you'
    ];

    return !noIndexPaths.some(path => pathname.startsWith(path));
}

/**
 * SEO-friendly date formatter
 */
export function formatSeoDate(date) {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}
