"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface NavItemProps {
  href: string;
  icon: LucideIcon;
  label: string;
  isCollapsed?: boolean;
}

export function NavItem({ href, icon: Icon, label, isCollapsed }: NavItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={cn(
        "group relative flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-300",
        isActive 
          ? "bg-indigo-600/10 text-indigo-400" 
          : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
      )}
    >
      <div className="relative">
        <Icon className={cn("h-5 w-5 shrink-0 transition-transform duration-300 group-hover:scale-110", 
          isActive ? "text-indigo-400" : "text-slate-400 group-hover:text-slate-200"
        )} />
        {isActive && (
          <motion.div
            layoutId="activeGlow"
            className="absolute -inset-2 rounded-full bg-indigo-500/20 blur-md"
            initial={false}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
      </div>
      
      {!isCollapsed && (
        <span className="text-sm font-medium transition-opacity duration-300">
          {label}
        </span>
      )}

      {isActive && !isCollapsed && (
        <motion.div
          layoutId="activeIndicator"
          className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-500"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}

      {isCollapsed && (
        <div className="absolute left-full ml-2 hidden rounded-md bg-slate-900 px-2 py-1 text-xs text-slate-200 group-hover:block whitespace-nowrap z-50 border border-slate-800">
          {label}
        </div>
      )}
    </Link>
  );
}
