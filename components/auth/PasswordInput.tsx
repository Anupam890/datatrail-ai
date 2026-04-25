"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label: string;
}

export default function PasswordInput({ error, label, className, value, ...props }: PasswordInputProps) {
  const [show, setShow] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value && value.toString().length > 0;

  return (
    <div className="space-y-2 relative group">
      <div className={cn(
        "relative rounded-2xl border transition-all duration-500 overflow-hidden",
        isFocused 
          ? "border-primary shadow-[0_0_20px_-5px_rgba(99,102,241,0.3)] bg-primary/5" 
          : "border-white/5 bg-white/[0.03] hover:border-white/10 hover:bg-white/[0.05]",
        error ? "border-destructive/50 shadow-[0_0_20px_-5px_rgba(239,68,68,0.2)]" : ""
      )}>
        <div className={cn(
          "absolute left-5 top-1/2 -translate-y-1/2 transition-all duration-500",
          isFocused ? "text-primary scale-110" : "text-white/20"
        )}>
          <Lock className="w-5 h-5" />
        </div>
        
        <div className="relative pt-7 pb-3 px-14">
           <label className={cn(
             "absolute left-14 transition-all duration-500 pointer-events-none select-none",
             (isFocused || hasValue) 
               ? "top-2.5 text-[9px] uppercase font-black tracking-[0.2em] text-primary" 
               : "top-1/2 -translate-y-1/2 text-sm font-medium text-white/30"
           )}>
             {label}
           </label>
           <Input
             type={show ? "text" : "password"}
             className={cn(
               "h-6 w-full p-0 border-0 bg-transparent focus-visible:ring-0 placeholder:opacity-0 transition-all text-white font-medium selection:bg-primary/30",
               className
             )}
             onFocus={() => setIsFocused(true)}
             onBlur={() => setIsFocused(false)}
             value={value}
             {...props}
           />
        </div>

        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-5 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-all duration-300"
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      
      <AnimatePresence>
        {error && (
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-[10px] font-black text-destructive px-2 uppercase tracking-widest flex items-center gap-1.5"
          >
            <span className="w-1 h-1 rounded-full bg-destructive animate-pulse" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
