"use client";

import { motion } from "framer-motion";
import { ScrollReveal } from "../ui/scroll-reveal";
import { ArrowRight, Zap, Star, ShieldCheck, Globe } from "lucide-react";
import Link from "next/link";

export default function CTA() {
  return (
    <section className="py-40 relative overflow-hidden bg-[#0B0F19]">
      {/* Background Decor - Immersive Orbs */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[160px] animate-pulse" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[140px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="glass-dark rounded-[3.5rem] border-white/10 p-12 md:p-24 text-center relative overflow-hidden shadow-[0_0_100px_rgba(99,102,241,0.1)]">
          {/* Internal Grain Texture */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: `url('https://grainy-gradients.vercel.app/noise.svg')` }} />
          
          <ScrollReveal direction="up" distance={40}>
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/60 text-[10px] font-black uppercase tracking-[0.3em] mb-12">
              <Star className="w-3 h-3 text-secondary fill-secondary" />
              Join the data elite
            </div>
            
            <h2 className="text-5xl md:text-8xl font-black text-white mb-10 leading-[1.1] tracking-tight">
              Ready to build <br />
              <span className="text-gradient italic">the Future?</span>
            </h2>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-16 leading-relaxed font-medium">
              Join <span className="text-white font-bold">2,400+ developers</span> mastering the next generation of data engineering. Start your journey for free today.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
              <Link 
                href="/signup"
                className="px-12 py-6 rounded-[2rem] bg-white text-black font-black text-xl shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)] transition-all flex items-center gap-4 group relative overflow-hidden"
              >
                <span className="relative z-10">Start Learning</span>
                <ArrowRight className="w-6 h-6 relative z-10 group-hover:translate-x-2 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </Link>
              <Link 
                href="/curriculum"
                className="px-12 py-6 rounded-[2rem] border border-white/10 bg-white/5 hover:bg-white/10 transition-all font-black text-xl text-white uppercase tracking-widest"
              >
                View Paths
              </Link>
            </div>
            
            <div className="mt-20 flex flex-wrap items-center justify-center gap-12 border-t border-white/5 pt-12">
               {[
                 { label: "SOC2 COMPLIANT", icon: <ShieldCheck className="w-4 h-4" /> },
                 { label: "85,000+ COMPLETED PROJECTS", icon: <Zap className="w-4 h-4" /> },
                 { label: "GLOBAL ACCESS", icon: <Globe className="w-4 h-4" /> }
               ].map((item, i) => (
                 <div key={i} className="flex items-center gap-3 text-white/30 text-[9px] font-black uppercase tracking-[0.2em]">
                    {item.icon}
                    {item.label}
                 </div>
               ))}
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Decorative gradients */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
    </section>
  );
}
