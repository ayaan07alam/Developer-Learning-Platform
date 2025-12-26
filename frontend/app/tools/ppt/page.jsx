"use client";
import React from 'react';
import Head from 'next/head';
import { motion } from "framer-motion";
import { Presentation, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PPTToolsPage() {
    const pptTools = [
        {
            title: "PPT Compressor",
            description: "Compress PowerPoint presentations to reduce file size",
            color: 'from-orange-500 to-red-500',
            link: "/tools/ppt-compressor",
            available: true
        },
        {
            title: "PPT to PDF",
            description: "Convert PowerPoint presentations to PDF format",
            color: 'from-red-500 to-pink-500',
            link: "/tools/ppt-to-pdf",
            available: true
        },
        {
            title: "PDF to PPT",
            description: "Convert PDF files to editable PowerPoint",
            color: 'from-purple-500 to-pink-500',
            link: "/tools/pdf-to-ppt",
            available: true
        },
        {
            title: "PPT to Images",
            description: "Convert presentation slides to image files",
            color: 'from-yellow-500 to-orange-500',
            link: "/tools/ppt-to-images",
            available: true
        },
    ];

    return (
        <div className="min-h-screen pt-24 pb-12 bg-background">
            <Head>
                <title>Free PowerPoint Tools | Compress, Convert PPT Files</title>
                <meta name="description" content="Free PowerPoint tools to compress presentations, convert to PDF/images. No PowerPoint installation required." />
                <meta name="keywords" content="ppt compressor, ppt to pdf, powerpoint converter, presentation tools" />
                <meta property="og:title" content="Free PowerPoint Tools" />
                <meta property="og:description" content="Convert and optimize PowerPoint presentations" />
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
                    <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                        <Presentation className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold mb-4">PowerPoint Tools</h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Convert and optimize PowerPoint presentations
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {pptTools.map((tool, index) => (
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
                                    <Presentation className="w-7 h-7 text-white" />
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
