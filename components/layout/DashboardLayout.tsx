"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { TopNavbar } from "./TopNavbar";
import { motion } from "framer-motion";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isPending, data: session } = authClient.useSession();

  const isPublicRoute = pathname.startsWith("/u/");

  useEffect(() => {
    if (!isPending && !session && !isPublicRoute) {
      router.push("/login");
    }
  }, [isPending, session, router, isPublicRoute]);

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

  if (!session && !isPublicRoute) return null;

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-200">
      <TopNavbar />
      
      <main className="pt-16 min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
