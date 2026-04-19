"use client";

import { usePathname, useRouter } from "next/navigation";
import { 
  Bell, 
  Search, 
  Settings, 
  LogOut, 
  User as UserIcon,
  HelpCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { motion } from "framer-motion";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  
  const getPageTitle = (path: string) => {
    const segments = path.split("/").filter(Boolean);
    if (segments.length === 0) return "Dashboard";
    const lastSegment = segments[segments.length - 1];
    return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
  };

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
        },
      },
    });
  };

  return (
    <nav className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-[#1F2937] bg-[#0B0F19]/80 px-4 backdrop-blur-md md:px-8">
      <div className="flex items-center gap-4">
        {/* Page Title - hidden on small mobile if sidebar toggle is there */}
        <h1 className="hidden sm:block text-xl font-semibold text-white ml-10 md:ml-0">
          {getPageTitle(pathname)}
        </h1>
      </div>

      <div className="flex items-center gap-4 lg:gap-6">
        {/* Search Bar */}
        <div className="hidden lg:flex relative w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input 
            placeholder="Search resources..." 
            className="h-9 w-full bg-slate-900 border-slate-800 pl-9 text-xs focus:ring-indigo-500/20"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-800">
            <Bell className="h-5 w-5" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger className="relative h-9 w-9 rounded-full border border-[#1F2937] p-0 overflow-hidden group cursor-pointer">
                <Avatar className="h-full w-full">
                  <AvatarImage src={session?.user?.image || undefined} alt="User" />
                  <AvatarFallback className="bg-indigo-600 text-white font-bold">
                    {session?.user?.name?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-[#111827] border-[#1F2937] text-white">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{session?.user?.name}</p>
                  <p className="text-xs leading-none text-slate-400">{session?.user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-[#1F2937]" />
              <DropdownMenuItem className="focus:bg-slate-800 focus:text-white cursor-pointer" onClick={() => router.push("/profile")}>
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="focus:bg-slate-800 focus:text-white cursor-pointer" onClick={() => router.push("/settings")}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="focus:bg-slate-800 focus:text-white cursor-pointer">
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>Support</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-[#1F2937]" />
              <DropdownMenuItem 
                className="focus:bg-red-500/10 focus:text-red-400 text-red-400 cursor-pointer"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
