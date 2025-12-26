export const toolsMetadata = {
    // Main Tools Page
    tools: {
        title: "Free Developer Tools & File Converters | PDF, Image, Code Tools",
        description: "Access 39+ free online tools for developers. Convert files, optimize images, compress PDFs, format code, and more. No signup required.",
        keywords: "developer tools, file converter, pdf tools, image converter, code formatter, online tools",
        openGraph: {
            title: "Free Developer Tools & File Converters",
            description: "39+ free online tools for file conversion, code formatting, and development utilities",
            type: "website"
        }
    },

    // Category Pages
    pdf: {
        title: "Free PDF Tools Online | Compress, Convert, Merge PDF Files",
        description: "Free online PDF tools to compress, convert to Word, merge, split PDFs. Fast, secure, and no signup required.",
        keywords: "pdf compressor, pdf to word, merge pdf, split pdf, pdf converter, online pdf tools",
        openGraph: {
            title: "Free PDF Tools - Compress, Convert & Merge PDFs",
            description: "Powerful PDF tools for compression, conversion, and manipulation",
            type: "website"
        }
    },

    word: {
        title: "Free Word Document Tools | Compress, Convert DOCX Files",
        description: "Free online Word tools to compress documents, convert to PDF/HTML, and merge files. No software installation needed.",
        keywords: "word compressor, word to pdf, docx converter, merge word files, word tools",
        openGraph: {
            title: "Free Word Document Tools",
            description: "Convert, compress, and manipulate Word documents online",
            type: "website"
        }
    },

    excel: {
        title: "Free Excel Tools Online | Compress, Convert Spreadsheets",
        description: "Free Excel tools to compress, convert to PDF/CSV. Work with spreadsheets online without Excel installed.",
        keywords: "excel compressor, excel to pdf, excel to csv, csv to excel, spreadsheet tools",
        openGraph: {
            title: "Free Excel & Spreadsheet Tools",
            description: "Convert and process Excel files online",
            type: "website"
        }
    },

    ppt: {
        title: "Free PowerPoint Tools | Compress, Convert PPT Files",
        description: "Free PowerPoint tools to compress presentations, convert to PDF/images. No PowerPoint installation required.",
        keywords: "ppt compressor, ppt to pdf, powerpoint converter, presentation tools",
        openGraph: {
            title: "Free PowerPoint Tools",
            description: "Convert and optimize PowerPoint presentations",
            type: "website"
        }
    },

    images: {
        title: "Free Image Tools | Convert, Compress, Resize Images Online",
        description: "Free image tools to convert formats (PNG, JPG, WEBP), compress, resize, upscale, and remove backgrounds. Fast and easy.",
        keywords: "image converter, compress images, resize images, png to jpg, remove background, image tools",
        openGraph: {
            title: "Free Image Converter & Optimization Tools",
            description: "Convert, compress, and edit images online",
            type: "website"
        }
    },

    developer: {
        title: "Free Developer Tools | JSON, Code Formatter, Hash Generator",
        description: "Essential developer tools: JSON validator, code formatter, hash generator, Base64 encoder, regex tester, and more.",
        keywords: "json validator, code formatter, hash generator, base64 encoder, developer tools, programming tools",
        openGraph: {
            title: "Free Developer & Programming Tools",
            description: "Essential tools for developers and programmers",
            type: "website"
        }
    },

    // Individual Tool Pages
    'pdf-compressor': {
        title: "Free PDF Compressor | Reduce PDF File Size Online",
        description: "Compress PDF files online for free. Reduce PDF size while maintaining quality. Fast, secure, no upload limits.",
        keywords: "compress pdf, reduce pdf size, pdf compressor, optimize pdf"
    },

    'pdf-to-word': {
        title: "PDF to Word Converter | Convert PDF to DOCX Free",
        description: "Convert PDF to editable Word documents (DOCX) online for free. Preserve formatting and layout.",
        keywords: "pdf to word, pdf to docx, convert pdf, pdf converter"
    },

    'word-to-pdf': {
        title: "Word to PDF Converter | Convert DOCX to PDF Free",
        description: "Convert Word documents to PDF online for free. Maintain formatting and quality.",
        keywords: "word to pdf, docx to pdf, convert word, document converter"
    },

    'image-optimizer': {
        title: "Image Format Converter | Convert PNG, JPG, WEBP Free",
        description: "Convert images between formats online. Support for PNG, JPG, JPEG, WEBP. Fast and free.",
        keywords: "image converter, png to jpg, jpg to png, webp converter, image format converter"
    },

    'json-validator': {
        title: "JSON Validator & Formatter | Validate JSON Online Free",
        description: "Validate, format, and minify JSON online. Free JSON validator with syntax highlighting.",
        keywords: "json validator, json formatter, validate json, json syntax checker"
    },

    'code-formatter': {
        title: "Code Formatter | Beautify JavaScript, HTML, CSS Online",
        description: "Format and beautify code online. Support for JavaScript, JSON, HTML, CSS. Free code formatter.",
        keywords: "code formatter, beautify code, format javascript, format html, format css"
    },

    'hash-generator': {
        title: "Hash Generator | MD5, SHA-1, SHA-256, SHA-512 Online",
        description: "Generate MD5, SHA-1, SHA-256, SHA-512 hashes online. Free hash calculator.",
        keywords: "hash generator, md5 generator, sha256 generator, hash calculator"
    },

    'qr-generator': {
        title: "QR Code Generator | Create QR Codes Free Online",
        description: "Generate QR codes online for free. Download as PNG image. Fast and easy QR code creator.",
        keywords: "qr code generator, create qr code, qr code maker, generate qr"
    }
};

export function generateToolMetadata(toolKey, baseUrl = 'https://yourwebsite.com') {
    const meta = toolsMetadata[toolKey] || toolsMetadata.tools;

    return {
        title: meta.title,
        description: meta.description,
        keywords: meta.keywords,
        openGraph: {
            title: meta.openGraph?.title || meta.title,
            description: meta.openGraph?.description || meta.description,
            type: meta.openGraph?.type || 'website',
            url: `${baseUrl}/tools/${toolKey === 'tools' ? '' : toolKey}`,
            siteName: 'Developer Tools',
            images: [{
                url: `${baseUrl}/og-image.png`,
                width: 1200,
                height: 630,
                alt: meta.openGraph?.title || meta.title
            }]
        },
        twitter: {
            card: 'summary_large_image',
            title: meta.openGraph?.title || meta.title,
            description: meta.openGraph?.description || meta.description,
            images: [`${baseUrl}/og-image.png`]
        },
        alternates: {
            canonical: `${baseUrl}/tools/${toolKey === 'tools' ? '' : toolKey}`
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1
            }
        }
    };
}

export function generateToolJSONLD(toolData) {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: toolData.name,
        description: toolData.description,
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Any',
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD'
        },
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.8',
            ratingCount: '1250'
        }
    };
}
