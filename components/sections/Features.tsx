"use client";

import { motion } from "framer-motion";
import { SpotlightCard } from "../ui/spotlight-card";
import { FadeIn } from "../ui/fade-in";
import { BrainCircuit, Database, Target, TrendingUp, Cpu, Lock } from "lucide-react";

const FEATURES = [
  {
    title: "AI Query Assistant",
    description: "Stuck on a join? Ask our AI to explain concepts, suggest optimizations, or debug syntax errors in real-time.",
    icon: <BrainCircuit className="w-8 h-8 text-primary" />,
    glowColor: "rgba(99, 102, 241, 0.2)"
  },
  {
    title: "Real-world Challenges",
    description: "No more dummy 'students' tables. Practice with billion-row datasets from industries like Fintech, E-commerce, and SaaS.",
    icon: <Database className="w-8 h-8 text-secondary" />,
    glowColor: "rgba(34, 197, 94, 0.2)"
  },
  {
    title: "Targeted Path",
    description: "Follow curated paths for Data Engineering, Analytics, or Machine Learning. Master the specific SQL needed for your career.",
    icon: <Target className="w-8 h-8 text-amber-500" />,
    glowColor: "rgba(245, 158, 11, 0.2)"
  },
  {
    title: "Live Progress",
    description: "Visual charts and skill heatmaps help you identify exactly where you need to improve before that big interview.",
    icon: <TrendingUp className="w-8 h-8 text-rose-500" />,
    glowColor: "rgba(239, 68, 68, 0.2)"
  }
];

export default function Features() {
  return (
    <section className="py-24 bg-[#0B0F19]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-16">
          <FadeIn className="max-w-2xl text-left" direction="left">
            <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
              Engineered for <br />
              <span className="text-primary italic">Practical Excellence</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              We ditched the boring lectures. DataTrail is built for developers who want to learn by solving real production problems.
            </p>
          </FadeIn>
          <FadeIn direction="right">
            <div className="flex items-center gap-4 p-4 rounded-2xl glass border-white/5">
                <div className="flex -space-x-3">
                   {[1,2,3,4].map(i => (
                     <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-card flex items-center justify-center overflow-hidden">
                       <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="user" />
                     </div>
                   ))}
                </div>
                <div className="text-sm">
                  <div className="font-bold">2,400+ Students</div>
                  <div className="text-muted-foreground text-xs text-secondary">Active this hour</div>
                </div>
            </div>
          </FadeIn>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feature, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <SpotlightCard 
                className="h-full group hover:-translate-y-2 transition-transform duration-500"
                spotlightColor={feature.glowColor}
              >
                <div className="mb-6 p-3 rounded-2xl bg-white/5 w-fit group-hover:scale-110 group-hover:bg-white/10 transition-all">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-white group-hover:text-primary transition-colors">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
                
                <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                   <span className="text-xs font-bold text-primary uppercase tracking-wider">Learn More</span>
                   <Cpu className="w-4 h-4 text-primary" />
                </div>
              </SpotlightCard>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
