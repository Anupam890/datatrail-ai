"use client";

import { motion } from "framer-motion";
import { FadeIn } from "../ui/fade-in";
import { ArrowRight, Zap } from "lucide-react";
import Link from "next/link"

export default function CTA() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[600px] bg-primary/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
        <FadeIn>
          <div className="w-20 h-20 rounded-3xl bg-primary/20 flex items-center justify-center mx-auto mb-10 border border-primary/30 shadow-lg shadow-primary/10">
            <Zap className="w-10 h-10 text-primary fill-primary/20" />
          </div>
          
          <h2 className="text-4xl md:text-6xl font-black mb-8">
            Ready to become a <br />
            <span className="text-gradient italic">Data Master?</span>
          </h2>
          
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-12">
            Join 85,000+ developers mastering SQL the smart way. No fluff, just production-grade skills.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link 
              href="/signup"
              className="px-10 py-5 rounded-2xl bg-primary text-white font-black text-xl shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all flex items-center gap-3 relative group overflow-hidden"
            >
              <span className="relative z-10">Start Your Journey</span>
              <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-2 transition-transform" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </Link>
            <Link 
              href="mailto:sales@datatrail.ai"
              className="px-10 py-5 rounded-2xl border border-border bg-white/5 hover:bg-white/10 transition-all font-bold text-xl"
            >
              Talk to Sales
            </Link>
          </div>
          
          <p className="mt-10 text-sm text-muted-foreground">
             No credit card required. Free tier forever.
          </p>
        </FadeIn>
      </div>
      
      {/* Background patterns */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </section>
  );
}
