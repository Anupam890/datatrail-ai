"use client";

import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import SQLDemo from "@/components/sections/SQLDemo";
import Features from "@/components/sections/Features";
import Stats from "@/components/sections/Stats";
import AIAssistant from "@/components/sections/AIAssistant";
import CTA from "@/components/sections/CTA";
import { Database, Twitter, Github, Linkedin, MessageSquare } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <Navbar />
      
      <div className="relative">
        <Hero />
        <Stats />
        <SQLDemo />
        <Features />
        <AIAssistant />
        <CTA />
      </div>

      <footer className="py-32 border-t border-white/5 bg-[#0B0F19] relative overflow-hidden">
        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-20 relative z-10">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Database className="w-6 h-6 text-primary" />
              </div>
              <span className="text-2xl font-black text-white tracking-tighter uppercase italic">Data<span className="text-primary">Trail</span></span>
            </div>
            <p className="text-white/40 text-sm max-w-sm mb-10 leading-loose font-medium">
              The premium data engineering platform for the next generation of architects. Built for builders, by builders.
            </p>
            <div className="flex gap-4">
              {[
                { name: 'Twitter', icon: <Twitter className="w-5 h-5" /> },
                { name: 'GitHub', icon: <Github className="w-5 h-5" /> },
                { name: 'LinkedIn', icon: <Linkedin className="w-5 h-5" /> },
                { name: 'Discord', icon: <MessageSquare className="w-5 h-5" /> },
              ].map(social => (
                <a key={social.name} href="#" className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center hover:bg-primary hover:border-primary text-white/40 hover:text-white transition-all duration-300">
                  <span className="sr-only">{social.name}</span>
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-black text-white text-xs uppercase tracking-[0.2em] mb-8">Learning</h4>
            <ul className="space-y-4 text-xs font-bold text-white/40 uppercase tracking-widest">
              <li><a href="#" className="hover:text-primary transition-colors">Course Library</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">The Arena</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Career Paths</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Certifications</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-black text-white text-xs uppercase tracking-[0.2em] mb-8">Ecosystem</h4>
            <ul className="space-y-4 text-xs font-bold text-white/40 uppercase tracking-widest">
              <li><a href="#" className="hover:text-primary transition-colors">AI Architect</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Enterprise</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">API Docs</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Status</a></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 mt-32 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">
           <p>© 2026 DATATRAIL AI. THE GOLD STANDARD FOR DATA LEARNING.</p>
           <div className="flex gap-8">
             <a href="#" className="hover:text-white transition-colors">Privacy</a>
             <a href="#" className="hover:text-white transition-colors">Terms</a>
             <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
           </div>
        </div>
      </footer>
    </main>
  );
}
