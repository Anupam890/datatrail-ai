"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Shield, 
  Settings as SettingsIcon, 
  Database, 
  ChevronRight,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ProfileSection } from "./ProfileSection";
import { AccountSection } from "./AccountSection";
import { PreferencesSection } from "./PreferencesSection";
import { SecuritySection } from "./SecuritySection";

const navItems = [
  { id: "profile", label: "Profile", icon: User, description: "Manage your public profile and identity" },
  { id: "account", label: "Account", icon: SettingsIcon, description: "General account settings and data" },
  { id: "preferences", label: "Preferences", icon: Database, description: "Editor and theme customization" },
  { id: "security", label: "Security", icon: Shield, description: "Passwords and active sessions" },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white">
      <div className="max-w-[1200px] mx-auto px-4 py-10">
        
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-slate-500 mt-2">Manage your SQLArena account and application preferences.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar */}
          <aside className="w-full lg:w-80 shrink-0">
            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={cn(
                      "w-full text-left p-4 rounded-2xl transition-all group relative overflow-hidden",
                      isActive 
                        ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20" 
                        : "text-slate-400 hover:bg-white/5 border border-transparent"
                    )}
                  >
                    <div className="flex items-center gap-4 relative z-10">
                      <div className={cn(
                        "p-2 rounded-xl transition-colors",
                        isActive ? "bg-indigo-500 text-white" : "bg-slate-900 text-slate-500 group-hover:text-slate-300"
                      )}>
                        <item.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm">{item.label}</p>
                        <p className="text-xs text-slate-500 truncate mt-0.5">{item.description}</p>
                      </div>
                      <ChevronRight className={cn(
                        "h-4 w-4 transition-transform",
                        isActive ? "rotate-90 opacity-100" : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                      )} />
                    </div>
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                className="bg-[#0F172A]/50 border border-slate-800 rounded-3xl p-6 md:p-10 shadow-2xl backdrop-blur-xl"
              >
                {activeTab === "profile" && <ProfileSection />}
                {activeTab === "account" && <AccountSection />}
                {activeTab === "preferences" && <PreferencesSection />}
                {activeTab === "security" && <SecuritySection />}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}
