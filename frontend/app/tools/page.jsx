"use client";
import React from 'react';
import { motion } from "framer-motion";
import { FileText, FileCode, Image as ImageIcon, Presentation, Table } from "lucide-react";
import Link from "next/link";

const ToolsHomePage = () => {
  const categories = [
    {
      id: 'pdf',
      name: 'PDF Tools',
      description: 'Compress, convert, and manipulate PDF files',
      icon: FileText,
      color: 'from-red-500 to-orange-500',
      toolCount: 6,
      link: '/tools/pdf'
    },
    {
      id: 'word',
      name: 'Word Tools',
      description: 'Work with Word documents efficiently',
      icon: FileText,
      color: 'from-blue-500 to-indigo-500',
      toolCount: 5,
      link: '/tools/word'
    },
    {
      id: 'excel',
      name: 'Excel Tools',
      description: 'Process and convert Excel spreadsheets',
      icon: Table,
      color: 'from-green-500 to-emerald-500',
      toolCount: 4,
      link: '/tools/excel'
    },
    {
      id: 'ppt',
      name: 'PowerPoint Tools',
      description: 'Convert and optimize presentations',
      icon: Presentation,
      color: 'from-orange-500 to-red-500',
      toolCount: 4,
      link: '/tools/ppt'
    },
    {
      id: 'images',
      name: 'Image Tools',
      description: 'Convert, compress, and process images',
      icon: ImageIcon,
      color: 'from-purple-500 to-pink-500',
      toolCount: 8,
      link: '/tools/images'
    },
    {
      id: 'developer',
      name: 'Developer Tools',
      description: 'Code utilities and developer helpers',
      icon: FileCode,
      color: 'from-cyan-500 to-blue-500',
      toolCount: 12,
      link: '/tools/developer'
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 bg-background relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            Tools & Utilities
          </h1>
          <p className="text-muted-foreground text-xl">
            Professional file conversion, image processing, and developer utilities.
            Free, fast, and secure – all processing happens in your browser.
          </p>
        </motion.div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <Link key={category.id} href={category.link}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group relative p-8 rounded-3xl bg-card border-2 border-border/50 hover:border-primary/50 shadow-xl hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 cursor-pointer overflow-hidden"
                >
                  {/* Gradient Background on Hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                  {/* Icon */}
                  <div className={`relative w-20 h-20 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <Icon className="w-10 h-10 text-white" />
                  </div>

                  {/* Content */}
                  <div className="relative">
                    <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {category.description}
                    </p>

                    {/* Tool Count Badge */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {category.toolCount} tools available
                      </span>
                      <span className="inline-flex items-center text-sm font-semibold text-primary opacity-80 group-hover:opacity-100 group-hover:translate-x-2 transition-all">
                        Explore →
                      </span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-20 p-8 rounded-2xl bg-primary/5 border border-primary/10 max-w-4xl mx-auto"
        >
          <h3 className="text-2xl font-bold mb-6 text-center">Why Use Our Tools?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3">🔒</div>
              <h4 className="font-semibold mb-2">100% Secure</h4>
              <p className="text-sm text-muted-foreground">All processing happens locally in your browser</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">⚡</div>
              <h4 className="font-semibold mb-2">Lightning Fast</h4>
              <p className="text-sm text-muted-foreground">Instant conversions with no waiting</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">💯</div>
              <h4 className="font-semibold mb-2">Completely Free</h4>
              <p className="text-sm text-muted-foreground">No limits, no watermarks, no signup</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ToolsHomePage;