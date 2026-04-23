"use client";

import { useSession } from "@/lib/auth-client";
import { Mail, Calendar, AlertTriangle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export function AccountSection() {
  const { data: session } = useSession();

  const createdAt = session?.user?.createdAt 
    ? new Date(session.user.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      })
    : "N/A";

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-xl font-bold text-white">Account Settings</h2>
        <p className="text-sm text-slate-500 mt-1">Manage your account identification and security data.</p>
      </div>

      <div className="grid gap-8">
        <div className="space-y-3">
          <Label className="text-sm font-medium text-slate-300 flex items-center gap-2">
            <Mail className="h-4 w-4" /> Email Address
          </Label>
          <div className="flex gap-4">
            <Input 
              value={session?.user.email || ""} 
              readOnly 
              className="bg-slate-900/50 border-slate-800 text-slate-400 cursor-not-allowed"
            />
            <Button variant="outline" className="bg-slate-900 border-slate-800 text-xs shrink-0">
              Verify
            </Button>
          </div>
          <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">
            Used for login and important platform notifications.
          </p>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium text-slate-300 flex items-center gap-2">
            <Calendar className="h-4 w-4" /> Member Since
          </Label>
          <div className="p-4 bg-slate-900/30 border border-slate-800 rounded-2xl flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-indigo-600/10 flex items-center justify-center text-indigo-400">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">{createdAt}</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Account Created</p>
            </div>
          </div>
        </div>
      </div>

      <Separator className="bg-slate-800/50" />

      <div className="space-y-6">
        <div className="flex items-start gap-4 p-6 bg-rose-500/5 border border-rose-500/10 rounded-3xl">
          <div className="p-3 bg-rose-500/10 rounded-2xl text-rose-500">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-bold text-rose-500">Danger Zone</h4>
            <p className="text-xs text-rose-500/70 mt-1 leading-relaxed">
              Once you delete your account, there is no going back. All your SQL challenges, ranks, and playground data will be permanently wiped from our systems.
            </p>
            <Button variant="ghost" className="mt-4 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all gap-2 text-xs font-bold uppercase tracking-widest">
              <Trash2 className="h-3 w-3" />
              Delete Account Permanently
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
