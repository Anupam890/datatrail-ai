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
          <div className="relative">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
            <div className="absolute inset-0 h-10 w-10 rounded-full bg-indigo-500/20 blur-xl" />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Loading session</p>
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
          key={pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="w-full"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
