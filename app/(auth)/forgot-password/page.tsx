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
          : "Enter your email to reset your password"
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
            className="w-full h-14 rounded-xl bg-gradient-to-r from-primary to-indigo-600 text-white font-black text-lg transition-all hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] group relative overflow-hidden"
            disabled={isLoading}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Send Reset Link
                  <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </>
              )}
            </span>
          </Button>

          <Link
            href="/login"
            className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to login
          </Link>
        </form>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-8 py-4"
        >
          <div className="p-6 rounded-3xl bg-secondary/10 border border-secondary/20 inline-block">
            <CheckCircle2 className="w-12 h-12 text-secondary" />
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Override code dispatched to the node <br />
            <span className="text-white font-bold tracking-tight">{email}</span>
            .
          </p>
          <div className="pt-4 flex flex-col gap-4">
            <Button
              variant="outline"
              className="w-full h-12 rounded-xl border-[#1F2937] bg-white/5 font-bold uppercase tracking-wider text-[10px]"
              onClick={() => setIsSent(false)}
            >
              Retry Transmission
            </Button>
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Port
            </Link>
          </div>
        </motion.div>
      )}
    </AuthCard>
  );
}
