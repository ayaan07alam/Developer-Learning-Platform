"use client";
import React from 'react';
import Head from 'next/head';
import { motion } from "framer-motion";
import { Image as ImageIcon, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ImageToolsPage() {
    const imageTools = [
        {
            title: "Image Format Converter",
            description: "Convert images between PNG, JPG, WEBP formats",
            color: 'from-cyan-500 to-blue-500',
            link: "/tools/image-optimizer",
            available: true
        },
        {
            title: "Images to PNG",
            description: "Convert any image format to PNG",
            color: 'from-blue-500 to-indigo-500',
            link: "/tools/images-to-png",
            available: true
        },
        {
            title: "Images to JPG",
            description: "Convert images to JPG/JPEG format",
            color: 'from-green-500 to-emerald-500',
            link: "/tools/images-to-jpg",
            available: true
        },
        {
            title: "Images to WEBP",
            description: "Convert images to modern WEBP format",
            color: 'from-purple-500 to-pink-500',
            link: "/tools/images-to-webp",
            available: true
        },
        {
            title: "Upscale Images",
            description: "Increase image resolution using AI",
            color: 'from-yellow-500 to-orange-500',
            link: "/tools/upscale-images",
            available: true
        },
        {
            title: "Downscale Images",
            description: "Reduce image size while maintaining quality",
            color: 'from-red-500 to-orange-500',
            link: "/tools/downscale-images",
            available: true
        },
        {
            title: "Remove Background",
            description: "Remove image backgrounds automatically",
            color: 'from-teal-500 to-green-500',
            link: "/tools/remove-background",
            available: true
        },
        {
            title: "Watermark Images",
            description: "Add watermarks to protect your images",
            color: 'from-pink-500 to-rose-500',
            link: "/tools/watermark-images",
            available: true
        },
    ];

    return (
        <div className="min-h-screen pt-24 pb-12 bg-background">
            <Head>
                <title>Free Image Tools | Convert, Compress, Resize Images Online</title>
                <meta name="description" content="Free image tools to convert formats (PNG, JPG, WEBP), compress, resize, upscale, and remove backgrounds. Fast and easy." />
                <meta name="keywords" content="image converter, compress images, resize images, png to jpg, remove background, image tools" />
                <meta property="og:title" content="Free Image Converter & Optimization Tools" />
                <meta property="og:description" content="Convert, compress, and edit images online" />
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
                    <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <ImageIcon className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold mb-4">Image Tools</h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Convert, compress, upscale, and process images with powerful tools
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {imageTools.map((tool, index) => (
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
                                    <ImageIcon className="w-7 h-7 text-white" />
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
