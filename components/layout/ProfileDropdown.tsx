"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Terminal, 
  BarChart3, 
  History, 
  Settings, 
  LogOut, 
  ChevronDown,
  HelpCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";

interface DropdownItemProps {
  href?: string;
  onClick?: () => void;
  icon: React.ElementType;
  label: string;
  variant?: "default" | "danger";
}

function DropdownItem({ href, onClick, icon: Icon, label, variant = "default" }: DropdownItemProps) {
  const content = (
    <motion.div
      whileHover={{ x: 4 }}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer",
        variant === "danger" 
          ? "text-rose-400 hover:bg-rose-500/10" 
          : "text-slate-400 hover:text-white hover:bg-white/5"
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="font-medium">{label}</span>
    </motion.div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return <div onClick={onClick}>{content}</div>;
}

export function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { data: session } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEsc);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen]);

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/login");
  };

  const user = session?.user;
  const username = user?.name || "User";
  const userInitial = username.charAt(0).toUpperCase();

  return (
    <div className="relative" ref={containerRef}>
      {/* Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 p-1 rounded-full transition-all border border-transparent",
          isOpen ? "bg-white/5 border-white/10" : "hover:bg-white/5"
        )}
      >
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-indigo-500/20">
          {userInitial}
        </div>
        <ChevronDown className={cn("h-4 w-4 text-slate-500 transition-transform duration-200", isOpen && "rotate-180")} />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="absolute right-0 mt-2 w-64 bg-[#0F172A] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50 backdrop-blur-xl"
          >
            {/* User Info Header */}
            <div className="p-4 bg-white/5 border-b border-slate-800/50">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white">
                  {userInitial}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-bold text-white truncate">{username}</span>
                  <span className="text-[10px] text-slate-500 font-medium truncate mb-1">{user?.email}</span>
                  <div className="flex items-center gap-1">
                    <span className="h-1 w-1 rounded-full bg-emerald-500" />
                    <span className="text-[10px] text-emerald-500/80 font-bold uppercase tracking-wider">SQL Explorer</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-2 space-y-1">
              <DropdownItem 
                href={`/u/${username.toLowerCase().replace(/\s+/g, '-')}`} 
                icon={User} 
                label="Workspace" 
                onClick={() => setIsOpen(false)}
              />
              <DropdownItem 
                href="/arena" 
                icon={Terminal} 
                label="Arena" 
                onClick={() => setIsOpen(false)}
              />
            </div>

            <div className="h-[1px] bg-slate-800/50 mx-2" />

            <div className="p-2 space-y-1">
              <DropdownItem 
                href="/settings" 
                icon={Settings} 
                label="Settings" 
                onClick={() => setIsOpen(false)}
              />
              <DropdownItem icon={HelpCircle} label="Help & Docs" />
            </div>

            <div className="h-[1px] bg-slate-800/50 mx-2" />

            {/* Logout */}
            <div className="p-2">
              <DropdownItem 
                icon={LogOut} 
                label="Logout" 
                variant="danger" 
                onClick={handleLogout}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
