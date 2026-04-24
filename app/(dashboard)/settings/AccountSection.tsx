"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useSession, authClient } from "@/lib/auth-client";
import {
  Mail,
  Calendar,
  AlertTriangle,
  Trash2,
  Loader2,
  CheckCircle2,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export function AccountSection() {
  const { data: session } = useSession();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const createdAt = session?.user?.createdAt
    ? new Date(session.user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "N/A";

  // Send verification email
  const verifyMutation = useMutation({
    mutationFn: async () => {
      const res = await authClient.sendVerificationEmail({
        email: session?.user?.email || "",
        callbackURL: window.location.href,
      });
      if (res.error) {
        throw new Error(res.error.message || "Failed to send verification email");
      }
      return res.data;
    },
    onSuccess: () => {
      toast.success("Verification email sent! Check your inbox.");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Delete account
  const deleteMutation = useMutation({
    mutationFn: async () => {
      const res = await authClient.deleteUser();
      if (res.error) {
        throw new Error(res.error.message || "Failed to delete account");
      }
      return res.data;
    },
    onSuccess: () => {
      toast.success("Account deleted. Redirecting...");
      window.location.href = "/";
    },
    onError: (error) => {
      toast.error(error.message);
      setShowDeleteConfirm(false);
      setDeleteConfirmText("");
    },
  });

  const isEmailVerified = session?.user?.emailVerified;

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-xl font-bold text-white">Account Settings</h2>
        <p className="text-sm text-slate-500 mt-1">
          Manage your account identification and security data.
        </p>
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
            {isEmailVerified ? (
              <div className="flex items-center gap-1.5 text-emerald-400 shrink-0 px-3">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-widest">
                  Verified
                </span>
              </div>
            ) : (
              <Button
                variant="outline"
                className="bg-slate-900 border-slate-800 text-xs shrink-0 gap-2"
                onClick={() => verifyMutation.mutate()}
                disabled={verifyMutation.isPending}
              >
                {verifyMutation.isPending ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Send className="h-3 w-3" />
                )}
                Verify
              </Button>
            )}
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
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                Account Created
              </p>
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
              Once you delete your account, there is no going back. All your SQL
              challenges, ranks, and playground data will be permanently wiped
              from our systems.
            </p>

            {!showDeleteConfirm ? (
              <Button
                variant="ghost"
                className="mt-4 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all gap-2 text-xs font-bold uppercase tracking-widest"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <Trash2 className="h-3 w-3" />
                Delete Account Permanently
              </Button>
            ) : (
              <div className="mt-4 space-y-4">
                <div className="space-y-2">
                  <p className="text-xs text-rose-500/80">
                    Type{" "}
                    <span className="font-mono font-bold text-rose-400">
                      DELETE
                    </span>{" "}
                    to confirm permanent account deletion:
                  </p>
                  <Input
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    placeholder="Type DELETE to confirm"
                    className="bg-rose-500/5 border-rose-500/20 text-rose-400 placeholder:text-rose-500/30 max-w-xs"
                    autoFocus
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="ghost"
                    className="bg-rose-500 text-white hover:bg-rose-600 gap-2 text-xs font-bold uppercase tracking-widest"
                    onClick={() => deleteMutation.mutate()}
                    disabled={
                      deleteConfirmText !== "DELETE" ||
                      deleteMutation.isPending
                    }
                  >
                    {deleteMutation.isPending ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Trash2 className="h-3 w-3" />
                    )}
                    Confirm Delete
                  </Button>
                  <Button
                    variant="ghost"
                    className="text-slate-400 hover:text-white text-xs"
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setDeleteConfirmText("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
