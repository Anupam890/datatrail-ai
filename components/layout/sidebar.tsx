"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  GraduationCap, 
  Trophy, 
  Terminal, 
  User, 
  ChevronLeft, 
  ChevronRight,
  Database,
  Menu,
  X
} from "lucide-react";
import { NavItem } from "./NavItem";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/learn", icon: GraduationCap, label: "Learn" },
  { href: "/challenges", icon: Trophy, label: "Challenges" },
  { href: "/playground", icon: Terminal, label: "Playground" },
  { href: "/profile", icon: User, label: "Profile" },
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#111827] border-r border-[#1F2937]">
      <div className={cn(
        "flex items-center h-16 px-6 border-b border-[#1F2937]",
        isCollapsed ? "justify-center px-0" : "justify-between"
      )}>
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 group-hover:bg-indigo-500 transition-colors shadow-[0_0_15px_rgba(99,102,241,0.3)]">
            <Database className="h-5 w-5 text-white" />
          </div>
          {!isCollapsed && (
            <motion.span 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-lg font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent"
            >
              DataTrail AI
            </motion.span>
          )}
        </Link>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-2">
          {navItems.map((item) => (
            <NavItem 
              key={item.href} 
              {...item} 
              isCollapsed={isCollapsed} 
            />
          ))}
        </div>
      </ScrollArea>

      <div className="mt-auto border-t border-[#1F2937] p-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full justify-center text-slate-400 hover:text-white hover:bg-slate-800"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : (
            <div className="flex items-center gap-2">
              <ChevronLeft className="h-4 w-4" />
              <span className="text-xs">Collapse Sidebar</span>
            </div>
          )}
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 80 : 240 }}
        className={cn(
          "hidden md:flex flex-col fixed inset-y-0 left-0 z-50 transition-all duration-300",
        )}
      >
        {sidebarContent}
      </motion.aside>

      {/* Mobile Sidebar (Sheet) */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="fixed top-3 left-4 z-50 text-slate-400">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-[280px] bg-[#111827] border-r-[#1F2937]">
            <div className="flex flex-col h-full">
              <div className="flex items-center h-16 px-6 border-b border-[#1F2937]">
                 <Link href="/dashboard" className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
                    <Database className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-lg font-bold text-white">DataTrail AI</span>
                </Link>
              </div>
              <ScrollArea className="flex-1 px-3 py-4">
                <div className="space-y-2">
                  {navItems.map((item) => (
                    <NavItem key={item.href} {...item} />
                  ))}
                </div>
              </ScrollArea>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
