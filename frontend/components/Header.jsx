"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Menu, X, Terminal, LogOut, User, Search, ChevronDown, LayoutDashboard, Users, MessageSquare, Folder, PenTool } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, logout, isAuthenticated, isEditor } = useAuth();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!mounted) {
    return null;
  }

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Learn", href: "/learn" },
    { name: "Blogs", href: "/blogs" },
    { name: "Roadmaps", href: "/roadmaps" },
    { name: "Tools", href: "/tools" },
    { name: "Jobs", href: "/jobs" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
        scrolled
          ? "bg-background/80 backdrop-blur-md border-border/50 py-3"
          : "bg-transparent border-transparent py-5"
      )}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 group-hover:border-primary/60 transition-all duration-300 group-hover:scale-110">
            <Terminal className="w-6 h-6 text-primary group-hover:rotate-12 transition-transform duration-300" />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-foreground via-primary to-accent bg-[length:200%_auto] animate-gradient">
              Intel<span className="font-extrabold">for</span>Geeks
            </span>
            <span className="text-[10px] text-muted-foreground tracking-wider uppercase">Tech Excellence</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1 bg-secondary/5 rounded-full px-2 py-1 border border-white/5">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors hover:bg-white/5 rounded-full"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-4">
          {/* Search Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (searchQuery.trim()) {
                window.location.href = `/ search ? q = ${encodeURIComponent(searchQuery)} `;
              }
            }}
            className="relative"
          >
            <input
              type="text"
              placeholder="Search blogs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-64 rounded-full bg-secondary/10 border border-border/50 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          </form>

          {/* Write Button - Shown for authenticated users (all can write) */}
          {isAuthenticated && user?.role && (
            <Link href="/dashboard/write">
              <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white rounded-full px-6 font-semibold shadow-lg shadow-primary/20 flex items-center gap-2">
                <PenTool className="w-4 h-4" />
                Write
              </Button>
            </Link>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full hover:bg-primary/10 hover:text-primary"
          >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>

          {isAuthenticated ? (
            <>
              {/* User Menu Dropdown */}
              <div className="relative group">
                <Button
                  variant="outline"
                  className="rounded-full px-6 font-semibold border-primary/20 hover:bg-primary/10 flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  <span className="flex flex-col items-start leading-tight">
                    <span>{user?.username || user?.email?.split('@')[0]}</span>
                    {user?.role && user.role !== 'USER' && (
                      <span className="text-[10px] text-primary font-bold">{user.role}</span>
                    )}
                  </span>
                  <ChevronDown className="w-4 h-4" />
                </Button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-2">
                    {/* Dashboard Link - Visible to all, logic handled by page */}
                    <Link href="/dashboard" className="flex items-center gap-3 px-4 py-2 hover:bg-muted transition-colors">
                      <LayoutDashboard className="w-4 h-4" />
                      <span>Dashboard</span>
                    </Link>

                    {/* Admin Links */}
                    {user?.role === 'ADMIN' && (
                      <>
                        <Link href="/dashboard/users" className="flex items-center gap-3 px-4 py-2 hover:bg-muted transition-colors">
                          <Users className="w-4 h-4" />
                          <span>Users</span>
                        </Link>
                        <Link href="/dashboard/comments" className="flex items-center gap-3 px-4 py-2 hover:bg-muted transition-colors">
                          <MessageSquare className="w-4 h-4" />
                          <span>Comments</span>
                        </Link>
                        <Link href="/dashboard/categories" className="flex items-center gap-3 px-4 py-2 hover:bg-muted transition-colors">
                          <Folder className="w-4 h-4" />
                          <span>Categories</span>
                        </Link>
                      </>
                    )}

                    {/* Profile Link */}
                    <Link href="/dashboard/profile" className="flex items-center gap-3 px-4 py-2 hover:bg-muted transition-colors">
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </Link>

                    <div className="border-t border-border my-2"></div>

                    {/* Logout */}
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-muted transition-colors text-red-500"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link href="/login?redirect=/dashboard/write">
                <Button variant="outline" className="border-primary/30 hover:bg-primary/10 rounded-full px-6 font-semibold flex items-center gap-2">
                  <PenTool className="w-4 h-4" />
                  Write
                </Button>
              </Link>
              <Link href="/login">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6 font-semibold shadow-lg shadow-primary/20">
                  Login
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full"
          >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] border-l border-border/50 bg-background/95 backdrop-blur-xl">
              <div className="flex flex-col gap-8 mt-8">
                <div className="flex flex-col gap-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="text-lg font-medium px-4 py-3 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
                <div className="flex flex-col gap-4 px-4">
                  <Button className="w-full bg-primary text-primary-foreground font-bold">
                    Sign Up
                  </Button>
                  <Button variant="outline" className="w-full border-primary/20 hover:bg-primary/5">
                    Log In
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
