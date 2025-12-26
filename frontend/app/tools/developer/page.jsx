"use client";
import React from 'react';
import { motion } from "framer-motion";
import { FileCode, ArrowLeft, Code, FileJson, Hash, Binary, Link2, Type, Palette, Key, QrCode, Diff, Settings } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DeveloperToolsPage() {
    const developerTools = [
        {
            title: "JSON Validator",
            description: "Validate, format, and minify JSON data",
            icon: FileJson,
            color: 'from-green-500 to-emerald-500',
            link: "/tools/json-validator",
            available: true
        },
        {
            title: "Code Formatter",
            description: "Beautify JavaScript, JSON, HTML, CSS",
            icon: Code,
            color: 'from-blue-500 to-cyan-500',
            link: "/tools/code-formatter",
            available: true
        },
        {
            title: "Hash Generator",
            description: "Generate MD5, SHA-1, SHA-256, SHA-512",
            icon: Hash,
            color: 'from-red-500 to-orange-500',
            link: "/tools/hash-generator",
            available: true
        },
        {
            title: "Base64 Encoder/Decoder",
            description: "Encode and decode Base64 strings",
            icon: Binary,
            color: 'from-violet-500 to-purple-500',
            link: "/tools/base64",
            available: true
        },
        {
            title: "URL Encoder/Decoder",
            description: "Safely encode and decode URLs",
            icon: Link2,
            color: 'from-blue-500 to-indigo-500',
            link: "/tools/url-encoder",
            available: true
        },
        {
            title: "Case Converter",
            description: "Convert text between different cases",
            icon: Type,
            color: 'from-teal-500 to-green-500',
            link: "/tools/case-converter",
            available: true
        },
        {
            title: "Color Picker",
            description: "Pick colors and convert formats",
            icon: Palette,
            color: 'from-pink-500 to-rose-500',
            link: "/tools/color-picker",
            available: true
        },
        {
            title: "Password Generator",
            description: "Generate secure random passwords",
            icon: Key,
            color: 'from-yellow-500 to-orange-500',
            link: "/tools/password-generator",
            available: true
        },
        {
            title: "QR Code Generator",
            description: "Create QR codes instantly",
            icon: QrCode,
            color: 'from-indigo-500 to-purple-500',
            link: "/tools/qr-generator",
            available: true
        },
        {
            title: "Regex Tester",
            description: "Test regular expressions live",
            icon: Settings,
            color: 'from-purple-500 to-pink-500',
            link: "/tools/regex-tester",
            available: true
        },
        {
            title: "Diff Checker",
            description: "Compare text differences",
            icon: Diff,
            color: 'from-orange-500 to-red-500',
            link: "/tools/diff-checker",
            available: true
        },
        {
            title: "Markdown Preview",
            description: "Preview markdown with live rendering",
            icon: FileCode,
            color: 'from-gray-600 to-gray-800',
            link: "/tools/markdown-preview",
            available: true
        },
    ];

    return (
        <div className="min-h-screen pt-24 pb-12 bg-background">
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
                    <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                        <FileCode className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold mb-4">Developer Tools</h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Code utilities and developer productivity tools
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {developerTools.map((tool, index) => {
                        const Icon = tool.icon;
                        return (
                            <Link key={index} href={tool.link}>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                    whileHover={{ y: -5 }}
                                    className="group p-8 rounded-2xl bg-card border border-border hover:border-primary/50 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer relative"
                                >
                                    {!tool.available && (
                                        <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-600 text-xs font-semibold">
                                            Coming Soon
                                        </div>
                                    )}

                                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                        <Icon className="w-7 h-7 text-white" />
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
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
