"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  ArrowRight,
  LayoutDashboard,
  TrendingUp,
  History,
  CheckCircle,
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

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
  { id: 1, title: "SQL Ninja", icon: Trophy, color: "text-amber-500", bg: "bg-amber-500/10" },
  { id: 2, title: "100 Day Streak", icon: Star, color: "text-blue-500", bg: "bg-blue-500/10" },
  { id: 3, title: "Optimization Guru", icon: Medal, color: "text-emerald-500", bg: "bg-emerald-500/10" },
];

type Tab = "overview" | "progress" | "activity" | "playground";

import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

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

  const loggedInUser = session?.user;
  const isOwner = loggedInUser?.name?.toLowerCase().replace(/\s+/g, '-') === profileUsername.toLowerCase() || 
                  loggedInUser?.id === profileData?.profile?.user_id;
  
  const displayName = profileData?.profile?.username || profileUsername.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex flex-col items-center justify-center space-y-4">
        <h1 className="text-4xl font-black italic text-slate-700">404</h1>
        <p className="text-slate-500 font-medium tracking-tight">The explorer you're looking for doesn't exist.</p>
        <Button variant="outline" className="border-slate-800" onClick={() => window.history.back()}>Go Back</Button>
      </div>
    );
  }

  const { profile } = profileData;

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white selection:bg-indigo-500/30">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-[1400px] mx-auto px-6 py-12 space-y-12">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-indigo-500 rounded-3xl blur-2xl opacity-20 animate-pulse" />
            <div className="h-32 w-32 md:h-40 md:w-40 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 p-1 shadow-2xl relative z-10">
              <div className="h-full w-full rounded-[22px] bg-[#0B0F19] flex items-center justify-center text-4xl md:text-5xl font-black italic">
                {displayName.charAt(0)}
              </div>
            </div>
          </motion.div>

          <div className="flex-1 text-center md:text-left space-y-4">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-3">
                <Badge className="bg-indigo-600 text-white border-none px-3 py-1 text-xs font-bold uppercase tracking-wider">Grandmaster</Badge>
                <Badge variant="outline" className="border-slate-800 text-slate-400 px-3 py-1 text-xs uppercase tracking-wider">Top 1%</Badge>
                {isOwner && (
                  <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-3 py-1 text-xs uppercase tracking-wider">Your Workspace</Badge>
                )}
              </div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">{displayName}</h1>
              <p className="text-slate-400 text-lg md:text-xl font-medium mt-1">@{profileUsername}</p>
            </motion.div>

            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-slate-500"
            >
              <div className="flex items-center gap-1.5 text-sm font-medium">
                <Globe className="h-4 w-4" /> Global Rank: #1,245
              </div>
              <div className="flex items-center gap-1.5 text-sm font-medium">
                <Calendar className="h-4 w-4" /> Joined April 2024
              </div>
              {isOwner ? (
                <Button variant="ghost" size="sm" className="h-8 gap-2 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10">
                  <Settings className="h-4 w-4" /> Edit Profile
                </Button>
              ) : (
                <Button variant="ghost" size="sm" className="h-8 gap-2 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10">
                  <Share2 className="h-4 w-4" /> Share Profile
                </Button>
              )}
            </motion.div>
          </div>

          {isOwner && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="hidden lg:flex items-center gap-6 p-6 rounded-3xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm"
            >
              <div className="flex flex-col items-center px-4 border-r border-slate-800">
                <div className="flex items-center gap-1.5 text-orange-500 mb-1">
                  <Flame className="h-6 w-6 fill-current" />
                  <span className="text-2xl font-bold italic">{profile.streak || 0}</span>
                </div>
                <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Day Streak</span>
              </div>
              <div className="flex flex-col items-center px-4">
                <span className="text-2xl font-bold text-indigo-500 mb-1">{profile.xp || 0}</span>
                <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Points</span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-px overflow-x-auto no-scrollbar">
          {[
            { id: "overview", label: "Overview", icon: LayoutDashboard },
            { id: "progress", label: "Progress", icon: TrendingUp },
            { id: "activity", label: "Activity", icon: History },
            ...(isOwner ? [{ id: "playground", label: "Playground", icon: Code2 }] : []),
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={cn(
                "relative px-6 py-4 text-sm font-bold uppercase tracking-widest transition-all flex items-center gap-2",
                activeTab === tab.id ? "text-white" : "text-slate-500 hover:text-slate-300"
              )}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="active-tab"
                  className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-500 rounded-t-full" 
                />
              )}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8"
              >
                <div className="lg:col-span-8 space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <StatCard title="Problems Solved" value={profile.total_solved || 0} icon={CheckCircle} color="emerald" description="Keep pushing!" />
                    <StatCard title="Accuracy" value={78} suffix="%" icon={Target} color="blue" description="+2.4% from last month" />
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      <History className="h-5 w-5 text-indigo-500" /> Consistency
                    </h3>
                    <HeatmapGrid />
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      <Star className="h-5 w-5 text-amber-500" /> Showcase
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {achievements.map((ach) => (
                        <Card key={ach.id} className="bg-slate-900/30 border-slate-800/50 hover:bg-slate-900/50 transition-colors">
                          <CardContent className="p-4 flex items-center gap-4">
                            <div className={`h-12 w-12 rounded-xl ${ach.bg} flex items-center justify-center shrink-0`}>
                              <ach.icon className={`h-6 w-6 ${ach.color}`} />
                            </div>
                            <div>
                              <h4 className="font-bold text-sm">{ach.title}</h4>
                              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tight">Unlocked April 2024</p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-4 space-y-8">
                  {isOwner ? (
                    <>
                      <DailyChallenge />
                      <RecommendedProblems />
                    </>
                  ) : (
                    <Card className="bg-indigo-600/5 border-indigo-500/10 p-8 text-center space-y-6">
                      <div className="space-y-2">
                        <h2 className="text-xl font-bold">Join the SQL Elite</h2>
                        <p className="text-slate-500 text-sm">Master database engineering with SQLArena.</p>
                      </div>
                      <Button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl h-12">
                        Enter the Arena
                      </Button>
                    </Card>
                  )}
                  <LeaderboardPreview />
                </div>
              </motion.div>
            )}

            {activeTab === "progress" && (
              <motion.div
                key="progress"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <SkillProgress />
                </div>
              </motion.div>
            )}

            {activeTab === "activity" && (
              <motion.div
                key="activity"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <SubmissionTable />
              </motion.div>
            )}

            {activeTab === "playground" && isOwner && (
              <motion.div
                key="playground"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
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
