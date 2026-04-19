"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Sidebar } from "./sidebar";
import { Navbar } from "./navbar";
import { motion } from "framer-motion";
import { useLayoutStore } from "@/store/use-layout-store";
import { cn } from "@/lib/utils";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isPending, data: session } = authClient.useSession();
  const { isSidebarCollapsed } = useLayoutStore();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [isPending, session, router]);

  if (isPending) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#0B0F19]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
          <p className="text-sm text-slate-400">Loading your session...</p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="flex min-h-screen bg-[#0B0F19] text-slate-200 overflow-x-hidden">
      {/* Sidebar - Desktop */}
      <Sidebar />

      {/* Main Content Area */}
      <div className={cn(
        "flex flex-1 flex-col transition-all duration-300 ease-in-out w-full",
        isSidebarCollapsed ? "md:pl-20" : "md:pl-60"
      )}>
        <Navbar />
        
        <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
