"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { 
  Trophy, 
  Star, 
  Medal, 
  Code2, 
  Globe, 
  Calendar, 
  Share2,
  Flame,
  Target,
  LayoutDashboard,
  TrendingUp,
  History,
  CheckCircle,
  Settings,
  Zap,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  ArrowUpRight,
  User,
  Fingerprint,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { CountUp } from "@/components/ui/count-up";

// Component Imports
import { StatCard } from "@/components/dashboard/StatCard";
import { SkillProgress } from "@/components/dashboard/SkillProgress";
import { HeatmapGrid } from "@/components/dashboard/HeatmapGrid";
import { SubmissionTable } from "@/components/dashboard/SubmissionTable";
import { DailyChallenge } from "@/components/dashboard/DailyChallenge";
import { LeaderboardPreview } from "@/components/dashboard/LeaderboardPreview";
import { RecommendedProblems } from "@/components/dashboard/RecommendedProblems";
import { PlaygroundTab } from "@/components/dashboard/PlaygroundTab";

const achievements = [
  { id: 1, title: "SQL NINJA", description: "SOLVED 100 PROBLEMS", icon: Trophy, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  { id: 2, title: "100 DAY STREAK", description: "CONSISTENCY CHAMPION", icon: Star, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  { id: 3, title: "OPTIMIZATION GURU", description: "MASTER OF EFFICIENCY", icon: Medal, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
];

type Tab = "overview" | "progress" | "activity" | "playground";

import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

function getRankBadge(xp: number) {
  if (xp >= 10000) return "GRANDMASTER";
  if (xp >= 5000) return "MASTER";
  if (xp >= 2000) return "EXPERT";
  if (xp >= 500) return "EXPLORER";
  if (xp >= 100) return "APPRENTICE";
  return "BEGINNER";
}

function formatJoinDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, { month: "long", year: "numeric" }).toUpperCase();
}

export default function UnifiedProfilePage() {
  const params = useParams();
  const { data: session } = authClient.useSession();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  
  const profileUsername = params.username as string;

  const { data: profileData, isLoading, error } = useQuery({
    queryKey: ["profile", profileUsername],
    queryFn: async () => {
      const res = await fetch(`/api/u/${profileUsername}`);
      if (!res.ok) throw new Error("Profile not found");
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex flex-col items-center justify-center gap-6">
        <div className="relative">
          <Loader2 className="h-12 w-12 text-indigo-500 animate-spin" />
          <div className="absolute inset-0 bg-indigo-500/20 blur-xl" />
        </div>
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 animate-pulse">Loading Profile...</p>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex flex-col items-center justify-center space-y-6">
        <h1 className="text-8xl font-black italic text-slate-900 tracking-tighter">404</h1>
        <p className="text-slate-500 font-bold uppercase tracking-widest">User Not Found</p>
        <Button variant="outline" className="rounded-2xl border-slate-800" onClick={() => window.history.back()}>
          Return to Community
        </Button>
      </div>
    );
  }

  const { profile } = profileData;
  const loggedInUser = session?.user;
  const isOwner = loggedInUser?.name?.toLowerCase().replace(/\s+/g, '-') === profileUsername.toLowerCase() || 
                  loggedInUser?.id === profile?.user_id;
  
  const displayName = profile?.display_name || profile?.username || (profileUsername || "User").split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return (
    <div className="relative min-h-screen bg-[#0B0F19] text-white overflow-x-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] bg-indigo-600/10 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-[10%] right-[-10%] w-[35%] h-[35%] bg-purple-600/5 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-grain opacity-[0.03] pointer-events-none" />
      </div>

      <div className="relative max-w-[1400px] mx-auto px-4 md:px-8 py-12 space-y-12">
        
        {/* Profile Header */}
        <div className="flex flex-col lg:flex-row gap-10 items-start lg:items-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative shrink-0"
          >
            <div className="h-32 w-32 md:h-44 md:w-44 rounded-[2.5rem] bg-gradient-to-br from-indigo-500 to-purple-600 p-1 relative z-10">
              <div className="h-full w-full rounded-[2.2rem] bg-[#0B0F19] flex items-center justify-center text-4xl md:text-6xl font-black italic">
                {displayName.charAt(0)}
              </div>
            </div>
            <div className="absolute inset-0 bg-indigo-500/20 blur-[40px] rounded-full" />
            <div className="absolute -bottom-2 -right-2 h-10 w-10 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center text-indigo-400 z-20">
              <Fingerprint className="h-5 w-5" />
            </div>
          </motion.div>

          <div className="flex-1 space-y-6">
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-wrap items-center gap-2"
              >
                <Badge className="bg-indigo-600 text-white font-black italic tracking-[0.1em] px-4 py-1.5 rounded-xl">
                  {getRankBadge(profile?.xp || 0)}
                </Badge>
                {profileData.rank && (
                  <Badge variant="outline" className="border-white/10 bg-white/5 text-slate-400 font-black tracking-widest px-4 py-1.5 rounded-xl">
                    TOP {Math.max(1, Math.round((profileData.rank / (profileData.totalUsers || 1)) * 100))}%
                  </Badge>
                )}
                {isOwner && (
                  <div className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-[10px] font-black tracking-widest text-emerald-400 uppercase">Verified User</span>
                  </div>
                )}
              </motion.div>
              
              <div className="space-y-1">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-5xl md:text-7xl font-black tracking-tighter italic uppercase leading-[0.8]"
                >
                  {displayName}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-slate-500 text-lg md:text-xl font-bold tracking-tight"
                >
                  @{profileUsername}
                </motion.p>
              </div>
            </div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap items-center gap-6"
            >
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
                <Globe className="h-4 w-4" /> RANK: #{profileData.rank ? profileData.rank.toLocaleString() : "---"}
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
                <Calendar className="h-4 w-4" /> JOINED: {profile?.created_at ? formatJoinDate(profile.created_at) : "---"}
              </div>
              {isOwner ? (
                <Button variant="ghost" size="sm" className="h-10 rounded-xl bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-widest text-indigo-400 gap-2">
                  <Settings className="h-3.5 w-3.5" /> Edit Profile
                </Button>
              ) : (
                <Button variant="ghost" size="sm" className="h-10 rounded-xl bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-widest text-indigo-400 gap-2">
                  <Share2 className="h-3.5 w-3.5" /> Share Profile
                </Button>
              )}
            </motion.div>
          </div>

          <div className="hidden xl:grid grid-cols-3 gap-4">
            {[
              { label: "STREAK", value: profile.streak || 0, icon: Flame, color: "text-orange-500", bg: "bg-orange-500/10" },
              { label: "POWER", value: profile.xp || 0, icon: Zap, color: "text-indigo-400", bg: "bg-indigo-400/10" },
              { label: "SOLVED", value: profile.total_solved || 0, icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-400/10" },
            ].map((stat, i) => (
              <div key={i} className="glass-premium p-6 rounded-[2rem] flex flex-col items-center justify-center space-y-2 min-w-[120px]">
                <div className={cn("p-2 rounded-xl mb-1", stat.bg, stat.color)}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <span className="text-2xl font-black italic tracking-tighter"><CountUp to={stat.value} /></span>
                <span className="text-[9px] font-black tracking-widest text-slate-500 uppercase">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-1.5 p-1.5 glass-premium rounded-[2rem] w-fit">
            {[
              { id: "overview", label: "OVERVIEW", icon: LayoutDashboard },
              { id: "progress", label: "PROGRESS", icon: TrendingUp },
              { id: "activity", label: "LOGS", icon: History },
              ...(isOwner ? [{ id: "playground", label: "SANDBOX", icon: Code2 }] : []),
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={cn(
                  "flex items-center gap-2.5 px-6 py-3 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all",
                  activeTab === tab.id 
                    ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.1)]" 
                    : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                )}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>
          
          <div className="hidden lg:flex items-center gap-4 px-6 py-3 rounded-[2rem] bg-white/5 border border-white/5">
            <Sparkles className="h-4 w-4 text-indigo-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">System Link Active</span>
          </div>
        </div>

        {/* Dynamic Content */}
        <div className="min-h-[500px]">
          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8"
              >
                <div className="lg:col-span-8 space-y-12">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <SpotlightCard className="!p-8 rounded-[2.5rem] bg-slate-900/40 border-white/5 group">
                      <div className="flex items-center justify-between mb-6">
                        <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                          <CheckCircle className="h-6 w-6" />
                        </div>
                        <ArrowUpRight className="h-5 w-5 text-slate-800 group-hover:text-emerald-500 transition-colors" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Problems Solved</p>
                        <p className="text-4xl font-black italic tracking-tighter">{profile.total_solved || 0}</p>
                      </div>
                    </SpotlightCard>

                    <SpotlightCard className="!p-8 rounded-[2.5rem] bg-slate-900/40 border-white/5 group">
                      <div className="flex items-center justify-between mb-6">
                        <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                          <Target className="h-6 w-6" />
                        </div>
                        <ArrowUpRight className="h-5 w-5 text-slate-800 group-hover:text-blue-500 transition-colors" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Accuracy Rating</p>
                        <p className="text-4xl font-black italic tracking-tighter">{profileData.accuracy ?? 0}%</p>
                      </div>
                    </SpotlightCard>
                  </div>

                  <div className="space-y-6">
                    <h3 className="px-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 flex items-center gap-2">
                      <History className="h-3 w-3" /> Recent Activity
                    </h3>
                    <SpotlightCard className="!p-8 rounded-[3rem] bg-slate-900/40 border-white/5">
                      <HeatmapGrid data={profileData.heatmapData} />
                    </SpotlightCard>
                  </div>

                  <div className="space-y-6">
                    <h3 className="px-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 flex items-center gap-2">
                      <Star className="h-3 w-3 text-amber-500" /> Achievements
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {achievements.map((ach, i) => (
                        <SpotlightCard key={ach.id} className="group !p-6 rounded-[2rem] bg-slate-900/40 border-white/5">
                          <div className="flex items-center gap-4">
                            <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform", ach.bg, ach.color)}>
                              <ach.icon className="h-6 w-6" />
                            </div>
                            <div className="space-y-1">
                              <h4 className="text-[11px] font-black italic tracking-tight uppercase group-hover:text-white transition-colors">{ach.title}</h4>
                              <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{ach.description}</p>
                            </div>
                          </div>
                        </SpotlightCard>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-4 space-y-12">
                  {isOwner ? (
                    <>
                      <div className="space-y-6">
                        <h3 className="px-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 flex items-center gap-2">
                          <Zap className="h-3 w-3" /> Daily Challenge
                        </h3>
                        <DailyChallenge challenge={profileData.dailyChallenge} />
                      </div>
                      <div className="space-y-6">
                        <h3 className="px-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 flex items-center gap-2">
                          <Sparkles className="h-3 w-3" /> Recommended Problems
                        </h3>
                        <RecommendedProblems problems={profileData.recommendedProblems} />
                      </div>
                    </>
                  ) : (
                    <SpotlightCard className="!p-10 rounded-[3rem] bg-gradient-to-br from-indigo-600/10 to-blue-600/10 border-indigo-500/20 text-center space-y-6">
                      <div className="mx-auto h-16 w-16 rounded-[2rem] bg-indigo-500/20 flex items-center justify-center">
                        <User className="h-8 w-8 text-indigo-400" />
                      </div>
                      <div className="space-y-2">
                        <h2 className="text-2xl font-black italic tracking-tighter uppercase">Join the Elite</h2>
                        <p className="text-slate-400 text-xs font-bold leading-relaxed">
                          Build your own profile and compete in the global SQL arena.
                        </p>
                      </div>
                      <Button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black italic uppercase tracking-widest h-12 rounded-xl">
                        START YOUR TRAIL
                      </Button>
                    </SpotlightCard>
                  )}
                  
                  <div className="space-y-6">
                    <h3 className="px-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 flex items-center gap-2">
                      <Trophy className="h-3 w-3" /> Leaderboard
                    </h3>
                    <LeaderboardPreview users={profileData.leaderboard} />
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "progress" && (
              <motion.div
                key="progress"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <SkillProgress skills={profileData.skills} />
                </div>
              </motion.div>
            )}

            {activeTab === "activity" && (
              <motion.div
                key="activity"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <SpotlightCard className="!p-0 rounded-[3rem] bg-slate-900/40 border-white/5 overflow-hidden">
                  <SubmissionTable submissions={profileData.submissions} />
                </SpotlightCard>
              </motion.div>
            )}

            {activeTab === "playground" && isOwner && (
              <motion.div
                key="playground"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <PlaygroundTab />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
