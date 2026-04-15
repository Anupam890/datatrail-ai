"use client";

import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import SQLDemo from "@/components/sections/SQLDemo";
import Features from "@/components/sections/Features";
import Stats from "@/components/sections/Stats";
import AIAssistant from "@/components/sections/AIAssistant";
import CTA from "@/components/sections/CTA";
import { Database } from "lucide-react";

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

      <footer className="py-20 border-t border-border/50 bg-[#0B0F19]">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <Database className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold text-white">DataTrail <span className="text-primary">AI</span></span>
            </div>
            <p className="text-muted-foreground text-sm max-w-sm mb-8 leading-relaxed">
              The premium SQL learning platform for the next generation of data engineers and analysts. Built by developers, for developers.
            </p>
            <div className="flex gap-4">
              {['Twitter', 'GitHub', 'LinkedIn', 'Youtube'].map(social => (
                <a key={social} href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center hover:bg-primary/20 hover:border-primary/20 hover:text-primary transition-all">
                  <span className="sr-only">{social}</span>
                  <div className="w-5 h-5 bg-current mask-icon" />
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-white mb-6">Product</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Course Library</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Challenges</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">AI Assistant</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Enterprise</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-white mb-6">Company</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms</a></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
           <p>© 2026 DataTrail AI. All rights reserved.</p>
           <p>Powered by Next.js & React Bits.</p>
        </div>
      </footer>
    </main>
  );
}
