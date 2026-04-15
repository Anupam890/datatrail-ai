"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import AuthCard from "@/components/auth/AuthCard";
import PasswordInput from "@/components/auth/PasswordInput";
import { Button } from "@/components/ui/button";
import { ChevronRight, CheckCircle2, Loader2 } from "lucide-react";
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
      subtitle={isSuccess ? "Password Reset Successful" : "Establish your new security access password"}
    >
      {!isSuccess ? (
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4">
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
            className="w-full h-14 rounded-xl bg-gradient-to-r from-primary to-indigo-600 text-white font-black text-lg transition-all hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] group overflow-hidden"
            disabled={isLoading}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Update Password
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </span>
          </Button>
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
            Your security cipher has been updated. <br />
            Node access is now fully restored.
          </p>
          <div className="pt-4">
             <Link href="/login">
               <Button className="w-full h-14 rounded-xl bg-primary font-black uppercase tracking-wider">
                 Access Console
               </Button>
             </Link>
          </div>
        </motion.div>
      )}
    </AuthCard>
  );
}
