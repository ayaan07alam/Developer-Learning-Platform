"use client";
import React from 'react';
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Code, Image as ImageIcon, FileJson, Hash, Settings, Palette } from "lucide-react";
import Link from "next/link";

const dummyTools = [
  {
    title: "Code Formatter",
    description: "Beautify your code instantly. Supports JS, CSS, HTML.",
    icon: <Code className="w-8 h-8 text-blue-500" />,
    link: "/tools/formatter"
  },
  {
    title: "Image Optimizer",
    description: "Compress and resize images without quality loss.",
    icon: <ImageIcon className="w-8 h-8 text-pink-500" />,
    link: "/tools/image-optimizer"
  },
  {
    title: "JSON Validator",
    description: "Validate and format your JSON data.",
    icon: <FileJson className="w-8 h-8 text-green-500" />,
    link: "/tools/json-validator"
  },
  {
    title: "Hash Generator",
    description: "Generate MD5, SHA-1, SHA-256 hashes securely.",
    icon: <Hash className="w-8 h-8 text-purple-500" />,
    link: "/tools/hash-generator"
  },
  {
    title: "Regex Tester",
    description: "Test your regular expressions in real-time.",
    icon: <Settings className="w-8 h-8 text-orange-500" />,
    link: "/tools/regex-tester"
  },
  {
    title: "Color Picker",
    description: "Generate palettes and convert color codes.",
    icon: <Palette className="w-8 h-8 text-teal-500" />,
    link: "/tools/color-picker"
  }
];

const Tools = () => {
  return (
    <div className="min-h-screen pt-24 pb-12 bg-background relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            Developer Tools
          </h1>
          <p className="text-muted-foreground text-lg">
            Boost your productivity with our collection of essential utilities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dummyTools.map((tool, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group p-8 rounded-3xl bg-card border border-border/50 hover:border-primary/50 shadow-lg hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300"
            >
              <div className="mb-6 w-16 h-16 rounded-2xl bg-background border border-border flex items-center justify-center group-hover:scale-110 transition-transform">
                {tool.icon}
              </div>
              <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                {tool.title}
              </h3>
              <p className="text-muted-foreground mb-6">
                {tool.description}
              </p>
              <span className="inline-flex items-center text-sm font-semibold text-primary opacity-80 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                Try Tool →
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Tools