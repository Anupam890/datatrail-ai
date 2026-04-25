"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import AuthCard from "@/components/auth/AuthCard";
import InputField from "@/components/auth/InputField";
import { Button } from "@/components/ui/button";
import { Mail, ArrowLeft, Send, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const { error: resetError } = await authClient.requestPasswordReset({
        email,
        redirectTo: "/reset-password",
      });

      if (resetError) {
        setError(resetError.message || "Failed to initiate recovery");
      } else {
        setIsSent(true);
      }
    } catch (err) {
      setError("Handshake error. Retry connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard
      title="Reset Password"
      subtitle={
        isSent
          ? "Transmission Successful"
          : "Recover access to your DataTrail learning node"
      }
    >
      {!isSent ? (
        <form onSubmit={handleSubmit} className="space-y-8">
          <InputField
            icon={Mail}
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            error={error}
          />

          <Button
            type="submit"
            className="w-full h-16 rounded-[2rem] bg-primary text-white font-black text-lg transition-all hover:shadow-[0_0_40px_rgba(99,102,241,0.4)] group relative overflow-hidden uppercase tracking-widest italic"
            disabled={isLoading}
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  Initiate Recovery
                  <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </>
              )}
            </span>
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Button>

          <Link
            href="/login"
            className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-primary transition-colors italic"
          >
            <ArrowLeft className="w-4 h-4" />
            Abort & Return
          </Link>
        </form>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-10 py-6"
        >
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full" />
            <div className="relative p-8 rounded-[2.5rem] bg-emerald-500/10 border border-emerald-500/20">
              <CheckCircle2 className="w-16 h-16 text-emerald-500" />
            </div>
          </div>
          
          <div className="space-y-4">
            <p className="text-white/40 text-sm leading-relaxed uppercase tracking-widest font-bold">
              Override code dispatched <br />
              to the node
            </p>
            <div className="px-6 py-3 rounded-full bg-white/5 border border-white/10 inline-block">
              <span className="text-primary font-black tracking-widest text-[11px] italic">{email}</span>
            </div>
          </div>

          <div className="pt-6 flex flex-col gap-6">
            <button
              className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-white transition-colors"
              onClick={() => setIsSent(false)}
            >
              Retry Transmission
            </button>
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-[0.4em] text-primary hover:text-white transition-colors italic"
            >
              <ArrowLeft className="w-5 h-5" />
              Return to Port
            </Link>
          </div>
        </motion.div>
      )}
    </AuthCard>
  );
}
