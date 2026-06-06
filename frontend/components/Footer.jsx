import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Github, Twitter, Linkedin, Mail, Code2, Terminal } from "lucide-react";

const footerLinks = {
  Platform: [
    { label: "Engineering Blog", href: "/blogs" },
    { label: "Developer Tools", href: "/tools" },
    { label: "Learning Paths", href: "/learn" },
    { label: "Job Board", href: "/jobs", external: true },
    { label: "Online Compiler", href: "/compiler" },
  ],
  Resources: [
    { label: "PDF Utilities", href: "/tools/pdf" },
    { label: "Image Optimizer", href: "/tools/images" },
    { label: "Code Formatters", href: "/tools/developer" },
    { label: "Roadmaps", href: "/roadmaps" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Service", href: "/terms-of-service" },
  ],
};

const socials = [
  { icon: Github,   href: "#", label: "GitHub" },
  { icon: Twitter,  href: "#", label: "Twitter / X" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
];

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-xl">

        {/* ─── Main grid ───────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 py-14">

          {/* Brand */}
          <div className="md:col-span-4 space-y-5">
            <Link href="/" className="flex items-center group w-fit">
              <div className="relative w-[160px] h-10 md:w-[200px] md:h-12 hidden dark:block">
                 <Image src="/logo-minimal.png" alt="Runtime River" fill className="object-contain object-left brightness-0 invert" />
              </div>
              <div className="relative w-[160px] h-10 md:w-[200px] md:h-12 block dark:hidden">
                 <Image src="/logo-minimal.png" alt="Runtime River" fill className="object-contain object-left" />
              </div>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              A developer platform for reading and writing technical articles, running code
              in the browser, and discovering free developer tools.
            </p>
            <div className="flex gap-2">
              {socials.map(({ icon: Icon, href, label }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 rounded-md border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all"
                >
                  <Icon className="w-3.5 h-3.5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {Object.entries(footerLinks).map(([heading, links]) => (
              <div key={heading}>
                <h4 className="text-xs font-semibold text-foreground uppercase tracking-widest mb-4">
                  {heading}
                </h4>
                <ul className="space-y-2.5">
                  {links.map(({ label, href, external }) => (
                    <li key={label}>
                      <Link
                        href={href}
                        target={external ? "_blank" : undefined}
                        rel={external ? "noopener noreferrer" : undefined}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Newsletter ──────────────────────────────────────────────── */}
        <div className="border border-border rounded-xl p-6 md:p-8 mb-10">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <h3 className="text-base font-semibold text-foreground mb-1">
                Stay up to date
              </h3>
              <p className="text-sm text-muted-foreground">
                Get the latest tutorials and developer news delivered to your inbox.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 min-w-0 px-3 py-2.5 text-sm rounded-md bg-background border border-border focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
              />
              <Link href="/contact" className="w-full sm:w-auto shrink-0">
                <button className="w-full justify-center px-4 py-2.5 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-1.5 whitespace-nowrap">
                  <Mail className="w-3.5 h-3.5" />
                  Subscribe
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* ─── Bottom bar ──────────────────────────────────────────────── */}
        <div className="border-t border-border pt-6 pb-12 md:py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground text-center md:text-left">
          <span>&copy; {new Date().getFullYear()} RuntimeRiver. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span>All systems operational</span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
