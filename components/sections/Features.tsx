"use client";

import { motion } from "framer-motion";
import { SpotlightCard } from "../ui/spotlight-card";
import { ScrollReveal } from "../ui/scroll-reveal";
import { CountUp } from "../ui/count-up";
import { BrainCircuit, Database, Target, TrendingUp, ArrowRight, Sparkles, Zap, Code2, ListTree, BarChart3, ChevronRight } from "lucide-react";

// Mini-UI Previews for each feature
const CodePreview = () => (
  <div className="mt-8 rounded-xl bg-[#0B0F19] border border-white/5 overflow-hidden shadow-2xl">
    <div className="bg-white/5 px-3 py-2 flex items-center gap-1.5 border-b border-white/5">
      <div className="w-2 h-2 rounded-full bg-rose-500/50" />
      <div className="w-2 h-2 rounded-full bg-amber-500/50" />
      <div className="w-2 h-2 rounded-full bg-emerald-500/50" />
      <span className="ml-2 text-[10px] text-muted-foreground font-mono">query.sql</span>
    </div>
    <div className="p-4 font-mono text-xs leading-relaxed">
      <div className="flex gap-3">
        <span className="text-muted-foreground/30">1</span>
        <span className="text-primary">SELECT</span>
        <span className="text-white">user_id, count(*)</span>
      </div>
      <div className="flex gap-3">
        <span className="text-muted-foreground/30">2</span>
        <span className="text-primary">FROM</span>
        <span className="text-white">production.orders</span>
      </div>
      <div className="flex gap-3">
        <span className="text-muted-foreground/30">3</span>
        <span className="text-primary">GROUP BY</span>
        <span className="text-amber-400">1</span>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="mt-4 p-3 rounded-lg bg-primary/10 border border-primary/20 relative"
      >
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-3 h-3 text-primary" />
          <span className="text-[10px] font-bold text-primary uppercase">AI Suggestion</span>
        </div>
        <p className="text-[10px] text-white/70">Consider adding an index on <code className="text-primary">user_id</code> to speed up this aggregation by 40%.</p>
        <div className="absolute -top-2 left-4 w-3 h-3 bg-primary/10 border-l border-t border-primary/20 rotate-45" />
      </motion.div>
    </div>
  </div>
);

const SchemaPreview = () => (
  <div className="mt-6 space-y-2">
    {[
      { name: "order_id", type: "UUID", icon: <Zap className="w-3 h-3" /> },
      { name: "amount", type: "DECIMAL", icon: <Code2 className="w-3 h-3" /> },
      { name: "status", type: "VARCHAR", icon: <ListTree className="w-3 h-3" /> },
    ].map((col, i) => (
      <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5 text-[10px]">
        <div className="flex items-center gap-2">
          <div className="text-secondary/50">{col.icon}</div>
          <span className="text-white/80 font-mono">{col.name}</span>
        </div>
        <span className="text-muted-foreground/50 font-mono">{col.type}</span>
      </div>
    ))}
  </div>
);

