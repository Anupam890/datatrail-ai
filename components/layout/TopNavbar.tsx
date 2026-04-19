"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Bell, 
  Menu, 
  X, 
  Database, 
  LogOut, 
  User as UserIcon, 
  Settings, 
  HelpCircle,
  LayoutDashboard,
  GraduationCap,
  Trophy,
  Terminal,
  ChevronDown,
  TrendingUp,
  MessageSquare
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProfileDropdown } from "./ProfileDropdown";

const navItems = [
  { href: "/arena", label: "Arena", icon: LayoutDashboard },
  { href: "/lab", label: "Lab", icon: GraduationCap },
  { href: "/nexus", label: "Nexus", icon: MessageSquare },
  { href: "/ranks", label: "Ranks", icon: Trophy },
];

export function TopNavbar() {
  const pathname = usePathname();
  const router = useRouter();
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
          ? "bg-[#0B0F19]/90 backdrop-blur-md border-[#1F2937] shadow-lg" 
          : "bg-[#0B0F19] border-[#1F2937]"
      )}
    >
      <div className="max-w-[1400px] mx-auto h-full px-4 flex items-center justify-between">
        
        {/* Left: Logo */}
        <Link href="/arena" className="flex items-center gap-2 group shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 group-hover:bg-indigo-500 transition-colors shadow-[0_0_15px_rgba(99,102,241,0.3)]">
            <Database className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            SQLArena
          </span>
        </Link>

        {/* Center: Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1 h-full px-8">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={cn(
                  "relative px-4 h-full flex items-center text-sm font-medium transition-colors",
                  isActive ? "text-white" : "text-slate-400 hover:text-slate-200"
                )}
              >
                {item.label}
                {isActive && (
                  <motion.div 
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-3 lg:gap-4">
          
          {/* Search - Desktop */}
          <div className="hidden lg:flex relative w-48 xl:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input 
              placeholder="Search problems..." 
              className="h-9 w-full bg-slate-900/50 border-slate-800 pl-9 text-xs focus:ring-blue-500/20 rounded-lg"
            />
          </div>

          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-800 shrink-0">
            <Bell className="h-5 w-5" />
          </Button>

          {/* Profile Dropdown */}
          <ProfileDropdown />

          {/* Mobile Menu Toggle */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden text-slate-400 hover:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
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
            className="md:hidden border-t border-[#1F2937] bg-[#111827] overflow-hidden"
          >
            <div className="p-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-colors",
                    pathname === item.href 
                      ? "bg-blue-500/10 text-blue-500" 
                      : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
