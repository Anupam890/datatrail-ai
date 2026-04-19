"use client";

import { useState } from "react";
import { signIn } from "@/lib/auth-client";
import AuthCard from "@/components/auth/AuthCard";
import InputField from "@/components/auth/InputField";
import PasswordInput from "@/components/auth/PasswordInput";
import OAuthButton from "@/components/auth/OAuthButton";
import AuthFooter from "@/components/auth/AuthFooter";
import { Button } from "@/components/ui/button";
import { Mail, ChevronRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const { error: signInError } = await signIn.email({
        email: formData.email,
        password: formData.password,
        callbackURL: "/arena",
      });

      if (signInError) {
        setError(signInError.message || "Invalid credentials");
      } else {
        router.push("/arena");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard 
      title="Welcome Back" 
      subtitle="Login to continue your SQL journey"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <InputField
          icon={Mail}
          label="Email Address"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        
        <div className="space-y-2">
          <PasswordInput
            label="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          <div className="flex justify-end pr-1">
            <Link href="/forgot-password" title="Recover Access" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
              Forgot password?
            </Link>
          </div>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-[11px] font-bold uppercase tracking-wider text-center"
          >
            {error}
          </motion.div>
        )}

        <Button
          type="submit"
          className="w-full h-14 rounded-xl bg-gradient-to-r from-primary to-indigo-600 text-white font-black text-lg transition-all hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] hover:scale-[1.02] active:scale-[0.98] group relative overflow-hidden"
          disabled={isLoading}
        >
           <span className="relative z-10 flex items-center justify-center gap-2">
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Login
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
           </span>
           <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        </Button>
      </form>

      <div className="relative my-10">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#1F2937]" />
        </div>
        <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.2em]">
          <span className="bg-[#111827] px-4 text-muted-foreground/60">Or continue with</span>
        </div>
      </div>

      <OAuthButton />

      <AuthFooter 
        text="Don't have an account?" 
        linkText="Sign up" 
        href="/signup" 
      />
    </AuthCard>
  );
}
