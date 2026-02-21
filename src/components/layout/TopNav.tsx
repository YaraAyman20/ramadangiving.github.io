"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sun, Moon, User, LogIn, Menu, X, Heart } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import Image from "next/image";

const navItems = [
  { name: "Home", path: "/" },
  { name: "Programs", path: "/programs" },
  { name: "About", path: "/about" },
  { name: "Get Involved", path: "/get-involved" },
  { name: "Blog & News", path: "/news" },
  { name: "FAQ", path: "/faq" },
  { name: "Contact Us", path: "/contact" },
];

export function TopNav() {
  const { theme, toggleTheme } = useTheme();
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only applying theme classes after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-20 bg-card/95 backdrop-blur-lg border-b border-border transition-theme">
      <div className="max-w-7xl mx-auto h-full px-4 md:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image 
            src="/assets/images/logo.jpg" 
            alt="Ramadan Giving" 
            width={48}
            height={48}
            className="h-12 w-12 rounded-full object-cover shadow-soft"
          />
          <div className="hidden sm:flex flex-col">
            <span className="font-bold text-foreground text-lg leading-tight">
              Ramadan Giving
            </span>
            <span className="text-xs text-muted-foreground">Bridging Borders NPO</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.name}
                href={item.path}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground/70 hover:text-foreground hover:bg-secondary"
                )}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-1.5 md:gap-2">
          {/* Theme Toggle - Desktop - Styled Button (Tightened) */}
          <Button
            variant="outline"
            onClick={toggleTheme}
            className="hidden md:flex items-center gap-1.5 rounded-xl border-border hover:bg-secondary px-3 h-9"
            aria-label="Toggle theme"
          >
            <div className="relative w-4 h-4" suppressHydrationWarning>
              <Sun className={cn(
                "h-4 w-4 absolute transition-all duration-500",
                !mounted ? "rotate-0 scale-100 opacity-100" : (theme === "dark" ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100")
              )} />
              <Moon className={cn(
                "h-4 w-4 absolute transition-all duration-500",
                !mounted ? "-rotate-90 scale-0 opacity-0" : (theme === "dark" ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0")
              )} />
            </div>
            <span className="text-xs font-medium">Switch Theme</span>
          </Button>

          {/* Theme Toggle - Mobile - Styled Button with Text */}
          <Button
            variant="outline"
            onClick={toggleTheme}
            className="md:hidden flex items-center gap-1.5 rounded-xl border-border hover:bg-secondary px-2.5 h-9"
            aria-label="Toggle theme"
          >
            <div className="relative w-4 h-4" suppressHydrationWarning>
              <Sun className={cn(
                "h-4 w-4 absolute transition-all duration-500 text-foreground",
                !mounted ? "rotate-0 scale-100 opacity-100" : (theme === "dark" ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100")
              )} />
              <Moon className={cn(
                "h-4 w-4 absolute transition-all duration-500 text-foreground",
                !mounted ? "-rotate-90 scale-0 opacity-0" : (theme === "dark" ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0")
              )} />
            </div>
            <span className="text-[10px] font-medium text-foreground">Switch Theme</span>
          </Button>

          {/* Donate Button - Links to Programs */}
          <Link href="/programs">
            <Button
              className="h-9 px-3 md:px-4 rounded-xl font-semibold bg-gold hover:bg-gold/90 text-gold-foreground shadow-lg shadow-gold/20 transition-all duration-200"
            >
              <Heart className="w-4 h-4 mr-1" />
              <span className="text-sm">Donate</span>
            </Button>
          </Link>

          {/* User Avatar / Sign In - Desktop (Far right) */}
          {!loading && (
            <div className="hidden md:block">
              {user ? (
                <Link href="/profile">
                  <Avatar className="w-9 h-9 border-2 border-border cursor-pointer hover:border-primary transition-colors duration-300">
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                      {user.email?.charAt(0).toUpperCase() || <User className="w-4 h-4" />}
                    </AvatarFallback>
                  </Avatar>
                </Link>
              ) : (
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="rounded-lg gap-1.5 h-9 px-3">
                    <LogIn className="w-4 h-4" />
                    <span className="text-sm">Sign In</span>
                  </Button>
                </Link>
              )}
            </div>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden rounded-lg h-9 w-9"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-20 left-0 right-0 bg-card border-b border-border shadow-lg animate-fade-in">
          <nav className="p-4 space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.name}
                  href={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "block px-4 py-3 rounded-xl text-base font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-secondary"
                  )}
                >
                  {item.name}
                </Link>
              );
            })}
            
            {/* Mobile Auth */}
            <div className="flex items-center justify-between pt-4 border-t border-border mt-4">
              {!loading && (
                user ? (
                  <Link href="/profile" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2">
                    <Avatar className="w-9 h-9 border-2 border-border">
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                        {user.email?.charAt(0).toUpperCase() || <User className="w-4 h-4" />}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-foreground font-medium">Profile</span>
                  </Link>
                ) : (
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" size="sm" className="gap-2 rounded-xl">
                      <LogIn className="w-4 h-4" />
                      Sign In
                    </Button>
                  </Link>
                )
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}