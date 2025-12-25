import React from 'react';
import Link from 'next/link';
import { cn } from "@/lib/utils";
import { Github, Twitter, Linkedin, Mail, Terminal } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-black border-t border-white/10 pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">

          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6 group">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20 border border-primary/40 text-primary">
                <Terminal className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Intelli<span className="text-primary">Geek</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              The premier platform for developer education. Open source, community driven, and future ready.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="p-2 rounded-full bg-white/5 hover:bg-primary/20 hover:text-primary transition-colors">
                <Github className="w-4 h-4" />
              </Link>
              <Link href="#" className="p-2 rounded-full bg-white/5 hover:bg-primary/20 hover:text-primary transition-colors">
                <Twitter className="w-4 h-4" />
              </Link>
              <Link href="#" className="p-2 rounded-full bg-white/5 hover:bg-primary/20 hover:text-primary transition-colors">
                <Linkedin className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="text-white font-bold mb-6">Platform</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/learn" className="hover:text-primary transition-colors">Learning Paths</Link></li>
              <li><Link href="/roadmaps" className="hover:text-primary transition-colors">Interactive Roadmaps</Link></li>
              <li><Link href="/blogs" className="hover:text-primary transition-colors">Engineering Blog</Link></li>
              <li><Link href="/tools" className="hover:text-primary transition-colors">Dev Tools</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Company</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/careers" className="hover:text-primary transition-colors">Careers</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms-of-service" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-bold mb-6">Stay Updated</h4>
            <p className="text-xs text-muted-foreground mb-4">
              Get the latest tutorials and tech news delivered to your inbox.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter email..."
                className="bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-primary/50 w-full"
              />
              <button className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/50 px-4 py-2 rounded text-sm font-bold transition-colors">
                <Mail className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between text-xs text-muted-foreground">
          <p>© 2026 IntelForgeeks Inc. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span>Systems Operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
