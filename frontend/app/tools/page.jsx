"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText, FileCode, Image as ImageIcon, Presentation, Table,
  ShieldCheck, Zap, UserX, ArrowRight, Search, ChevronRight,
  FileCog, Layers, Cpu
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// ─── All tool categories with individual tools listed ─────────────────────────
const categories = [
  {
    id: "pdf",
    name: "PDF Tools",
    icon: FileText,
    description: "Merge, split, compress, and convert PDF documents with ease.",
    toolCount: 6,
    href: "/tools/pdf",
    tools: ["Merge PDF", "Split PDF", "Compress PDF", "PDF to Word", "PDF to PPT", "Files to PDF"],
  },
  {
    id: "word",
    name: "Word Tools",
    icon: FileText,
    description: "Work with Word documents — convert, merge, and compress.",
    toolCount: 5,
    href: "/tools/word",
    tools: ["Word to PDF", "Word to HTML", "Merge Word", "Compress Word", "Word to Images"],
  },
  {
    id: "excel",
    name: "Excel Tools",
    icon: Table,
    description: "Process and convert Excel spreadsheets in seconds.",
    toolCount: 4,
    href: "/tools/excel",
    tools: ["Excel to PDF", "Excel to CSV", "CSV to Excel", "Compress Excel"],
  },
  {
    id: "ppt",
    name: "PowerPoint Tools",
    icon: Presentation,
    description: "Convert and optimize PowerPoint presentations.",
    toolCount: 4,
    href: "/tools/ppt",
    tools: ["PPT to PDF", "PPT to Images", "Compress PPT", "PDF to PPT"],
  },
  {
    id: "images",
    name: "Image Tools",
    icon: ImageIcon,
    description: "Convert, resize, compress, watermark, and optimize images.",
    toolCount: 8,
    href: "/tools/images",
    tools: ["Image to JPG", "Image to PNG", "Image to WebP", "Compress Images", "Upscale Images", "Downscale Images", "Remove Background", "Watermark Images"],
  },
  {
    id: "developer",
    name: "Developer Tools",
    icon: FileCode,
    description: "Code utilities, formatters, validators, and developer helpers.",
    toolCount: 12,
    href: "/tools/developer",
    tools: ["Code Formatter", "JSON Validator", "Base64 Encode/Decode", "Hash Generator", "Regex Tester", "URL Encoder", "Diff Checker", "Markdown Preview", "Color Picker", "QR Generator", "Password Generator", "Case Converter"],
  },
];

const highlights = [
  {
    icon: ShieldCheck,
    title: "Browser-side processing",
    description: "Your files never leave your device. All processing runs locally — zero server uploads.",
  },
  {
    icon: Zap,
    title: "Instant results",
    description: "No queue. No waiting. Operations complete in seconds directly in your tab.",
  },
  {
    icon: UserX,
    title: "No account required",
    description: "Every tool is free to use. No signup, no watermark, no hidden limits.",
  },
];

// ─── Category card ────────────────────────────────────────────────────────────
const CategoryCard = ({ cat, index }) => {
  const Icon = cat.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.38, delay: index * 0.07 }}
    >
      <Link href={cat.href}>
        <div className="group h-full bg-card border border-border rounded-xl p-6 hover:border-primary/40 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col">

          {/* Header */}
          <div className="flex items-start justify-between mb-5">
            <div className="w-10 h-10 rounded-lg bg-primary/8 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <span className="text-[11px] font-semibold text-muted-foreground bg-muted px-2 py-1 rounded-md">
              {cat.toolCount} tools
            </span>
          </div>

          <h2 className="text-base font-semibold text-foreground mb-1.5 group-hover:text-primary transition-colors">
            {cat.name}
          </h2>
          <p className="text-[13px] text-muted-foreground leading-relaxed mb-5 flex-1">
            {cat.description}
          </p>

          {/* Individual tools list — trust signal */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {cat.tools.slice(0, 5).map(t => (
              <span key={t} className="text-[11px] px-2 py-0.5 rounded border border-border bg-muted/50 text-muted-foreground">
                {t}
              </span>
            ))}
            {cat.tools.length > 5 && (
              <span className="text-[11px] px-2 py-0.5 rounded border border-border bg-muted/50 text-muted-foreground">
                +{cat.tools.length - 5} more
              </span>
            )}
          </div>

          <span className="flex items-center gap-1 text-[13px] font-medium text-primary mt-auto">
            Open tools <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
const ToolsHomePage = () => {
  const [search, setSearch] = useState("");

  const filtered = search.trim()
    ? categories.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.tools.some(t => t.toLowerCase().includes(search.toLowerCase())) ||
        c.description.toLowerCase().includes(search.toLowerCase())
      )
    : categories;

  return (
    <div className="min-h-screen bg-background">

      {/* ─── Page header ─────────────────────────────────────────────────── */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 md:px-6 max-w-screen-xl pt-24 pb-10 md:pt-28 md:pb-12">
          <p className="text-[11px] font-semibold text-primary uppercase tracking-[0.12em] mb-3">
            Developer utilities
          </p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight mb-3">
            Tools &amp; Utilities
          </h1>
          <p className="text-muted-foreground text-[15.5px] max-w-xl mb-6">
            40+ free tools for files, images, and code — built for developers. No signup, no watermarks,
            all processing happens in your browser.
          </p>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search tools... e.g. 'compress PDF', 'JSON validator'"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg bg-background border border-border focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 max-w-screen-xl py-10">

        {/* ─── Why section — trust block above the fold ──────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {highlights.map((h, i) => (
            <motion.div
              key={h.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.07 }}
              className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card"
            >
              <div className="w-8 h-8 rounded-md bg-primary/8 flex items-center justify-center shrink-0 mt-0.5">
                <h.icon className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground mb-0.5">{h.title}</p>
                <p className="text-[12px] text-muted-foreground leading-relaxed">{h.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ─── Results count ──────────────────────────────────────────────── */}
        {search && (
          <p className="text-sm text-muted-foreground mb-6">
            {filtered.length > 0
              ? `${filtered.length} categor${filtered.length === 1 ? "y" : "ies"} match "${search}"`
              : `No tools found for "${search}"`}
          </p>
        )}

        {/* ─── Category grid ──────────────────────────────────────────────── */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <Cpu className="w-10 h-10 text-muted-foreground/30 mx-auto mb-4" />
            <p className="font-medium text-foreground mb-1">No tools found</p>
            <p className="text-sm text-muted-foreground">Try a different search term</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((cat, i) => <CategoryCard key={cat.id} cat={cat} index={i} />)}
          </div>
        )}

        {/* ─── Bottom CTA ─────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-12 p-8 rounded-xl bg-primary/5 border border-primary/15 flex flex-col md:flex-row md:items-center gap-5 md:gap-8"
        >
          <div className="flex-1">
            <h3 className="text-base font-semibold text-foreground mb-1">Missing a tool?</h3>
            <p className="text-sm text-muted-foreground">
              We&apos;re actively adding new tools. Suggest one or contribute to the platform.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shrink-0"
          >
            Suggest a tool <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>

      </div>
    </div>
  );
};

export default ToolsHomePage;
