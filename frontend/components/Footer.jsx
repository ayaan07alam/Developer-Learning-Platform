import React from 'react';
import Link from 'next/link';
import { cn } from "@/lib/utils";
import { Github, Twitter, Linkedin, Mail, Terminal, Heart, Code2 } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative bg-background border-t border-border overflow-hidden pt-10 md:pt-16 pb-8">
      {/* Background Gradient - Subtle */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-muted/20 pointer-events-none" />

      <div className="container relative mx-auto px-6 z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 mb-10 md:mb-16">

          {/* Brand Column (Left - 4 cols) */}
          <div className="md:col-span-4 space-y-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-400/10 border border-cyan-400/20 group-hover:bg-cyan-400/20 transition-all text-cyan-400">
                <Terminal className="w-5 h-5" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-foreground">
                Runtime<span className="text-cyan-400">River</span>
              </span>
            </Link>
            <p className="text-muted-foreground leading-relaxed max-w-sm text-sm md:text-base">
              Where knowledge flows & code runs. Deep-dive tutorials, powerful tools, and live execution in one flow.
            </p>
            <div className="flex gap-4 pt-2">
              {[
                { icon: Github, href: "#", label: "GitHub" },
                { icon: Twitter, href: "#", label: "Twitter" },
                { icon: Linkedin, href: "#", label: "LinkedIn" }
              ].map((social, idx) => (
                <Link
                  key={idx}
                  href={social.href}
                  className="p-2.5 rounded-lg bg-secondary/5 hover:bg-primary/10 border border-transparent hover:border-primary/30 text-muted-foreground hover:text-primary transition-all duration-300 transform hover:-translate-y-1"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Links Columns (Right - 8 cols grid) */}
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">

            {/* Column 1: Platform */}
            <div>
              <h4 className="font-bold text-foreground mb-4 md:mb-6 flex items-center gap-2">
                <Code2 className="w-4 h-4 text-primary" /> Platform
              </h4>
              <ul className="space-y-3 md:space-y-4 text-sm text-muted-foreground">
                <li><Link href="/blogs" className="hover:text-primary transition-colors hover:pl-2 duration-300 block">Engineering Blog</Link></li>
                <li><Link href="/tools" className="hover:text-primary transition-colors hover:pl-2 duration-300 block">Developer Tools</Link></li>
                <li><Link href="/react" className="hover:text-primary transition-colors hover:pl-2 duration-300 block">Learning Paths</Link></li>
                <li><Link href="/jobs" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors hover:pl-2 duration-300 block">Job Board</Link></li>
              </ul>
            </div>

            {/* Column 2: Tools & Resources */}
            <div>
              <h4 className="font-bold text-foreground mb-4 md:mb-6 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-secondary" /> Resources
              </h4>
              <ul className="space-y-3 md:space-y-4 text-sm text-muted-foreground">
                <li><Link href="/tools/pdf" className="hover:text-secondary transition-colors hover:pl-2 duration-300 block">PDF Utilities</Link></li>
                <li><Link href="/tools/images" className="hover:text-secondary transition-colors hover:pl-2 duration-300 block">Image Optimizer</Link></li>
                <li><Link href="/tools/code" className="hover:text-secondary transition-colors hover:pl-2 duration-300 block">Code Formatters</Link></li>

              </ul>
            </div>

            {/* Column 3: Company */}
            <div className="col-span-2 sm:col-span-1">
              <h4 className="font-bold text-foreground mb-4 md:mb-6">Company</h4>
              <ul className="space-y-3 md:space-y-4 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-foreground transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
                <li><Link href="/privacy-policy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms-of-service" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
              </ul>
            </div>

          </div>
        </div>

        {/* Newsletter Section */}
        <div className="relative rounded-2xl bg-gradient-to-r from-primary/5 to-secondary/5 border border-border p-6 md:p-10 mb-10 md:mb-12">
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center">
            <div>
              <h3 className="text-xl md:text-2xl font-bold mb-2">Subscribe to our newsletter</h3>
              <p className="text-muted-foreground text-sm">Join 10,000+ developers receiving the latest tech news.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter email address..."
                className="flex-1 bg-background/50 border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-all"
              />
              <button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-3 rounded-lg transition-all flex items-center justify-center gap-2 whitespace-nowrap">
                Subscribe <Mail className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1 mb-4 md:mb-0">
            <span>© 2026 RuntimeRiver. All rights reserved.</span>
            <span className="mx-2">•</span>
            <span className="flex items-center gap-1">
              Made with <Heart className="w-3 h-3 text-red-500 fill-red-500 animate-pulse" /> by Developers
            </span>
          </div>
          <div className="flex gap-6">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-500">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="font-medium">Systems Operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
