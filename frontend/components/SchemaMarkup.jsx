"use client";
import Script from 'next/script';
import { parseApiDate } from '@/lib/seo-utils';

export default function SchemaMarkup({ post, faqs = [] }) {
    // Article Schema
    const articleSchema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "description": post.excerpt || post.metaDescription,
        "image": post.featuredImage || post.mainImage,
        "datePublished": parseApiDate(post.publishedAt || post.createdAt)?.toISOString(),
        "dateModified": parseApiDate(post.updatedAt || post.publishedAt || post.createdAt)?.toISOString(),
        "author": {
            "@type": "Person",
            "name": post.author?.name || post.createdBy?.displayName || "Anonymous",
            "email": post.author?.email || post.createdBy?.email
        },
        "publisher": {
            "@type": "Organization",
            "name": "RuntimeRiver",
            "logo": {
                "@type": "ImageObject",
                "url": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.runtimeriver.com'}/logo.png`
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
