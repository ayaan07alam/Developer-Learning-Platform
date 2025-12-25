"use client";
import Script from 'next/script';

export default function SchemaMarkup({ post, faqs = [] }) {
    // Article Schema
    const articleSchema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "description": post.excerpt || post.metaDescription,
        "image": post.featuredImage || post.mainImage,
        "datePublished": post.publishedAt || post.createdAt,
        "dateModified": post.updatedAt,
        "author": {
            "@type": "Person",
            "name": post.author?.name || post.createdBy?.username || "Anonymous",
            "email": post.author?.email || post.createdBy?.email
        },
        "publisher": {
            "@type": "Organization",
            "name": "IntelliGeek",
            "logo": {
                "@type": "ImageObject",
                "url": `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/logo.png`
            }
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/blogs/${post.slug}`
        }
    };

    // FAQ Schema (if FAQs exist)
    const faqSchema = faqs.length > 0 ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    } : null;

    // Breadcrumb Schema
    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Blogs",
                "item": `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/blogs`
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": post.title,
                "item": `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/blogs/${post.slug}`
            }
        ]
    };

    return (
        <>
            {/* Article Schema */}
            <Script
                id="article-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
            />

            {/* FAQ Schema */}
            {faqSchema && (
                <Script
                    id="faq-schema"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
                />
            )}

            {/* Breadcrumb Schema */}
            <Script
                id="breadcrumb-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
        </>
    );
}
