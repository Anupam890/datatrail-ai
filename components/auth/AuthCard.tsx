"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AuthCardProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  className?: string;
}

export default function AuthCard({ children, title, subtitle, className }: AuthCardProps) {
  return (
    <div
      className={cn(
        "w-full glass-dark border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] relative overflow-hidden group",
        className
      )}
    >
      {/* Decorative Glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-[60px] group-hover:bg-primary/20 transition-all duration-700" />
      
      <div className="relative z-10">
        <div className="flex flex-col items-start mb-10">
          <h1 className="text-3xl md:text-4xl font-black text-white mb-3 tracking-tight italic uppercase">{title}</h1>
          {subtitle && (
            <p className="text-white/40 text-sm font-medium leading-relaxed max-w-[280px]">
              {subtitle}
            </p>
          )}
        </div>

        {children}
      </div>
    </div>
  );
}

