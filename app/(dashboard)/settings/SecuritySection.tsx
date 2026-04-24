"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Lock,
  ShieldCheck,
  Smartphone,
  LogOut,
  Laptop,
  CheckCircle2,
  Loader2,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaGoogle, FaGithub } from "react-icons/fa6";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export function SecuritySection() {
  const queryClient = useQueryClient();

  // Password form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Fetch active sessions
  const { data: sessionsData, isLoading: sessionsLoading } = useQuery({
    queryKey: ["sessions"],
    queryFn: async () => {
      const res = await authClient.listSessions();
      return res.data || [];
    },
  });

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: async () => {
      if (newPassword !== confirmPassword) {
        throw new Error("New passwords do not match");
      }
      if (newPassword.length < 8) {
        throw new Error("Password must be at least 8 characters");
      }
      const res = await authClient.changePassword({
        currentPassword,
        newPassword,
      });
      if (res.error) {
        throw new Error(res.error.message || "Failed to change password");
      }
      return res.data;
    },
    onSuccess: () => {
      toast.success("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Revoke other sessions mutation
  const revokeSessionsMutation = useMutation({
    mutationFn: async () => {
      const res = await authClient.revokeOtherSessions();
      if (res.error) {
        throw new Error(
          res.error.message || "Failed to revoke other sessions"
        );
      }
      return res.data;
    },
    onSuccess: () => {
      toast.success("All other sessions have been logged out");
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Revoke single session
  const revokeSessionMutation = useMutation({
    mutationFn: async (sessionToken: string) => {
      const res = await authClient.revokeSession({ token: sessionToken });
      if (res.error) {
        throw new Error(res.error.message || "Failed to revoke session");
      }
      return res.data;
    },
    onSuccess: () => {
      toast.success("Session revoked");
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Social connect
  const connectSocial = async (provider: "google" | "github") => {
    try {
      await authClient.signIn.social({
        provider,
        callbackURL: window.location.href,
      });
    } catch {
      toast.error(`Failed to connect ${provider}`);
    }
  };

  // Parse user agent for session display
  const parseSession = (session: any) => {
    const ua = session.userAgent || "";
    let device = "Unknown Device";
    let browser = "Unknown Browser";

    if (ua.includes("Windows")) device = "Windows PC";
    else if (ua.includes("Macintosh")) device = "MacBook";
    else if (ua.includes("Linux")) device = "Linux";
    else if (ua.includes("iPhone")) device = "iPhone";
    else if (ua.includes("Android")) device = "Android";

    if (ua.includes("Chrome") && !ua.includes("Edg")) browser = "Chrome";
    else if (ua.includes("Firefox")) browser = "Firefox";
    else if (ua.includes("Safari") && !ua.includes("Chrome"))
      browser = "Safari";
    else if (ua.includes("Edg")) browser = "Edge";

    return `${device} — ${browser}`;
  };

  const sessions = sessionsData || [];

  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-xl font-bold text-white">Security & Access</h2>
        <p className="text-sm text-slate-500 mt-1">
          Protect your account with strong passwords and session management.
        </p>
      </div>

      {/* Password Change */}
      <div className="space-y-8">
        <div className="flex items-center gap-3 text-indigo-400">
          <Lock className="h-5 w-5" />
          <h3 className="text-sm font-bold uppercase tracking-widest">
            Change Password
          </h3>
        </div>

        <div className="grid gap-6 max-w-md">
          <div className="space-y-3">
            <Label className="text-sm font-medium text-slate-300">
              Current Password
            </Label>
            <Input
              type="password"
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="bg-slate-900/50 border-slate-800 focus:ring-indigo-500/50"
            />
          </div>
          <div className="space-y-3">
            <Label className="text-sm font-medium text-slate-300">
              New Password
            </Label>
            <Input
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="bg-slate-900/50 border-slate-800 focus:ring-indigo-500/50"
            />
          </div>
          <div className="space-y-3">
            <Label className="text-sm font-medium text-slate-300">
              Confirm New Password
            </Label>
            <Input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-slate-900/50 border-slate-800 focus:ring-indigo-500/50"
            />
            {newPassword &&
              confirmPassword &&
              newPassword !== confirmPassword && (
                <p className="text-xs text-rose-500 font-medium">
                  Passwords do not match
                </p>
              )}
          </div>
          <Button
            onClick={() => changePasswordMutation.mutate()}
            disabled={
              changePasswordMutation.isPending ||
              !currentPassword ||
              !newPassword ||
              !confirmPassword
            }
            className="bg-slate-800 hover:bg-slate-700 text-white w-fit px-6"
          >
            {changePasswordMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Update Password
          </Button>
        </div>
      </div>

      {/* Connected Accounts */}
      <div className="space-y-8 pt-6 border-t border-slate-800/50">
        <div className="flex items-center gap-3 text-indigo-400">
          <ShieldCheck className="h-5 w-5" />
          <h3 className="text-sm font-bold uppercase tracking-widest">
            Connected Accounts
          </h3>
        </div>

        <div className="grid gap-4">
          <div className="flex items-center justify-between p-4 bg-slate-900/30 border border-slate-800 rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-white">
                <FaGoogle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Google</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">
                  Sign in with Google to link
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="bg-slate-900 border-slate-800 text-xs"
              onClick={() => connectSocial("google")}
            >
              Connect
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-900/30 border border-slate-800 rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-white">
                <FaGithub className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">GitHub</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">
                  Sign in with GitHub to link
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="bg-slate-900 border-slate-800 text-xs"
              onClick={() => connectSocial("github")}
            >
              Connect
            </Button>
          </div>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="space-y-8 pt-6 border-t border-slate-800/50">
        <div className="flex items-center gap-3 text-indigo-400">
          <Smartphone className="h-5 w-5" />
          <h3 className="text-sm font-bold uppercase tracking-widest">
            Active Sessions
          </h3>
        </div>

        <div className="space-y-4">
          {sessionsLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
            </div>
          ) : sessions.length === 0 ? (
            <p className="text-sm text-slate-500 py-4">No active sessions found.</p>
          ) : (
            sessions.map((session: any, index: number) => {
              const isCurrentSession = index === 0;
              return (
                <div
                  key={session.token || index}
                  className={`flex items-center justify-between p-4 rounded-2xl ${
                    isCurrentSession
                      ? "bg-indigo-500/5 border border-indigo-500/10"
                      : "bg-slate-900/30 border border-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                        isCurrentSession
                          ? "bg-indigo-500/10 text-indigo-400"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {session.userAgent?.includes("Mobile") ? (
                        <Smartphone className="h-5 w-5" />
                      ) : session.userAgent?.includes("iPhone") ||
                        session.userAgent?.includes("Android") ? (
                        <Smartphone className="h-5 w-5" />
                      ) : (
                        <Laptop className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">
                        {parseSession(session)}
                      </p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">
                        {isCurrentSession ? "Current Session" : ""}
                        {session.ipAddress
                          ? `${isCurrentSession ? " • " : ""}IP: ${session.ipAddress}`
                          : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {isCurrentSession ? (
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-bold border border-emerald-500/20">
                        Active Now
                      </span>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-rose-500 hover:text-rose-400 hover:bg-rose-500/10 text-xs"
                        onClick={() =>
                          revokeSessionMutation.mutate(session.token)
                        }
                        disabled={revokeSessionMutation.isPending}
                      >
                        Revoke
                      </Button>
                    )}
                  </div>
                </div>
              );
            })
          )}

          {sessions.length > 1 && (
            <Button
              variant="ghost"
              className="text-rose-500 hover:text-rose-400 hover:bg-rose-500/10 gap-2 text-xs font-bold uppercase tracking-widest"
              onClick={() => revokeSessionsMutation.mutate()}
              disabled={revokeSessionsMutation.isPending}
            >
              {revokeSessionsMutation.isPending ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <LogOut className="h-3 w-3" />
              )}
              Logout from all other devices
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
