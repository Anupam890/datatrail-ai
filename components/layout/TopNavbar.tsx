"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Bell, 
  Menu, 
  X, 
  Database, 
  LayoutDashboard,
  GraduationCap,
  Trophy,
  MessageSquare
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProfileDropdown } from "./ProfileDropdown";

const navItems = [
  { href: "/arena", label: "Arena", icon: LayoutDashboard },
  { href: "/lab", label: "Lab", icon: GraduationCap },
  { href: "/nexus", label: "Nexus", icon: MessageSquare },
  { href: "/ranks", label: "Ranks", icon: Trophy },
];

export function TopNavbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session } = authClient.useSession();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 h-16 border-b",
        isScrolled 
          ? "bg-[#0B0F19]/80 backdrop-blur-xl border-slate-800/50 shadow-lg shadow-black/10" 
          : "bg-[#0B0F19] border-slate-800/50"
      )}
    >
      <div className="max-w-[1400px] mx-auto h-full px-4 flex items-center justify-between">
        
        {/* Left: Logo */}
        <Link href="/arena" className="flex items-center gap-2.5 group shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 group-hover:bg-indigo-500 transition-colors shadow-[0_0_15px_rgba(99,102,241,0.3)]">
            <Database className="h-4.5 w-4.5 text-white" />
          </div>
          <span className="text-base font-black tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            DataTrail
          </span>
        </Link>

        {/* Center: Desktop Nav */}
        <nav className="hidden md:flex items-center gap-0.5 h-full px-8">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={cn(
                  "relative px-4 h-full flex items-center gap-2 text-sm font-medium transition-colors",
                  isActive ? "text-white" : "text-slate-500 hover:text-slate-200"
                )}
              >
                <item.icon className={cn("h-3.5 w-3.5 transition-colors", isActive ? "text-indigo-400" : "")} />
                {item.label}
                {isActive && (
                  <motion.div 
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 left-2 right-2 h-0.5 bg-indigo-500 rounded-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 lg:gap-3">
          
          {/* Search - Desktop */}
          <div className="hidden lg:flex relative w-48 xl:w-56 group">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
            <Input 
              placeholder="Search..." 
              className="h-8 w-full bg-slate-900/50 border-slate-800 pl-9 text-xs focus:ring-indigo-500/20 focus:border-indigo-500/50 rounded-xl transition-all"
            />
          </div>

          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg shrink-0">
            <Bell className="h-4 w-4" />
          </Button>

          {/* Profile Dropdown */}
          <ProfileDropdown />

          {/* Mobile Menu Toggle */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden h-8 w-8 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-800/50 bg-[#0B0F19]/95 backdrop-blur-xl overflow-hidden"
          >
            <div className="p-3 space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl text-sm font-medium transition-all",
                      isActive 
                        ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" 
                        : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
