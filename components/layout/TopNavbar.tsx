"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Search, 
  Bell, 
  Menu, 
  X, 
  Database, 
  LayoutDashboard,
  GraduationCap,
  Trophy,
  MessageSquare,
  CheckCheck,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ProfileDropdown } from "./ProfileDropdown";
import { CommandPalette } from "./CommandPalette";

const navItems = [
  { href: "/arena", label: "Arena", icon: LayoutDashboard },
  { href: "/lab", label: "Lab", icon: GraduationCap },
  { href: "/nexus", label: "Nexus", icon: MessageSquare },
  { href: "/ranks", label: "Ranks", icon: Trophy },
];

export function TopNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const { data: session } = authClient.useSession();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close notification dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch notifications
  const { data: notifData } = useQuery<{
    notifications: Array<{
      id: string;
      type: string;
      title: string;
      message: string | null;
      link: string | null;
      is_read: boolean;
      created_at: string;
    }>;
    unreadCount: number;
  }>({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await fetch("/api/notifications?limit=10");
      if (!res.ok) return { notifications: [], unreadCount: 0 };
      return res.json();
    },
    enabled: !!session?.user,
    refetchInterval: 30000, // poll every 30s
  });

  const unreadCount = notifData?.unreadCount ?? 0;
  const notifications = notifData?.notifications ?? [];

  // Mark all as read
  const markAllRead = useMutation({
    mutationFn: async () => {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAll: true }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

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
          
          {/* Search - Desktop (opens command palette) */}
          <button
            onClick={() => document.dispatchEvent(new CustomEvent("open-command-palette"))}
            className="hidden lg:flex items-center gap-2 h-8 w-48 xl:w-56 bg-slate-900/50 border border-slate-800 rounded-xl px-3 text-xs text-slate-500 hover:border-slate-700 hover:text-slate-400 transition-all"
          >
            <Search className="h-3.5 w-3.5 shrink-0" />
            <span className="flex-1 text-left">Search...</span>
            <kbd className="inline-flex h-5 items-center rounded border border-slate-700 bg-slate-800 px-1.5 text-[10px] font-mono text-slate-600">
              CtrlK
            </kbd>
          </button>

          {/* Notification Bell */}
          <div className="relative" ref={notifRef}>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg shrink-0 relative"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 min-w-[16px] px-1 flex items-center justify-center rounded-full bg-indigo-600 text-[9px] font-black text-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-80 bg-[#0f1420] border border-slate-800 rounded-2xl shadow-2xl shadow-black/40 overflow-hidden z-50"
                >
                  <div className="flex items-center justify-between p-4 border-b border-slate-800/50">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Notifications
                    </span>
                    {unreadCount > 0 && (
                      <button
                        onClick={() => markAllRead.mutate()}
                        className="flex items-center gap-1 text-[10px] font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-wider"
                      >
                        <CheckCheck className="h-3 w-3" /> Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-slate-600 text-sm font-medium">
                        No notifications yet
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <button
                          key={notif.id}
                          onClick={() => {
                            setShowNotifications(false);
                            if (notif.link) router.push(notif.link);
                          }}
                          className={cn(
                            "w-full text-left p-4 border-b border-slate-800/30 hover:bg-slate-800/30 transition-colors",
                            !notif.is_read && "bg-indigo-500/5"
                          )}
                        >
                          <div className="flex items-start gap-3">
                            {!notif.is_read && (
                              <div className="mt-1.5 h-2 w-2 rounded-full bg-indigo-500 shrink-0" />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-white truncate">
                                {notif.title}
                              </p>
                              {notif.message && (
                                <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                                  {notif.message}
                                </p>
                              )}
                            </div>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

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

      {/* Command Palette Search */}
      <CommandPalette />
    </header>
  );
}
