"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedText } from "../ui/animated-text";
import { FadeIn } from "../ui/fade-in";
import { Sparkles, Terminal, Play, Table as TableIcon } from "lucide-react";

const EXAMPLE_QUERY = `SELECT 
  product_name, 
  SUM(revenue) as total_rev 
FROM sales 
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
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <FadeIn className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4">Learn by <span className="text-primary italic">Doing</span></h2>
          <p className="text-muted-foreground text-lg">Real queries, real data, instant AI feedback.</p>
        </FadeIn>

        <div className="grid lg:grid-cols-5 gap-10 items-stretch">
          {/* SQL Editor Side */}
          <div className="lg:col-span-3 flex flex-col h-full bg-[#0d1117] rounded-3xl border border-border shadow-2xl shadow-primary/5 overflow-hidden">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-6 py-4 bg-white/5 border-b border-white/5">
              <div className="flex items-center gap-4">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/30" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/30" />
                  <div className="w-3 h-3 rounded-full bg-green-500/30" />
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-muted-foreground uppercase tracking-widest">
                  <Terminal className="w-3 h-3" />
                  query_editor.sql
                </div>
              </div>
              <button 
                onClick={runQuery}
                disabled={isRunning}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-sm font-bold transition-all hover:bg-primary/80 active:scale-95 disabled:opacity-50"
              >
                {isRunning ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Play className="w-4 h-4 fill-current" />
                )}
                Run Query
              </button>
            </div>

            {/* Editor Area */}
            <div className="p-8 flex-1 font-mono text-lg leading-relaxed min-h-[300px]">
              {queryStarted && (
                <div className="text-indigo-400">
                  <AnimatedText text={EXAMPLE_QUERY} animateOnMount={true} />
                </div>
              )}
            </div>

            {/* Bottom Panel / AI Insight */}
            <div className="px-8 py-6 bg-primary/5 border-t border-primary/10">
              <div className="flex items-start gap-4">
                 <div className="mt-1 w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                    <Sparkles className="w-3 h-3 text-primary animate-pulse" />
                 </div>
                 <div>
                    <div className="text-xs font-bold text-primary mb-1 uppercase tracking-widest">AI Suggestion</div>
                    <p className="text-sm text-muted-foreground">Try using <code className="text-white bg-white/5 px-1 rounded">PARTITION BY</code> to analyze month-over-month growth within these categories.</p>
                 </div>
              </div>
            </div>
          </div>

          {/* Results Side */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-card rounded-3xl border border-border p-6 h-full flex flex-col shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <TableIcon className="w-5 h-5 text-secondary" />
                  <h3 className="font-bold">Output Table</h3>
                </div>
                <div className="text-[10px] font-mono text-muted-foreground px-2 py-0.5 rounded bg-white/5 border border-white/5">
                  5 RECORDS
                </div>
              </div>

              <div className="flex-1 overflow-hidden">
                <AnimatePresence mode="wait">
                  {showResults ? (
                    <motion.table 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="w-full text-sm text-left border-collapse"
                    >
                      <thead>
                        <tr className="border-b border-border">
                          <th className="py-3 font-semibold text-muted-foreground">Product</th>
                          <th className="py-3 text-right font-semibold text-muted-foreground">Revenue</th>
                        </tr>
                      </thead>
                      <tbody>
                        {MOCK_DATA.map((row, i) => (
                          <motion.tr 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            key={i} 
                            className="border-b border-border/50 group"
                          >
                            <td className="py-4 font-medium group-hover:text-primary transition-colors">{row.name}</td>
                            <td className="py-4 text-right font-mono text-secondary">{row.revenue}</td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </motion.table>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-30 gap-3 italic">
                      {isRunning ? "Running..." : "Run a query to see results"}
                    </div>
                  )}
                </AnimatePresence>
              </div>

              {/* Action Button */}
              <button className="mt-6 w-full py-4 rounded-2xl border border-border bg-white/5 hover:bg-white/10 transition-all font-bold group flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-primary group-hover:animate-bounce" />
                Explain with AI
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
