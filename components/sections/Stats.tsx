"use client";

import CountUp from "../ui/CountUp";
import FadeIn from "../ui/FadeIn";

const STATS = [
  { label: "Problems Solved", value: 1420500, suffix: "+" },
  { label: "Active Users", value: 85000, suffix: "" },
  { label: "Queries Executed", value: 12000000, suffix: "+" },
  { label: "Success Rate", value: 98, suffix: "%" },
];

export default function Stats() {
  return (
    <section className="py-20 border-y border-border/50 bg-[#0B0F19]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
          {STATS.map((stat, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div className="flex flex-col gap-2">
                <div className="text-4xl md:text-5xl font-black text-white tracking-tight">
                  <CountUp to={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-[0.2em]">{stat.label}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
