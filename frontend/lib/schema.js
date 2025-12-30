// Generate JSON-LD Schema markup for SEO
// Supports Article, Author, Breadcrumb, and Organization schemas

export function generateArticleSchema(post, siteUrl = 'https://www.runtimeriver.com') {
    const schema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": post.title,
        "description": post.excerpt || post.title,
        "image": post.mainImage ? [post.mainImage] : [],
        "datePublished": post.publishedAt || post.createdAt,
        "dateModified": post.updatedAt || post.createdAt,
        "author": {
            "@type": "Person",
            "name": post.author?.username || post.author?.email || "RuntimeRiver Team",
            "url": post.author ? `${siteUrl}/author/${post.author.slug || post.author.id}` : siteUrl
        },
        "publisher": {
            "@type": "Organization",
            "name": "RuntimeRiver",
            "logo": {
                "@type": "ImageObject",
                "url": `${siteUrl}/logo.png`
            }
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `${siteUrl}/blogs/${post.slug}`
        }
    };

    // Add categories as keywords
    if (post.categories && post.categories.length > 0) {
        schema.keywords = post.categories.map(cat => cat.title).join(', ');
    }

    // Add article section
    if (post.categories && post.categories.length > 0) {
        schema.articleSection = post.categories[0].title;
    }

    return schema;
}

export function generateBreadcrumbSchema(breadcrumbs, siteUrl = 'https://www.runtimeriver.com') {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumbs.map((crumb, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": crumb.name,
            "item": `${siteUrl}${crumb.path}`
        }))
    };
}

export function generateAuthorSchema(author, siteUrl = 'https://www.runtimeriver.com') {
    return {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": author.name || author.username,
        "url": `${siteUrl}/author/${author.slug || author.id}`,
        "image": author.image,
        "description": author.bio,
        "sameAs": author.socialLinks || []
    };
}

export function generateOrganizationSchema(siteUrl = 'https://www.runtimeriver.com') {
    return {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "RuntimeRiver",
        "url": siteUrl,
        "logo": `${siteUrl}/logo.png`,
        "description": "A modern tech blog covering programming, web development, and software engineering",
        "sameAs": [
            "https://twitter.com/RuntimeRiver",
            "https://github.com/RuntimeRiver",
            "https://linkedin.com/company/runtimeriver"
        ]
    };
}

export function generateWebsiteSchema(siteUrl = 'https://www.runtimeriver.com') {
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "RuntimeRiver",
        "url": siteUrl,
        "description": "Learn programming, web development, and software engineering",
        "potentialAction": {
            "@type": "SearchAction",
            "target": {
                "@type": "EntryPoint",
                "urlTemplate": `${siteUrl}/search?q={search_term_string}`
            },
            "query-input": "required name=search_term_string"
        }
    };
}

// Helper function to inject schema into page
export function injectSchema(schema) {
    if (typeof window === 'undefined') return null;

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

// Generate multiple schemas at once
export function generateBlogPostSchemas(post, siteUrl = 'https://www.runtimeriver.com') {
    const schemas = [];

    // Article schema
    schemas.push(generateArticleSchema(post, siteUrl));

    // Breadcrumb schema
    const breadcrumbs = [
        { name: 'Home', path: '/' },
        { name: 'Blogs', path: '/blogs' },
        { name: post.title, path: `/blogs/${post.slug}` }
    ];
    schemas.push(generateBreadcrumbSchema(breadcrumbs, siteUrl));

    // Organization schema
    schemas.push(generateOrganizationSchema(siteUrl));

    return schemas;
}
