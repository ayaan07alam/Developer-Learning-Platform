import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Github, Twitter, Linkedin, Mail, ArrowUpRight } from "lucide-react";

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
  { icon: Github, href: "https://github.com/RuntimeRiver", label: "GitHub" },
  { icon: Twitter, href: "https://twitter.com/RuntimeRiver", label: "Twitter / X" },
  { icon: Linkedin, href: "https://linkedin.com/company/runtimeriver", label: "LinkedIn" },
];

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-xl">

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 py-14">
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
              Read and write technical articles, run code in the browser, and use free developer tools — built for engineers who ship.
            </p>
            <div className="flex gap-2">
              {socials.map(({ icon: Icon, href, label }) => (
                <Link
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all"
                >
                  <Icon className="w-4 h-4" />
                </Link>
              ))}
            </div>
          </div>

          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {Object.entries(footerLinks).map(([heading, links]) => (
              <div key={heading}>
                <h4 className="section-label mb-4">
                  {heading}
                </h4>
                <ul className="space-y-2.5">
                  {links.map(({ label, href, external }) => (
                    <li key={label}>
                      <Link
                        href={href}
                        target={external ? "_blank" : undefined}
                        rel={external ? "noopener noreferrer" : undefined}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
                      >
                        {label}
                        {external && <ArrowUpRight className="w-3 h-3 opacity-50" />}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-border rounded-xl p-6 md:p-8 mb-10 bg-background/50">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <h3 className="text-base font-semibold text-foreground mb-1">
                Get in touch
              </h3>
              <p className="text-sm text-muted-foreground">
                Have a tutorial idea, partnership inquiry, or feedback? We read every message.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
              <Link href="/contact" className="w-full sm:w-auto">
                <button className="w-full justify-center px-5 py-2.5 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Contact us
                </button>
              </Link>
              <Link href="/register" className="w-full sm:w-auto">
                <button className="w-full justify-center px-5 py-2.5 text-sm font-medium rounded-lg border border-border text-foreground hover:bg-muted transition-colors">
                  Start writing
                </button>
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-6 pb-12 md:py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground text-center md:text-left">
          <span>&copy; {new Date().getFullYear()} RuntimeRiver. All rights reserved.</span>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span>Built for developers, by developers</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
