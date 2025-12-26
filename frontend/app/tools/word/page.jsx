"use client";
import React from 'react';
import Head from 'next/head';
import { motion } from "framer-motion";
import { FileText, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function WordToolsPage() {
    const wordTools = [
        {
            title: "Word Compressor",
            description: "Reduce Word document file size efficiently",
            color: 'from-green-500 to-emerald-500',
            link: "/tools/word-compressor",
            available: true
        },
        {
            title: "Word to PDF",
            description: "Convert Word documents to PDF format",
            color: 'from-blue-500 to-indigo-500',
            link: "/tools/word-to-pdf",
            available: true
        },
        {
            title: "PDF to Word",
            description: "Convert PDF to editable Word documents",
            color: 'from-purple-500 to-pink-500',
            link: "/tools/pdf-to-word",
            available: true
        },
        {
            title: "Merge Word Files",
            description: "Combine multiple Word documents into one",
            color: 'from-yellow-500 to-orange-500',
            link: "/tools/merge-word",
            available: true
        },
        {
            title: "Word to HTML",
            description: "Convert Word documents to HTML format",
            color: 'from-cyan-500 to-blue-500',
            link: "/tools/word-to-html",
            available: true
        },
    ];

    return (
        <div className="min-h-screen pt-24 pb-12 bg-background">
            <Head>
                <title>Free Word Document Tools | Compress, Convert DOCX Files</title>
                <meta name="description" content="Free online Word tools to compress documents, convert to PDF/HTML, and merge files. No software installation needed." />
                <meta name="keywords" content="word compressor, word to pdf, docx converter, merge word files, word tools" />
                <meta property="og:title" content="Free Word Document Tools" />
                <meta property="og:description" content="Convert, compress, and manipulate Word documents online" />
                <meta property="og:type" content="website" />
            </Head>
            <div className="container mx-auto px-6">
                <Link href="/tools">
                    <Button variant="ghost" className="mb-8">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Categories
                    </Button>
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                        <FileText className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold mb-4">Word Tools</h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Work with Word documents - compress, convert, and manipulate DOCX files
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {wordTools.map((tool, index) => (
                        <Link key={index} href={tool.link}>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -5 }}
                                className="group p-8 rounded-2xl bg-card border border-border hover:border-primary/50 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer relative"
                            >
                                {!tool.available && (
                                    <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-600 text-xs font-semibold">
                                        Coming Soon
                                    </div>
                                )}

                                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                    <FileText className="w-7 h-7 text-white" />
                                </div>

                                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                                    {tool.title}
                                </h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    {tool.description}
                                </p>
                                <span className="text-sm font-semibold text-primary opacity-80 group-hover:opacity-100">
                                    {tool.available ? 'Try Now →' : 'Coming Soon'}
                                </span>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
