"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Moon, Sun, Menu, LogOut, User, Search,
  LayoutDashboard, Users, MessageSquare, Folder, PenTool, Bell
} from "lucide-react";
import NotificationBell from "./NotificationBell";
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
  const [searchOpen, setSearchOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setIsOpen(false);
    }
  };

  const navLinks = [
    { name: "Home",     href: "/" },
    { name: "Learn",    href: "/learn" },
    { name: "Blogs",    href: "/blogs" },
    { name: "Compiler", href: "/compiler" },
    { name: "Tools",    href: "/tools" },
    { name: "Jobs",     href: "/jobs", target: "_blank" },
  ];

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-background border-b border-border shadow-sm"
          : "bg-background border-b border-border/60"
      )}
    >
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-xl flex items-center justify-between h-16 md:h-[72px]">

        {/* ── Logo ── */}
        <Link href="/" className="flex items-center group shrink-0">
          <div className="relative w-[160px] h-10 md:w-[200px] md:h-12 hidden dark:block">
             <Image src="/logo-minimal.png" alt="Runtime River" fill className="object-contain object-left brightness-0 invert" priority />
          </div>
          <div className="relative w-[160px] h-10 md:w-[200px] md:h-12 block dark:hidden">
             <Image src="/logo-minimal.png" alt="Runtime River" fill className="object-contain object-left" priority />
          </div>
        </Link>

        {/* ── Desktop Nav ── */}
        <nav className="hidden md:flex items-center">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              target={link.target}
              rel={link.target === "_blank" ? "noopener noreferrer" : undefined}
              className={cn(
                "relative px-4 py-5 text-sm font-medium transition-colors",
                "after:absolute after:bottom-0 after:left-4 after:right-4 after:h-[2px] after:rounded-full after:transition-all after:duration-200",
                isActive(link.href)
                  ? "text-foreground after:bg-primary"
                  : "text-muted-foreground hover:text-foreground after:bg-transparent"
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* ── Desktop Actions ── */}
        <div className="hidden md:flex items-center gap-2">

          {/* Search */}
          <div className="relative">
            {searchOpen ? (
              <form onSubmit={handleSearch} className="flex items-center">
                <input
                  autoFocus
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onBlur={() => !searchQuery && setSearchOpen(false)}
                  className="w-52 pl-3 pr-3 py-1.5 text-sm rounded-md bg-muted border border-border focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all"
                />
              </form>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchOpen(true)}
                className="h-9 w-9 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <Search className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="h-9 w-9 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            {mounted && theme === "dark" ? <Sun className="w-4 h-4" /> : mounted ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 opacity-0" />}
          </Button>

          {/* Notification Bell */}
          {isAuthenticated && <NotificationBell />}

          {isAuthenticated ? (
            <>
              {/* Write */}
              <Link href="/dashboard/posts/new">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-9 gap-1.5 rounded-md border-border text-foreground hover:bg-muted text-sm font-medium"
                >
                  <PenTool className="w-3.5 h-3.5" />
                  Write
                </Button>
              </Link>

              {/* User dropdown */}
              <div className="relative group">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-muted"
                >
                  <User className="w-4 h-4" />
                </Button>
                <div className="absolute right-0 mt-1 w-52 bg-popover border border-border rounded-lg shadow-lg shadow-black/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-150 z-50">
                  <div className="py-1">
                    <div className="px-3 py-2.5 border-b border-border">
                      <p className="font-semibold text-sm truncate text-foreground">{user?.displayName || user?.email?.split('@')[0]}</p>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">{user?.email}</p>
                      {user?.role && user.role !== 'VIEWER' && user.role !== 'USER' && (
                        <span className="inline-block mt-1.5 text-[10px] px-2 py-0.5 rounded bg-primary/10 text-primary font-semibold tracking-wide uppercase">
                          {user.role}
                        </span>
                      )}
                    </div>
                    <Link href="/dashboard" className="flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-muted transition-colors text-foreground">
                      <LayoutDashboard className="w-3.5 h-3.5 text-muted-foreground" />
                      Dashboard
                    </Link>
                    {user?.role === 'ADMIN' && (
                      <>
                        <Link href="/dashboard/users" className="flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-muted transition-colors text-foreground">
                          <Users className="w-3.5 h-3.5 text-muted-foreground" />
                          Users
                        </Link>
                        <Link href="/dashboard/comments" className="flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-muted transition-colors text-foreground">
                          <MessageSquare className="w-3.5 h-3.5 text-muted-foreground" />
                          Comments
                        </Link>
                        <Link href="/dashboard/categories" className="flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-muted transition-colors text-foreground">
                          <Folder className="w-3.5 h-3.5 text-muted-foreground" />
                          Categories
                        </Link>
                        <Link href="/dashboard/admin/notifications" className="flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-muted transition-colors text-foreground">
                          <Bell className="w-3.5 h-3.5 text-muted-foreground" />
                          Broadcast
                        </Link>
                      </>
                    )}
                    <Link href="/dashboard/profile" className="flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-muted transition-colors text-foreground">
                      <User className="w-3.5 h-3.5 text-muted-foreground" />
                      Profile
                    </Link>
                    <div className="border-t border-border my-1" />
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-muted transition-colors text-destructive"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm" className="h-9 text-sm font-medium rounded-md text-muted-foreground hover:text-foreground">
                  Sign in
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="h-9 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium px-4">
                  Get started
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* ── Mobile Actions ── */}
        <div className="md:hidden flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="h-9 w-9 rounded-md text-muted-foreground"
          >
            {mounted && theme === "dark" ? <Sun className="w-4 h-4" /> : mounted ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 opacity-0" />}
          </Button>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-md text-muted-foreground">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] border-l border-border bg-background p-0">
              <div className="flex flex-col h-full">
                {/* Mobile Header */}
                <div className="flex items-center px-5 py-4 border-b border-border">
                  <div className="relative w-[140px] h-10">
                    <Image src="/logo-minimal.png" alt="Runtime River" fill className="object-contain object-left" />
                  </div>
                </div>

                {/* Mobile Search */}
                <div className="px-4 pt-4">
                  <form onSubmit={handleSearch} className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search articles..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-[15px] bg-muted border border-border rounded-lg focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-muted-foreground"
                    />
                  </form>
                </div>

                {/* Mobile Nav */}
                <nav className="flex flex-col gap-0.5 px-3 pt-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      target={link.target}
                      onClick={() => setIsOpen(false)}
                      rel={link.target === "_blank" ? "noopener noreferrer" : undefined}
                      className={cn(
                        "px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                        isActive(link.href)
                          ? "text-primary bg-primary/8"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}
                    >
                      {link.name}
                    </Link>
                  ))}
                </nav>

                {/* Mobile Auth */}
                <div className="mt-auto px-4 pb-8 pt-4 border-t border-border flex flex-col gap-3">
                  {isAuthenticated ? (
                    <>
                      <Link href="/dashboard/posts/new" onClick={() => setIsOpen(false)}>
                        <Button className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground text-[15px] font-semibold gap-2 rounded-lg">
                          <PenTool className="w-4 h-4" />
                          Write an article
                        </Button>
                      </Link>
                      <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                        <Button variant="outline" className="w-full h-11 text-[15px] rounded-lg border-border font-medium gap-2">
                          <LayoutDashboard className="w-4 h-4" />
                          Dashboard
                        </Button>
                      </Link>
                      <Button
                        onClick={() => { logout(); setIsOpen(false); }}
                        variant="ghost"
                        className="w-full h-11 text-[15px] font-medium text-destructive hover:bg-destructive/10 rounded-lg gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link href="/register" onClick={() => setIsOpen(false)}>
                        <Button className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground text-[15px] font-semibold rounded-lg">
                          Get started — free
                        </Button>
                      </Link>
                      <Link href="/login" onClick={() => setIsOpen(false)}>
                        <Button variant="outline" className="w-full h-11 text-[15px] font-medium rounded-lg text-foreground border-border hover:bg-muted">
                          Sign in
                        </Button>
                      </Link>
                    </>
                  )}
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
