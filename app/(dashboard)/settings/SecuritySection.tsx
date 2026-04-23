"use client";

import { Lock, ShieldCheck, Smartphone, LogOut, Laptop, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaGoogle, FaGithub } from "react-icons/fa6";

export function SecuritySection() {
  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-xl font-bold text-white">Security & Access</h2>
        <p className="text-sm text-slate-500 mt-1">Protect your account with multi-factor authentication and session management.</p>
      </div>

      {/* Password Change */}
      <div className="space-y-8">
        <div className="flex items-center gap-3 text-indigo-400">
          <Lock className="h-5 w-5" />
          <h3 className="text-sm font-bold uppercase tracking-widest">Change Password</h3>
        </div>

        <div className="grid gap-6 max-w-md">
          <div className="space-y-3">
            <Label className="text-sm font-medium text-slate-300">Current Password</Label>
            <Input type="password" placeholder="••••••••" className="bg-slate-900/50 border-slate-800 focus:ring-indigo-500/50" />
          </div>
          <div className="space-y-3">
            <Label className="text-sm font-medium text-slate-300">New Password</Label>
            <Input type="password" placeholder="••••••••" className="bg-slate-900/50 border-slate-800 focus:ring-indigo-500/50" />
          </div>
          <div className="space-y-3">
            <Label className="text-sm font-medium text-slate-300">Confirm New Password</Label>
            <Input type="password" placeholder="••••••••" className="bg-slate-900/50 border-slate-800 focus:ring-indigo-500/50" />
          </div>
          <Button className="bg-slate-800 hover:bg-slate-700 text-white w-fit px-6">Update Password</Button>
        </div>
      </div>

      {/* Connected Accounts */}
      <div className="space-y-8 pt-6 border-t border-slate-800/50">
        <div className="flex items-center gap-3 text-indigo-400">
          <ShieldCheck className="h-5 w-5" />
          <h3 className="text-sm font-bold uppercase tracking-widest">Connected Accounts</h3>
        </div>

        <div className="grid gap-4">
          <div className="flex items-center justify-between p-4 bg-slate-900/30 border border-slate-800 rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-white">
                <FaGoogle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Google</p>
                <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest flex items-center gap-1 mt-0.5">
                  <CheckCircle2 className="h-3 w-3" /> Connected
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="text-slate-500 hover:text-white">Disconnect</Button>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-900/30 border border-slate-800 rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-white">
                <FaGithub className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">GitHub</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Not Connected</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="bg-slate-900 border-slate-800 text-xs">Connect</Button>
          </div>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="space-y-8 pt-6 border-t border-slate-800/50">
        <div className="flex items-center gap-3 text-indigo-400">
          <Smartphone className="h-5 w-5" />
          <h3 className="text-sm font-bold uppercase tracking-widest">Active Sessions</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                <Laptop className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">MacBook Pro — Chrome</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Current Session • Mumbai, India</p>
              </div>
            </div>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-bold border border-emerald-500/20">Active Now</span>
          </div>

          <Button variant="ghost" className="text-rose-500 hover:text-rose-400 hover:bg-rose-500/10 gap-2 text-xs font-bold uppercase tracking-widest">
            <LogOut className="h-3 w-3" />
            Logout from all other devices
          </Button>
        </div>
      </div>
    </div>
  );
}
