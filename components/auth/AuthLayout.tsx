"use client";

import { motion } from "framer-motion";
import { Database, Sparkles, Terminal } from "lucide-react";
import AnimatedText from "../ui/AnimatedText";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full flex bg-[#0B0F19] overflow-hidden">
      {/* Left Section - Branding & Visuals (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col items-center justify-center p-12 overflow-hidden border-r border-border/50">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
          
          {/* Floating Grid Pattern */}
          <div className="absolute inset-0 opacity-20" 
            style={{ 
              backgroundImage: 'radial-gradient(circle at 2px 2px, var(--border) 1px, transparent 0)',
              backgroundSize: '40px 40px'
            }} 
          />
        </div>

        {/* Floating Code Snippets */}
        <motion.div 
          animate={{ y: [0, -20, 0], rotate: [0, 2, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] right-[10%] p-6 glass border-primary/20 rounded-2xl z-10 w-72 shadow-2xl"
        >
          <div className="flex items-center gap-2 mb-4">
             <div className="w-2 h-2 rounded-full bg-red-500/50" />
             <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
             <div className="w-2 h-2 rounded-full bg-green-500/50" />
          </div>
          <div className="font-mono text-[10px] text-indigo-300 space-y-1">
             <div className="flex gap-1"><span className="text-primary">SELECT</span><span>*</span></div>
             <div className="flex gap-1"><span className="text-primary">FROM</span><span>production_data</span></div>
             <div className="flex gap-1"><span className="text-primary">WHERE</span><span>latency &lt; 100ms;</span></div>
          </div>
        </motion.div>

        <motion.div 
          animate={{ y: [0, 20, 0], rotate: [0, -2, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[25%] left-[10%] p-6 glass border-secondary/20 rounded-2xl z-10 w-64 shadow-2xl"
        >
           <div className="flex items-center gap-2 mb-2 text-secondary text-[10px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3 h-3" />
              AI Optimization
           </div>
           <div className="text-xs text-muted-foreground leading-relaxed">
              "Add an index to user_id to speed up the join by 45%."
           </div>
        </motion.div>

        {/* Main Branding Content */}
        <div className="relative z-20 text-center max-w-lg">
          <Link href="/">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="inline-flex p-4 rounded-3xl bg-primary/10 border border-primary/20 mb-8 hover:bg-primary/20 transition-colors"
            >
              <Database className="w-12 h-12 text-primary" />
            </motion.div>
          </Link>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl font-black text-white mb-6 leading-tight"
          >
            Master SQL with <br />
            <span className="text-gradient">AI Guidance</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-muted-foreground leading-relaxed"
          >
            Practice, learn, and optimize queries effortlessly with our production-grade datasets and real-time AI architect.
          </motion.p>
        </div>

        {/* Bottom pattern indicator */}
        <div className="absolute bottom-12 flex gap-2">
           {[0,1,2].map(i => (
             <div key={i} className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-primary' : 'bg-border'}`} />
           ))}
        </div>
      </div>

      {/* Right Section - Auth Form (Full width on mobile) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 relative">
        {/* Mobile Background Decoration */}
        <div className="lg:hidden absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[80px]" />
        </div>
        
        <div className="w-full max-w-md relative z-10">
          {children}
        </div>
      </div>
    </div>
  );
}
