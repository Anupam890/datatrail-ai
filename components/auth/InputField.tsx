"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: LucideIcon;
  error?: string;
  label: string;
}

export default function InputField({ icon: Icon, error, label, className, value, ...props }: InputFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value && value.toString().length > 0;

  return (
    <div className="space-y-1 relative">
      <div className={cn(
        "relative rounded-xl border transition-all duration-300 group",
        isFocused ? "border-primary ring-4 ring-primary/10 bg-primary/5" : "border-[#1F2937] bg-white/5",
        error ? "border-destructive/50 ring-destructive/10" : ""
      )}>
        <div className={cn(
          "absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300",
          isFocused ? "text-primary" : "text-muted-foreground"
        )}>
          <Icon className="w-4 h-4" />
        </div>
        
        <div className="relative pt-6 pb-2 px-12">
           <label className={cn(
             "absolute left-12 transition-all duration-300 pointer-events-none select-none",
             (isFocused || hasValue) 
               ? "top-2 text-[10px] uppercase font-bold tracking-widest text-primary" 
               : "top-1/2 -translate-y-1/2 text-sm text-muted-foreground"
           )}>
             {label}
           </label>
           <Input
             className={cn(
               "h-6 w-full p-0 border-0 bg-transparent focus-visible:ring-0 placeholder:opacity-0 transition-opacity",
               className
             )}
             onFocus={() => setIsFocused(true)}
             onBlur={() => setIsFocused(false)}
             value={value}
             {...props}
           />
        </div>
      </div>
      
      <AnimatePresence>
        {error && (
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-[10px] font-bold text-destructive px-1 uppercase tracking-wider"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