const RoadmapPreview = () => (
  <div className="mt-6 relative">
    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-500/50 via-amber-500/20 to-transparent" />
    <div className="space-y-4">
      {[
        { title: "SQL Fundamentals", status: "completed" },
        { title: "Query Optimization", status: "current" },
        { title: "Data Modeling", status: "locked" },
      ].map((node, i) => (
        <div key={i} className="flex items-center gap-4 relative z-10">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
            node.status === 'completed' ? 'bg-amber-500 border-amber-500 text-white' :
            node.status === 'current' ? 'bg-[#0B0F19] border-amber-500 text-amber-500' :
            'bg-[#0B0F19] border-white/10 text-white/20'
          }`}>
            <span className="text-[10px] font-bold">{i + 1}</span>
          </div>
          <span className={`text-[10px] font-bold uppercase tracking-wider ${
            node.status === 'locked' ? 'text-white/20' : 'text-white/80'
          }`}>{node.title}</span>
        </div>
      ))}
    </div>
  </div>
);

const DashboardPreview = () => (
  <div className="mt-8 grid grid-cols-2 gap-3">
    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
      <div className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Accuracy</div>
      <div className="text-xl font-black text-rose-500">94%</div>
      <div className="mt-2 h-1 w-full bg-rose-500/10 rounded-full overflow-hidden">
        <motion.div initial={{ width: 0 }} whileInView={{ width: "94%" }} className="h-full bg-rose-500" />
      </div>
    </div>
    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
      <div className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Rank</div>
      <div className="text-xl font-black text-white">#12</div>
      <div className="text-[8px] text-emerald-500 mt-1 flex items-center gap-0.5">
        <TrendingUp className="w-2 h-2" /> +2 this week
      </div>
    </div>
    <div className="col-span-2 p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
      <div className="flex gap-1">
        {[...Array(12)].map((_, i) => (
          <div key={i} className={`w-3 h-3 rounded-sm ${i % 3 === 0 ? 'bg-rose-500/40' : 'bg-white/5'}`} />
        ))}
      </div>
      <span className="text-[8px] text-muted-foreground font-bold">SKILL HEATMAP</span>
    </div>
  </div>
);

const FEATURES = [
  {
    id: "ai",
    title: "AI Query Assistant",
    description: "Intelligent query synthesis and optimization. Explain complex logic, suggest performance improvements, or debug syntax in real-time with our neural engine.",
    className: "md:col-span-2 md:row-span-2",
    glowColor: "rgba(99, 102, 241, 0.25)",
    preview: <CodePreview />
  },
  {
    id: "data",
    title: "Real-world Challenges",
    description: "No dummy data. Query production-grade datasets from Fintech, SaaS, and E-commerce.",
    className: "md:col-span-1 md:row-span-1",
    glowColor: "rgba(34, 197, 94, 0.2)",
    preview: <SchemaPreview />
  },
  {
    id: "path",
    title: "Targeted Path",
    description: "Master the SQL skills needed for Data Engineering or ML specifically.",
    className: "md:col-span-1 md:row-span-1",
    glowColor: "rgba(245, 158, 11, 0.2)",
    preview: <RoadmapPreview />
  },
  {
    id: "progress",
    title: "Live Progress & Rankings",
    description: "Monitor your accuracy and technical proficiency in real-time. Benchmark your performance against the global community and identify key improvement areas before your next interview.",
    className: "md:col-span-3 md:row-span-1",
    glowColor: "rgba(239, 68, 68, 0.2)",
    preview: <DashboardPreview />
  }
];

export default function Features() {
  return (
    <section className="py-32 bg-[#0B0F19] relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/2" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] translate-y-1/2" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-end justify-between gap-12 mb-24">
          <ScrollReveal direction="left" distance={60}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-6">
              <Zap className="w-3 h-3 fill-current" />
              <span>Built for Data Students</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-white leading-[1.1] tracking-tight">
              Engineered for <br />
              <span className="text-gradient italic">Practical Excellence</span>
            </h2>
            <p className="mt-8 text-muted-foreground text-xl leading-relaxed max-w-xl">
              Stop learning in a vacuum. <span className="text-white font-semibold">DataTrail</span> provides the infrastructure to master production-scale data engineering.
            </p>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={0.2}>
            <div className="flex items-center gap-8 p-8 rounded-[2rem] glass border-white/5 hover:border-primary/20 transition-all duration-500 group">
                <div className="flex -space-x-4">
                   {[1,2,3,4].map(i => (
                     <motion.div 
                       key={i} 
                       className="w-14 h-14 rounded-full border-4 border-[#0B0F19] bg-card flex items-center justify-center overflow-hidden shadow-2xl"
                       whileHover={{ y: -8, zIndex: 10, scale: 1.1 }}
                     >
                       <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 30}`} alt="user" />
                     </motion.div>
                   ))}
                </div>
                <div>
                  <div className="text-3xl font-black text-white leading-none">
                    <CountUp to={2400} suffix="+" />
                  </div>
                  <div className="text-muted-foreground font-bold text-sm uppercase tracking-widest mt-1">Students Learning</div>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-secondary"></span>
                    </span>
                    <span className="text-secondary font-bold text-[10px] uppercase tracking-widest">Active Now</span>
                  </div>
                </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FEATURES.map((feature, i) => (
            <ScrollReveal 
              key={feature.id} 
              direction="up" 
              delay={i * 0.1} 
              distance={40}
              className={feature.className}
            >
              <SpotlightCard 
                className="h-full group flex flex-col p-8"
                spotlightColor={feature.glowColor}
              >
                <div className="flex flex-col h-full">
                  <div className="flex-grow">
                    <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    
                    <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                      {feature.description}
                    </p>

                    {feature.preview}
                  </div>

                  <div className="mt-12 flex items-center justify-between group/more cursor-pointer pt-6 border-t border-white/5">
                    <span className="text-xs font-black text-white/40 group-hover:text-primary transition-colors tracking-tighter uppercase">Learn More</span>
                    <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </SpotlightCard>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
