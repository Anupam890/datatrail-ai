"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Shield, 
  Settings as SettingsIcon, 
  Database, 
  ChevronRight,
  Loader2,
  Cpu,
  Fingerprint,
  Monitor,
  Lock,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Button } from "@/components/ui/button";
import { ProfileSection } from "./ProfileSection";
import { AccountSection } from "./AccountSection";
import { PreferencesSection } from "./PreferencesSection";
import { SecuritySection } from "./SecuritySection";

const navItems = [
  { id: "profile", label: "Profile Settings", sub: "Profile Info", icon: User, description: "Manage your public profile and user identity" },
  { id: "account", label: "Account", sub: "General", icon: Cpu, description: "General account settings and core data links" },
  { id: "preferences", label: "Appearance", sub: "UI Settings", icon: Monitor, description: "Editor customization and theme synchronization" },
  { id: "security", label: "Security", sub: "Security Settings", icon: Lock, description: "Encryption keys and active session monitoring" },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="relative min-h-screen bg-[#0B0F19] text-white overflow-x-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[45%] h-[45%] bg-slate-600/10 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-[20%] left-[-10%] w-[35%] h-[35%] bg-indigo-600/5 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-grain opacity-[0.03] pointer-events-none" />
      </div>

      <div className="relative max-w-[1400px] mx-auto px-4 md:px-8 py-12 space-y-12">
        
        {/* Header Section */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-500/10 border border-white/10 w-fit"
          >
            <SettingsIcon className="h-4 w-4 text-slate-400" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Control Panel</span>
          </motion.div>
          
          <div className="space-y-2">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as any }}
              className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.8] italic uppercase"
            >
              SYSTEM <span className="text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">SETTINGS</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="text-slate-500 max-w-xl text-lg md:text-xl font-medium tracking-tight"
            >
              Configure your account and manage your application settings.
            </motion.p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-4">
          {/* Navigation Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="px-2 flex items-center justify-between">
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 flex items-center gap-2">
                <Fingerprint className="h-3.5 w-3.5" /> Settings Navigation
              </h2>
              <Sparkles className="h-3.5 w-3.5 text-slate-800" />
            </div>

            <nav className="space-y-3">
              {navItems.map((item, i) => {
                const isActive = activeTab === item.id;
                return (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => setActiveTab(item.id)}
                    className={cn(
                      "w-full text-left p-6 rounded-[2.5rem] transition-all group relative overflow-hidden border",
                      isActive 
                        ? "bg-white text-black border-white shadow-[0_0_30px_rgba(255,255,255,0.1)]" 
                        : "bg-white/5 text-slate-400 border-white/5 hover:bg-white/[0.08] hover:border-white/10"
                    )}
                  >
                    <div className="flex items-center gap-5 relative z-10">
                      <div className={cn(
                        "h-12 w-12 rounded-2xl flex items-center justify-center transition-colors shrink-0",
                        isActive ? "bg-black text-white" : "bg-white/5 text-slate-500 group-hover:text-slate-300"
                      )}>
                        <item.icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <p className="font-black italic text-sm tracking-tight uppercase leading-none">{item.label}</p>
                          <span className={cn(
                            "text-[8px] font-black tracking-widest px-1.5 py-0.5 rounded border leading-none",
                            isActive ? "border-black/20 text-black/40" : "border-white/10 text-slate-600"
                          )}>
                            {item.sub}
                          </span>
                        </div>
                        <p className={cn(
                          "text-[10px] font-bold truncate tracking-tight",
                          isActive ? "text-black/60" : "text-slate-600"
                        )}>{item.description}</p>
                      </div>
                      {isActive && (
                        <div className="h-2 w-2 rounded-full bg-black animate-pulse" />
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </nav>

            <SpotlightCard className="!p-8 rounded-[2.5rem] bg-indigo-600/10 border-indigo-500/20 mt-10">
              <div className="space-y-4 text-center">
                <div className="h-12 w-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center mx-auto text-indigo-400">
                  <Shield className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-black italic uppercase tracking-wider">Need help?</h4>
                  <p className="text-[10px] text-slate-500 font-bold leading-relaxed">
                    Contact support for advanced overrides.
                  </p>
                </div>
                <Button variant="outline" className="w-full rounded-xl border-indigo-500/30 text-indigo-400 font-black italic uppercase tracking-wider text-[10px] h-11">
                  Open Support Ticket
                </Button>
              </div>
            </SpotlightCard>
          </aside>

          {/* Main Content Hub */}
          <main className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as any }}
              >
                <SpotlightCard className="!p-10 md:!p-16 rounded-[3.5rem] bg-slate-900/40 border-white/5 min-h-[600px] shadow-2xl backdrop-blur-xl">
                  {activeTab === "profile" && <ProfileSection />}
                  {activeTab === "account" && <AccountSection />}
                  {activeTab === "preferences" && <PreferencesSection />}
                  {activeTab === "security" && <SecuritySection />}
                </SpotlightCard>
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}
