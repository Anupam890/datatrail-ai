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
      subtitle="Login to continue your data engineering journey"
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
            <Link href="/forgot-password" title="Recover Access" className="text-[9px] font-black uppercase tracking-widest text-white/20 hover:text-primary transition-colors">
              Forgot password?
            </Link>
          </div>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 rounded-2xl bg-destructive/5 border border-destructive/10 text-destructive text-[10px] font-black uppercase tracking-widest text-center"
          >
            {error}
          </motion.div>
        )}

        <Button
          type="submit"
          className="w-full h-16 rounded-[2rem] bg-primary text-white font-black text-lg transition-all hover:shadow-[0_0_40px_rgba(99,102,241,0.4)] hover:scale-[1.02] active:scale-[0.98] group relative overflow-hidden uppercase tracking-widest italic"
          disabled={isLoading}
        >
           <span className="relative z-10 flex items-center justify-center gap-3">
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  Authenticate
                  <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </>
              )}
           </span>
           <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        </Button>
      </form>

      <div className="relative my-10">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/5" />
        </div>
        <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.3em]">
          <span className="bg-[#0B0F19] px-6 text-white/20">Secured Access</span>
        </div>
      </div>

      <OAuthButton />

      <AuthFooter 
        text="New to the trail?" 
        linkText="Join the waitlist" 
        href="/signup" 
      />
    </AuthCard>
  );
}
