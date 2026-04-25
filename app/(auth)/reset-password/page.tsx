"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import AuthCard from "@/components/auth/AuthCard";
import PasswordInput from "@/components/auth/PasswordInput";
import { Button } from "@/components/ui/button";
import { ChevronRight, CheckCircle2, Loader2, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Authorization tokens do not match");
      setIsLoading(false);
      return;
    }

    try {
      const { error: resetError } = await authClient.resetPassword({
        newPassword: formData.password,
      });

      if (resetError) {
        setError(resetError.message || "Failed to update security cipher");
      } else {
        setIsSuccess(true);
      }
    } catch (err) {
      setError("System override error.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard 
      title="Set New Password" 
      subtitle={isSuccess ? "Access Restored" : "Establish your new security access credentials"}
    >
      {!isSuccess ? (
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <PasswordInput
              label="New Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
            <PasswordInput
              label="Confirm Password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
              error={error}
            />
          </div>

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
                  Update Security Cipher
                  <ShieldCheck className="w-6 h-6 group-hover:scale-110 transition-transform" />
                </>
              )}
            </span>
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Button>
        </form>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-10 py-6"
        >
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
            <div className="relative p-8 rounded-[2.5rem] bg-primary/10 border border-primary/20">
              <CheckCircle2 className="w-16 h-16 text-primary" />
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-white/40 text-sm leading-relaxed uppercase tracking-widest font-bold">
              Your security cipher has been updated <br />
              Node access is now fully restored
            </p>
          </div>

          <div className="pt-6">
             <Link href="/login">
               <Button className="w-full h-16 rounded-[2rem] bg-primary text-white font-black text-lg transition-all hover:shadow-[0_0_40px_rgba(99,102,241,0.4)] hover:scale-[1.02] active:scale-[0.98] uppercase tracking-widest italic">
                 Access Console
               </Button>
             </Link>
          </div>
        </motion.div>
      )}
    </AuthCard>
  );
}
