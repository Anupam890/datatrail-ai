"use client";

import { CountUp } from "../ui/count-up";
import { ScrollReveal } from "../ui/scroll-reveal";

const STATS = [
  { label: "Queries Analyzed", value: 1420500, suffix: "+", color: "text-primary" },
  { label: "Active Students", value: 85000, suffix: "", color: "text-secondary" },
  { label: "Datasets Explored", value: 12000, suffix: "+", color: "text-emerald-500" },
  { label: "Success Rate", value: 99, suffix: "%", color: "text-rose-500" },
];

export default function Stats() {
  return (
    <section className="py-24 border-y border-white/5 bg-[#0B0F19] relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[300px] bg-primary/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 md:gap-20">
          {STATS.map((stat, i) => (
            <ScrollReveal key={i} direction="up" distance={20} delay={i * 0.1}>
              <div className="flex flex-col gap-3 group">
                <div className={`text-4xl md:text-6xl font-black ${stat.color} tracking-tighter transition-transform group-hover:scale-105 duration-500`}>
                  <CountUp to={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-[10px] md:text-xs font-black text-white/40 uppercase tracking-[0.3em] leading-relaxed">
                  {stat.label}
                </p>
                <div className="w-10 h-1 bg-white/5 rounded-full mt-2 group-hover:w-20 group-hover:bg-primary/50 transition-all duration-500" />
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
