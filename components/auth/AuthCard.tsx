"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Database } from "lucide-react";

interface AuthCardProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  className?: string;
}

export default function AuthCard({ children, title, subtitle, className }: AuthCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "w-full bg-[#111827]/60 backdrop-blur-2xl border border-[#1F2937] rounded-[2rem] p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden",
        className
      )}
    >
      <div className="flex flex-col items-start mb-8">
        <h1 className="text-3xl font-black text-white mb-2 tracking-tight">{title}</h1>
        {subtitle && <p className="text-muted-foreground text-sm font-medium">{subtitle}</p>}
      </div>

      {children}
    </motion.div>
  );
}

