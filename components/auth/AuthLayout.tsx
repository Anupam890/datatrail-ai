"use client";

import { motion } from "framer-motion";
import { Database, Sparkles, Terminal, Code2, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full flex bg-[#0B0F19] overflow-hidden selection:bg-primary/30">
      {/* Left Section - Branding & Visuals (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-[45%] relative flex-col items-center justify-center p-12 overflow-hidden border-r border-white/5">
        {/* Immersive Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-50 mix-blend-overlay" />
          <div className="absolute top-[-10%] left-[-10%] w-[80%] h-[80%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[80%] h-[80%] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
          
          {/* Animated Grid */}
          <div className="absolute inset-0 opacity-[0.03]" 
            style={{ 
              backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
              backgroundSize: '50px 50px'
            }} 
          />
        </div>

        {/* Floating Architectural Elements */}
        <motion.div 
          animate={{ y: [0, -15, 0], rotate: [0, 1, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[15%] right-[10%] p-5 glass-dark border-white/10 rounded-2xl z-10 w-64 shadow-2xl backdrop-blur-3xl"
        >
          <div className="flex items-center gap-2 mb-3">
             <div className="w-1.5 h-1.5 rounded-full bg-red-500/40" />
             <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/40" />
             <div className="w-1.5 h-1.5 rounded-full bg-green-500/40" />
             <div className="ml-auto flex items-center gap-1 text-[8px] font-bold text-white/20 uppercase tracking-widest">
               <Terminal className="w-2.5 h-2.5" /> Live
             </div>
          </div>
          <div className="font-mono text-[10px] space-y-1.5">
             <div className="text-white/40 italic">-- Optimization Suggestion</div>
             <div className="flex gap-2"><span className="text-primary font-bold">CREATE</span><span className="text-white/60">INDEX</span></div>
             <div className="flex gap-2"><span className="text-white/60">idx_user_events</span><span className="text-primary font-bold">ON</span></div>
             <div className="flex gap-2"><span className="text-white/60">analytics.events(user_id);</span></div>
          </div>
        </motion.div>

        <motion.div 
          animate={{ y: [0, 15, 0], rotate: [0, -1, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[20%] left-[10%] p-5 glass-dark border-white/10 rounded-2xl z-10 w-60 shadow-2xl backdrop-blur-3xl"
        >
           <div className="flex items-center gap-2 mb-3 text-emerald-400 text-[9px] font-black uppercase tracking-widest">
              <div className="p-1 rounded-md bg-emerald-500/10">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              Schema Verified
           </div>
           <div className="text-[11px] text-white/50 leading-relaxed font-medium">
              DataTrail ensures your query patterns follow modern production standards.
           </div>
        </motion.div>

        {/* Branding Content */}
        <div className="relative z-20 text-center max-w-md px-4">
          <Link href="/" className="inline-block group mb-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-5 rounded-[2rem] bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-all duration-500 group-hover:scale-105 group-hover:rotate-6"
            >
              <Database className="w-14 h-14 text-primary" />
            </motion.div>
          </Link>
          
          <div className="space-y-6">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl font-black text-white leading-[1.1] tracking-tight italic uppercase"
            >
              Architect Your <br />
              <span className="text-gradient">Data Future</span>
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg text-white/40 leading-relaxed font-medium"
            >
              Join 2,400+ developers mastering the art of high-scale data engineering.
            </motion.p>
          </div>
        </div>

        {/* Feature Pills */}
        <div className="absolute bottom-12 flex gap-4">
           {[
             { icon: Zap, label: 'Real-time' },
             { icon: Code2, label: 'Production' },
             { icon: Sparkles, label: 'AI Powered' }
           ].map((f, i) => (
             <motion.div 
               key={f.label}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.5 + i * 0.1 }}
               className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/5 text-[9px] font-black text-white/40 uppercase tracking-widest"
             >
               <f.icon className="w-3 h-3 text-primary" />
               {f.label}
             </motion.div>
           ))}
        </div>
      </div>

      {/* Right Section - Auth Form */}
      <div className="w-full lg:w-[55%] flex items-center justify-center p-6 md:p-16 relative bg-[#0B0F19]">
        {/* Background Texture for Right side too */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />
        
        {/* Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="w-full max-w-lg relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {children}
          </motion.div>

          <div className="mt-8 text-center">
            <Link href="/" className="text-[10px] font-bold text-white/20 hover:text-white transition-colors uppercase tracking-[0.3em]">
              &larr; Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
