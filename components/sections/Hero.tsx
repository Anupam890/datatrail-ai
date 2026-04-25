"use client";

import { motion } from "framer-motion";
import { ChevronRight, Play, Zap, Sparkles, Database, Users } from "lucide-react";
import Link from "next/link";
import { ScrollReveal } from "../ui/scroll-reveal";
import { CountUp } from "../ui/count-up";

export default function Hero() {
  return (
    <section className="relative min-h-[110vh] flex items-center justify-center pt-32 pb-20 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,rgba(99,102,241,0.15),transparent_70%)]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light" />
        
        {/* Animated Orbs */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-20 left-1/4 w-[400px] h-[400px] bg-primary/20 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
          className="absolute bottom-40 right-1/4 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px]" 
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        <ScrollReveal direction="up" distance={40}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/80 text-xs font-black uppercase tracking-[0.2em] mb-10 shadow-2xl backdrop-blur-xl">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
            Learn SQL by Building Real Apps
          </div>

          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tight mb-8 leading-[0.95] text-white">
            MASTER <span className="text-gradient italic">DATA</span> <br />
            AT SCALE
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
            Stop querying dummy tables. Master SQL by solving production problems with <span className="text-white">billion-row datasets</span> and AI-guided paths.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-24">
            <Link 
              href="/signup"
              className="group relative px-10 py-5 rounded-2xl bg-white text-black font-black text-lg overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_20px_50px_rgba(255,255,255,0.1)]"
            >
              <span className="relative z-10 flex items-center gap-2">
                START LEARNING FREE
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-primary/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </Link>
            
            <Link 
              href="/arena"
              className="px-10 py-5 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all font-black text-lg text-white flex items-center gap-3 active:scale-95"
            >
              <Play className="w-5 h-5 fill-current text-primary" />
              EXPLORE ARENA
            </Link>
          </div>
        </ScrollReveal>

        {/* Hero Visual Mockup */}
        <ScrollReveal direction="up" delay={0.2} distance={60}>
          <div className="relative max-w-5xl mx-auto">
            {/* The Main Terminal */}
            <div className="glass-dark rounded-[2.5rem] p-3 md:p-6 border-white/10 shadow-2xl relative group overflow-hidden">
              <div className="bg-[#0B0F19] rounded-[2rem] border border-white/5 overflow-hidden flex flex-col items-start p-8 font-mono text-sm shadow-inner min-h-[400px]">
                <div className="flex items-center gap-2 mb-8 border-b border-white/5 w-full pb-4 opacity-50">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-rose-500/30" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/30" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/30" />
                  </div>
                  <span className="ml-4 text-[10px] tracking-widest uppercase font-bold">query_optimizer_v4.sql</span>
                </div>
                
                <div className="flex flex-col gap-3 text-left w-full">
                  <div className="flex gap-4">
                    <span className="text-muted-foreground/30 select-none">01</span>
                    <span className="text-primary font-bold">WITH</span>
                    <span className="text-white">user_metrics</span>
                    <span className="text-primary font-bold">AS</span>
                    <span className="text-white">(</span>
                  </div>
                  <div className="flex gap-4 ml-8">
                    <span className="text-muted-foreground/30 select-none">02</span>
                    <span className="text-primary font-bold">SELECT</span>
                    <span className="text-white">user_id, SUM(order_total)</span>
                  </div>
                  <div className="flex gap-4 ml-8">
                    <span className="text-muted-foreground/30 select-none">03</span>
                    <span className="text-primary font-bold">FROM</span>
                    <span className="text-white">production.orders</span>
                  </div>
                  <div className="flex gap-4 ml-8">
                    <span className="text-muted-foreground/30 select-none">04</span>
                    <span className="text-primary font-bold">WHERE</span>
                    <span className="text-white">created_at &gt; NOW() - INTERVAL '30 days'</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-muted-foreground/30 select-none">05</span>
                    <span className="text-white">)</span>
                  </div>
                  
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 }}
                    className="mt-8 p-6 rounded-2xl bg-primary/10 border border-primary/20 relative max-w-md self-end group-hover:scale-105 transition-transform duration-500"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-primary fill-current" />
                      <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">AI Performance Tip</span>
                    </div>
                    <p className="text-xs text-white/80 leading-relaxed font-medium">
                      "This query scans 1.2B rows. Consider partitioning by <code className="text-primary">created_at</code> to reduce execution time by 82%."
                    </p>
                    <div className="absolute -top-3 right-8 w-4 h-4 bg-[#0B0F19] border-t border-l border-primary/20 rotate-45" />
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Floating Stats Card */}
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-12 -right-12 w-72 p-8 glass-dark rounded-3xl border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] z-20 hidden md:block"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-secondary/20 flex items-center justify-center text-secondary">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Active Datasets</div>
                  <div className="text-xl font-black text-white">4.2 PB</div>
                </div>
              </div>
              <div className="space-y-3">
                 <div className="flex justify-between text-[10px] font-bold text-white/40 uppercase tracking-tighter">
                   <span>Query Load</span>
                   <span className="text-secondary font-black">98.4%</span>
                 </div>
                 <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: '98%' }}
                      transition={{ duration: 1.5, delay: 0.8 }}
                      className="h-full bg-gradient-to-r from-secondary to-primary" 
                    />
                 </div>
              </div>
            </motion.div>

            {/* Student Floating Card */}
            <motion.div 
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -top-12 -left-12 p-6 glass-dark rounded-3xl border-white/10 shadow-2xl z-20 hidden lg:flex items-center gap-4"
            >
              <div className="flex -space-x-3">
                {[1,2,3].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0B0F19] bg-card overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 100}`} alt="user" />
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-[#0B0F19] bg-primary flex items-center justify-center text-[10px] font-black text-white">
                  +2k
                </div>
              </div>
              <div>
                <div className="text-xs font-black text-white leading-none">JOINED RECENTLY</div>
                <div className="text-[10px] text-muted-foreground mt-1 font-bold">UPGRADING SKILLS</div>
              </div>
            </motion.div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
