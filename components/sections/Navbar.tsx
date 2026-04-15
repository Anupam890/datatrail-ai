"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Database } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
        isScrolled ? "bg-background/80 backdrop-blur-md border-border/50 py-3" : "py-5"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-2 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
            <Database className="w-6 h-6 text-primary" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            DataTrail <span className="text-primary italic">AI</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors">
            Courses
          </Link>
          <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors">
            Challenges
          </Link>
          <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors">
            Pricing
          </Link>
          <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors">
            Docs
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-white hover:text-primary transition-colors">
            Log in
          </Link>
          <Link href="/signup" className="px-5 py-2.5 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-95">
            Get Started
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden p-2 text-white" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-lg border-b border-border p-6 flex flex-col gap-6 animate-in fade-in slide-in-from-top-4">
          <Link href="#" className="text-lg font-medium">Courses</Link>
          <Link href="#" className="text-lg font-medium">Challenges</Link>
          <Link href="#" className="text-lg font-medium">Pricing</Link>
          <Link href="#" className="text-lg font-medium">Docs</Link>
          <Link href="/login" className="text-lg font-medium">Log in</Link>
          <Link href="/signup" className="w-full py-4 rounded-xl bg-primary text-white font-bold text-center">
            Get Started
          </Link>
        </div>
      )}
    </nav>
  );
}
