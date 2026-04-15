"use client";

import { motion } from "framer-motion";
import FadeIn from "../ui/FadeIn";
import AnimatedText from "../ui/AnimatedText";
import { Send, User, Bot, Sparkles } from "lucide-react";

export default function AIAssistant() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        <FadeIn direction="left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-6">
            <Sparkles className="w-3 h-3" />
            POWERED BY DATA-LLM
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">
            Your Personal <br />
            <span className="text-gradient">SQL Architect</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
            DataTrail AI doesn't just give you answers. It teaches you the "Why". Get architectural advice, performance tips, and schema suggestions as you code.
          </p>
          
          <ul className="space-y-4 mb-10">
            {[
              "Explain complex window functions",
              "Suggest missing indexes for performance",
              "Refactor messy legacy queries",
              "Generate boilerplate schema DDL"
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-white font-medium">
                <div className="w-5 h-5 rounded-full bg-secondary/20 flex items-center justify-center">
                   <div className="w-2 h-2 rounded-full bg-secondary" />
                </div>
                {item}
              </li>
            ))}
          </ul>
          
          <button className="px-8 py-4 rounded-2xl bg-white text-black font-bold hover:bg-white/90 transition-all flex items-center gap-2 group shadow-xl shadow-white/5">
            Try AI Chat
            <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </FadeIn>

        {/* Chat UI Mockup */}
        <FadeIn direction="right" className="relative">
          <div className="w-full bg-[#0d1117] rounded-3xl border border-border overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-white/5">
               <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-sm font-bold">SQL Assistant</span>
               </div>
               <div className="flex gap-1.5 opacity-30">
                  <div className="w-2 h-2 rounded-full bg-white" />
                  <div className="w-2 h-2 rounded-full bg-white" />
               </div>
            </div>
            
            <div className="p-6 flex flex-col gap-6 min-h-[400px]">
               {/* User Message */}
               <div className="flex items-start gap-4 self-end max-w-[85%]">
                  <div className="px-4 py-3 rounded-2xl bg-primary text-white text-sm">
                     "How can I optimize this join between orders and line_items?"
                  </div>
                  <div className="w-8 h-8 rounded-full bg-indigo-900/50 flex flex-center shrink-0 items-center justify-center border border-white/10">
                     <User className="w-4 h-4" />
                  </div>
               </div>
               
               {/* AI Response */}
               <div className="flex items-start gap-4 max-w-[85%]">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex flex-center shrink-0 items-center justify-center border border-primary/20">
                     <Bot className="w-4 h-4 text-primary" />
                  </div>
                  <div className="px-4 py-3 rounded-2xl bg-white/5 border border-border text-sm flex flex-col gap-3">
                     <div className="text-white">
                        <AnimatedText 
                          text="Since line_items is significantly larger, you should filter by product_id in a subquery or use a composite index on (order_id, product_id)." 
                          animateOnMount={true}
                          delay={1000}
                        />
                     </div>
                     <div className="p-3 bg-black/40 rounded-xl font-mono text-[12px] text-indigo-300">
                        <span className="text-indigo-400">CREATE INDEX</span> idx_items_opt <br />
                        <span className="text-indigo-400">ON</span> line_items(order_id, product_id);
                     </div>
                  </div>
               </div>
               
               {/* Message Input Mock */}
               <div className="mt-auto pt-6">
                  <div className="w-full relative">
                     <div className="w-full bg-white/5 border border-border rounded-xl px-4 py-3 text-sm text-muted-foreground">
                        Ask follow up...
                     </div>
                     <div className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center">
                        <Send className="w-3 h-3 text-primary" />
                     </div>
                  </div>
               </div>
            </div>
          </div>
          
          {/* Floating tags */}
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-6 -right-6 p-4 rounded-xl glass border-primary/20 font-mono text-[10px] text-primary"
          >
            LATENCY: 142ms
          </motion.div>
        </FadeIn>
      </div>
    </section>
  );
}
