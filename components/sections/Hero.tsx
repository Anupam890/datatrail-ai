"use client";

import { motion } from "framer-motion";
import { AnimatedText } from "../ui/animated-text";
import { ChevronRight, Play } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 -left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Floating Elements */}
      <motion.div 
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/3 right-10 md:right-40 p-4 rounded-2xl glass border-primary/20 hidden lg:block"
      >
        <div className="flex items-center gap-2 text-xs font-mono text-primary">
          <span className="w-2 h-2 rounded-full bg-primary" />
          SELECT * FROM skills
        </div>
      </motion.div>

      <motion.div 
        animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-1/3 left-10 md:left-40 p-4 rounded-2xl glass border-secondary/20 hidden lg:block"
      >
        <div className="flex items-center gap-2 text-xs font-mono text-secondary">
          <span className="w-2 h-2 rounded-full bg-secondary" />
          OPTIMIZE QUERY...
        </div>
      </motion.div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            New: SQL Optimization Course out now
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6 leading-[1.1]">
            Master SQL with <br />
            <span className="text-gradient">AI Power</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Practice, learn, and optimize SQL queries with real-world datasets and AI guidance. The most interactive way to become a data pro.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/signup"
              className="group relative px-8 py-4 rounded-full bg-primary text-white font-bold text-lg overflow-hidden transition-all hover:pr-10"
            >
              <span className="relative z-10">Start Learning Free</span>
              <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all" />
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </Link>
            <Link 
              href="/arena"
              className="px-8 py-4 rounded-full border border-border bg-white/5 hover:bg-white/10 hover:border-muted-foreground/50 transition-all font-bold text-lg flex items-center gap-2"
            >
              <Play className="w-5 h-5 fill-current" />
              Explore Challenges
            </Link>
          </div>
        </motion.div>

        {/* Hero Visual Mockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mt-20 glass rounded-3xl p-4 md:p-8 aspect-[16/9] max-w-4xl mx-auto relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60 z-10 rounded-3xl" />
          
          <div className="w-full h-full rounded-2xl bg-[#0d1117] border border-white/5 overflow-hidden flex flex-col items-start p-6 font-mono text-sm">
            <div className="flex items-center gap-2 mb-6 opacity-40">
              <div className="w-3 h-3 rounded-full bg-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-green-500/50" />
            </div>
            
            <div className="flex flex-col gap-2 text-left w-full">
              <div className="flex gap-2">
                <span className="text-indigo-400">SELECT</span>
                <span className="text-white">u.name, COUNT(o.id) as total_orders</span>
              </div>
              <div className="flex gap-2">
                <span className="text-indigo-400">FROM</span>
                <span className="text-white">users u</span>
              </div>
              <div className="flex gap-2">
                <span className="text-indigo-400">JOIN</span>
                <span className="text-white">orders o ON u.id = o.user_id</span>
              </div>
              <div className="flex gap-2">
                <span className="text-indigo-400">GROUP BY</span>
                <span className="text-white">u.id</span>
              </div>
              <div className="flex gap-2">
                <span className="text-indigo-400">HAVING</span>
                <span className="text-white">total_orders &gt; 5;</span>
              </div>
              
              <div className="mt-8 pt-8 border-t border-white/5 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-[10px] text-primary">AI</span>
                  </div>
                  <div className="px-4 py-2 rounded-2xl bg-white/5 text-muted-foreground max-w-sm">
                    <AnimatedText text="This query is efficient, but you could add an index on user_id to speed up the join." />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Dashboard overlay bit */}
          <div className="absolute -bottom-10 -right-10 w-64 p-6 glass rounded-2xl border-primary/20 shadow-2xl z-20 hidden md:block animate-float">
             <div className="text-xs text-muted-foreground mb-1">Weekly Progress</div>
             <div className="text-xl font-bold mb-4">84% Complete</div>
             <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: '84%' }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                  className="h-full bg-primary" 
                />
             </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
