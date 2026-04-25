"use client";

import { motion } from "framer-motion";
import { ScrollReveal } from "../ui/scroll-reveal";
import { AnimatedText } from "../ui/animated-text";
import { Send, User, Bot, Sparkles, Zap, ChevronRight, MessageSquare } from "lucide-react";

export default function AIAssistant() {
  return (
    <section className="py-32 relative overflow-hidden bg-[#0B0F19]">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <ScrollReveal direction="left" distance={60}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-8">
              <Sparkles className="w-3 h-3 fill-current" />
              Advanced Data-LLM
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight">
              Your Personal <br />
              <span className="text-gradient italic">Data Architect</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-10 leading-relaxed max-w-lg">
              DataTrail AI doesn't just give you answers. It teaches you the <span className="text-white font-bold">"Why"</span>. Get architectural advice, performance tips, and schema suggestions as you code.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
              {[
                { title: "Query Optimization", icon: <Zap className="w-4 h-4 text-primary" /> },
                { title: "Schema Design", icon: <MessageSquare className="w-4 h-4 text-secondary" /> },
                { title: "Window Functions", icon: <Zap className="w-4 h-4 text-amber-500" /> },
                { title: "CTE Refactoring", icon: <MessageSquare className="w-4 h-4 text-rose-500" /> }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/20 transition-all group">
                  <div className="p-2 rounded-xl bg-white/5 group-hover:bg-primary/10 transition-colors">
                    {item.icon}
                  </div>
                  <span className="text-xs font-black text-white/70 uppercase tracking-widest">{item.title}</span>
                </div>
              ))}
            </div>
            
            <button className="px-8 py-4 rounded-2xl bg-white text-black font-black text-xs uppercase tracking-widest hover:bg-white/90 transition-all flex items-center gap-2 group shadow-xl shadow-white/5">
              Try AI Chat
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </ScrollReveal>

          {/* Chat UI Mockup */}
          <ScrollReveal direction="right" distance={60}>
            <div className="glass-dark rounded-[2.5rem] border-white/10 shadow-2xl overflow-hidden relative">
              {/* Header */}
              <div className="px-8 py-5 border-b border-white/5 flex items-center justify-between bg-white/5">
                 <div className="flex items-center gap-4">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Architect Engine v1.5</span>
                 </div>
                 <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-white/20" />
                    <div className="w-2 h-2 rounded-full bg-white/20" />
                 </div>
              </div>
              
              <div className="p-8 flex flex-col gap-8 min-h-[450px] bg-[#0B0F19]/50">
                 {/* User Message */}
                 <div className="flex items-start gap-4 self-end max-w-[90%]">
                    <div className="px-5 py-4 rounded-[2rem] rounded-tr-none bg-primary text-white text-sm font-medium shadow-lg shadow-primary/20">
                       "How do I optimize a join between two billion-row tables?"
                    </div>
                    <div className="w-10 h-10 rounded-2xl bg-white/5 flex shrink-0 items-center justify-center border border-white/10">
                       <User className="w-5 h-5 text-white/50" />
                    </div>
                 </div>
                 
                 {/* AI Response */}
                 <div className="flex items-start gap-4 max-w-[90%]">
                    <div className="w-10 h-10 rounded-2xl bg-primary/20 flex shrink-0 items-center justify-center border border-primary/20">
                       <Bot className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex flex-col gap-4">
                      <div className="px-5 py-4 rounded-[2rem] rounded-tl-none bg-white/5 border border-white/10 text-sm font-medium text-white/80 leading-relaxed">
                         <AnimatedText 
                           text="For billion-row joins, avoid nested loops. Use Hash Joins and ensure your join keys are indexed. Consider pre-aggregating data in a materialized view if possible." 
                           animateOnMount={true}
                           delay={1000}
                         />
                      </div>
                      <div className="p-5 bg-black/40 rounded-2xl border border-white/5 font-mono text-[11px] leading-loose text-indigo-300 shadow-inner">
                         <span className="text-primary font-bold uppercase tracking-widest block mb-2 text-[10px]">Materialized View Strategy</span>
                         <span className="text-indigo-400">CREATE MATERIALIZED VIEW</span> daily_summary <span className="text-indigo-400">AS</span> <br />
                         <span className="text-indigo-400">SELECT</span> order_date, SUM(total) <br />
                         <span className="text-indigo-400">FROM</span> orders <span className="text-indigo-400">GROUP BY</span> 1;
                      </div>
                    </div>
                 </div>
                 
                 {/* Message Input Mock */}
                 <div className="mt-auto pt-6 border-t border-white/5">
                    <div className="w-full relative">
                       <div className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                          Ask your personal architect...
                       </div>
                       <div className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary group cursor-pointer hover:bg-primary transition-colors">
                          <Send className="w-4 h-4 group-hover:text-white" />
                       </div>
                    </div>
                 </div>
              </div>

              {/* Floating metrics */}
              <div className="absolute -top-4 -right-4 p-4 rounded-2xl glass-dark border-white/10 shadow-2xl">
                 <div className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mb-1">LATENCY</div>
                 <div className="text-xs font-black text-emerald-500">84ms</div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
