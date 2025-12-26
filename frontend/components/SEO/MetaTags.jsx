import Head from 'next/head';

/**
 * Reusable SEO MetaTags Component
 * Generates all necessary meta tags for SEO
 */
export default function MetaTags({
    title,
    description,
    keywords,
    image,
    url,
    type = 'website',
    author,
    publishedTime,
    modifiedTime,
    section,
    noindex = false
}) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourwebsite.com';
    const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
    const ogImage = image || `${siteUrl}/og-default.png`;
    const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Your Website';

    return (
        <Head>
            {/* Primary Meta Tags */}
            <title>{title}</title>
            <meta name="title" content={title} />
            <meta name="description" content={description} />
            {keywords && <meta name="keywords" content={keywords} />}
            {author && <meta name="author" content={author} />}

            {/* Robots */}
            {noindex ? (
                <meta name="robots" content="noindex, nofollow" />
            ) : (
                <meta name="robots" content="index, follow" />
            )}

            {/* Canonical URL */}
            <link rel="canonical" href={fullUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={fullUrl} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={ogImage} />
            <meta property="og:site_name" content={siteName} />
            {publishedTime && <meta property="article:published_time" content={publishedTime} />}
            {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
            {section && <meta property="article:section" content={section} />}

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={fullUrl} />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={ogImage} />

            {/* Additional SEO */}
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        </Head>
    );
}

/**
 * Generate structured data for BlogPosting
 */
export function BlogPostingSchema({ post, author, siteUrl }) {
    const schema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "description": post.excerpt || post.content?.substring(0, 160),
        "image": post.featuredImage || `${siteUrl}/default-blog.png`,
        "datePublished": post.publishedAt,
        "dateModified": post.updatedAt || post.publishedAt,
        "author": {
            "@type": "Person",
            "name": author?.name || "Admin",
            "url": author?.profileUrl
        },
        "publisher": {
            "@type": "Organization",
            "name": process.env.NEXT_PUBLIC_SITE_NAME || "Your Website",
            "logo": {
                "@type": "ImageObject",
                "url": `${siteUrl}/logo.png`
            }
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `${siteUrl}/blog/${post.slug}`
        }
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

/**
 * Generate structured data for JobPosting
 */
export function JobPostingSchema({ job, company, siteUrl }) {
    const schema = {
        "@context": "https://schema.org",
        "@type": "JobPosting",
        "title": job.title,
        "description": job.description,
        "datePosted": job.postedAt,
        "validThrough": job.deadline,
        "employmentType": job.employmentType || "FULL_TIME",
        "hiringOrganization": {
            "@type": "Organization",
            "name": company?.name || "Company Name",
            "sameAs": company?.website,
            "logo": company?.logo || `${siteUrl}/logo.png`
        },
        "jobLocation": {
            "@type": "Place",
            "address": {
                "@type": "PostalAddress",
                "addressLocality": job.location?.city,
                "addressRegion": job.location?.state,
                "addressCountry": job.location?.country
            }
        },
        "baseSalary": job.salary ? {
            "@type": "MonetaryAmount",
            "currency": "USD",
            "value": {
                "@type": "QuantitativeValue",
                "value": job.salary.amount,
                "unitText": job.salary.period || "YEAR"
            }
        } : undefined
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

/**
 * Generate Organization schema (for homepage or footer)
 */
export function OrganizationSchema({ siteUrl, companyInfo }) {
    const schema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": companyInfo?.name || process.env.NEXT_PUBLIC_SITE_NAME,
        "url": siteUrl,
        "logo": `${siteUrl}/logo.png`,
        "description": companyInfo?.description,
        "email": companyInfo?.email,
        "telephone": companyInfo?.phone,
        "address": companyInfo?.address ? {
            "@type": "PostalAddress",
            "streetAddress": companyInfo.address.street,
            "addressLocality": companyInfo.address.city,
            "addressRegion": companyInfo.address.state,
            "postalCode": companyInfo.address.zip,
            "addressCountry": companyInfo.address.country
        } : undefined,
        "sameAs": companyInfo?.socialMedia || []
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

/**
 * Generate BreadcrumbList schema
 */
export function BreadcrumbSchema({ breadcrumbs, siteUrl }) {
    const schema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumbs.map((crumb, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": crumb.name,
            "item": `${siteUrl}${crumb.url}`
        }))
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
