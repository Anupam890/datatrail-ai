"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Database, Github, ArrowRight, Twitter, Linkedin, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { name: "Arena", href: "/arena" },
  { name: "Courses", href: "#" },
  { name: "Pricing", href: "#" },
  { name: "Docs", href: "#" },
];

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

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [mobileMenuOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] px-4 md:px-6 py-4 md:py-6 pointer-events-none">
      <nav
        className={cn(
          "max-w-5xl mx-auto flex items-center justify-between px-5 md:px-6 py-2.5 md:py-3 rounded-full transition-all duration-500 pointer-events-auto",
          isScrolled || mobileMenuOpen
            ? "glass-dark border-white/10 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)]" 
            : "bg-transparent border-transparent"
        )}
      >
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="p-2 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110">
              <Database className="w-5 h-5 text-primary" />
            </div>
            <span className="text-lg md:text-xl font-black tracking-tight text-white uppercase italic">
              DataTrail
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                className="text-xs font-bold text-muted-foreground hover:text-white transition-all uppercase tracking-widest relative group/link"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover/link:w-full" />
              </Link>
            ))}
          </div>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link 
            href="https://github.com" 
            className="p-2.5 rounded-full bg-white/5 border border-white/5 text-muted-foreground hover:text-white hover:bg-white/10 transition-all"
          >
            <Github className="w-4 h-4" />
          </Link>
          <Link href="/login" className="px-5 py-2.5 text-xs font-bold text-white hover:text-primary transition-colors uppercase tracking-widest">
            Log in
          </Link>
          <Link 
            href="/signup" 
            className="px-6 py-2.5 rounded-full bg-primary text-white text-xs font-black uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-95"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white relative" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <AnimatePresence mode="wait">
            {mobileMenuOpen ? (
              <motion.div
                key="close"
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
              >
                <X className="w-5 h-5" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ opacity: 0, rotate: 90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: -90 }}
              >
                <Menu className="w-5 h-5" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[-1] bg-black/60 backdrop-blur-2xl md:hidden pointer-events-auto"
          >
            {/* Background Orbs */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="h-full flex flex-col px-8 pt-32 pb-12">
              <div className="flex flex-col gap-8">
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.1 }}
                  >
                    <Link 
                      href={link.href} 
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-4xl font-black text-white uppercase italic tracking-tighter flex items-center justify-between group"
                    >
                      {link.name}
                      <ArrowRight className="w-8 h-8 text-primary opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="mt-auto space-y-8">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="grid grid-cols-2 gap-4"
                >
                  <Link 
                    href="/login" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex flex-col p-4 rounded-2xl bg-white/5 border border-white/10"
                  >
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Returning?</span>
                    <span className="text-lg font-black text-white">Log In</span>
                  </Link>
                  <Link 
                    href="https://github.com" 
                    className="flex flex-col p-4 rounded-2xl bg-white/5 border border-white/10"
                  >
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Community</span>
                    <Github className="w-6 h-6 text-white" />
                  </Link>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Link 
                    href="/signup" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-6 rounded-[2rem] bg-primary text-white font-black text-center uppercase tracking-widest text-lg shadow-2xl shadow-primary/40 block"
                  >
                    Get Started Free
                  </Link>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="flex items-center justify-center gap-6 text-white/20 pt-4"
                >
                  <Twitter className="w-5 h-5" />
                  <Linkedin className="w-5 h-5" />
                  <MessageSquare className="w-5 h-5" />
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
