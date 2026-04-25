"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollReveal } from "../ui/scroll-reveal";
import { Sparkles, Terminal, Play, Table as TableIcon, Database, ChevronRight, Activity } from "lucide-react";
import { AnimatedText } from "../ui/animated-text";

const EXAMPLE_QUERY = `SELECT 
  product_name, 
  SUM(revenue) as total_rev 
FROM production.sales 
GROUP BY 1 
ORDER BY 2 DESC 
LIMIT 5;`;

const MOCK_DATA = [
  { name: "Premium SaaS Plan", revenue: "$42,500" },
  { name: "AI Power Pack", revenue: "$31,200" },
  { name: "Data Connect Pro", revenue: "$18,900" },
  { name: "Analytics Add-on", revenue: "$12,400" },
  { name: "Priority Support", revenue: "$9,800" },
];

export default function SQLDemo() {
  const [isRunning, setIsRunning] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [queryStarted, setQueryStarted] = useState(false);

  const runQuery = () => {
    setIsRunning(true);
    setShowResults(false);
    setTimeout(() => {
      setIsRunning(false);
      setShowResults(true);
    }, 1500);
  };

  useEffect(() => {
    const timer = setTimeout(() => setQueryStarted(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="py-32 relative overflow-hidden bg-[#0B0F19]">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-secondary/5 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <ScrollReveal direction="up" distance={40} className="text-center mb-24">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-[10px] font-black uppercase tracking-widest mb-6">
            <Terminal className="w-3 h-3" />
            Interactive Playground
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight">
            Learn by <span className="text-gradient italic">Solving</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Don't just watch videos. Write production-scale queries and get <span className="text-white font-bold">real-time architectural feedback</span>.
          </p>
        </ScrollReveal>

        <div className="grid lg:grid-cols-5 gap-12 items-stretch">
          {/* SQL Editor Side */}
          <ScrollReveal direction="left" distance={60} className="lg:col-span-3">
            <div className="flex flex-col h-full glass-dark rounded-[2.5rem] border-white/10 shadow-2xl overflow-hidden group">
              {/* Toolbar */}
              <div className="flex items-center justify-between px-8 py-5 bg-white/5 border-b border-white/5">
                <div className="flex items-center gap-6">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500/50" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                    <Database className="w-3 h-3" />
                    production_db.sql
                  </div>
                </div>
                <button 
                  onClick={runQuery}
                  disabled={isRunning}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white text-xs font-black uppercase tracking-widest transition-all hover:bg-primary/80 active:scale-95 disabled:opacity-50 shadow-lg shadow-primary/20"
                >
                  {isRunning ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Play className="w-3.5 h-3.5 fill-current" />
                  )}
                  Run Query
                </button>
              </div>

              {/* Editor Area */}
              <div className="p-10 flex-1 font-mono text-base md:text-lg leading-relaxed min-h-[350px] bg-[#0B0F19]/50">
                {queryStarted && (
                  <div className="text-white/90">
                    <AnimatedText text={EXAMPLE_QUERY} animateOnMount={true} />
                  </div>
                )}
              </div>

              {/* Bottom Panel / AI Insight */}
              <div className="px-10 py-8 bg-primary/5 border-t border-primary/10 relative">
                <div className="flex items-start gap-5">
                   <div className="mt-1 w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                   </div>
                   <div>
                      <div className="text-[10px] font-black text-primary mb-1 uppercase tracking-widest">Architectural Insight</div>
                      <p className="text-sm text-white/70 leading-relaxed font-medium">
                        "Querying billion-row tables? Consider adding <code className="text-white bg-primary/20 px-1.5 py-0.5 rounded text-xs font-bold font-mono">CLUSTER</code> on product_id to minimize disk I/O."
                      </p>
                   </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Results Side */}
          <ScrollReveal direction="right" distance={60} className="lg:col-span-2">
            <div className="flex flex-col gap-8 h-full">
              <div className="glass-dark rounded-[2.5rem] border-white/10 p-8 flex flex-col h-full shadow-2xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
                      <TableIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-black text-white uppercase tracking-widest text-sm">Output Stream</h3>
                      <div className="text-[10px] font-bold text-muted-foreground/60 flex items-center gap-1.5 mt-0.5 uppercase">
                        <Activity className="w-3 h-3 text-emerald-500" />
                        Live Results
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-1">
                  <AnimatePresence mode="wait">
                    {showResults ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-4"
                      >
                        {MOCK_DATA.map((row, i) => (
                          <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            key={i} 
                            className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/20 transition-all group/row"
                          >
                            <span className="text-sm font-bold text-white/80 group-hover/row:text-primary transition-colors">{row.name}</span>
                            <span className="text-sm font-black text-secondary font-mono">{row.revenue}</span>
                          </motion.div>
                        ))}
                      </motion.div>
                    ) : (
                      <div className="h-full min-h-[250px] flex flex-col items-center justify-center text-center px-6">
                        <div className="w-16 h-16 rounded-3xl bg-white/5 border border-dashed border-white/10 flex items-center justify-center mb-6">
                           <Play className="w-6 h-6 text-white/20" />
                        </div>
                        <p className="text-sm font-black text-white/20 uppercase tracking-widest leading-loose">
                          {isRunning ? "Compiling Query..." : "Hit Run Query to \n Execute on Cluster"}
                        </p>
                      </div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Explanation Card */}
                <div className="mt-8 p-5 rounded-2xl border border-white/5 bg-white/5 group/ai cursor-pointer hover:bg-white/10 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <span className="text-xs font-black text-white uppercase tracking-widest group-hover/ai:text-primary transition-colors">Explain execution plan</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/20 group-hover/ai:translate-x-1 transition-all" />
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
