"use client";

import { useState } from "react";
import { signUp } from "@/lib/auth-client";
import AuthCard from "@/components/auth/AuthCard";
import InputField from "@/components/auth/InputField";
import PasswordInput from "@/components/auth/PasswordInput";
import OAuthButton from "@/components/auth/OAuthButton";
import AuthFooter from "@/components/auth/AuthFooter";
import { Button } from "@/components/ui/button";
import { Mail, User, ChevronRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return null;
    if (pwd.length < 6)
      return { label: "Weak", color: "bg-red-500", width: "33%" };
    if (pwd.length < 10)
      return { label: "Medium", color: "bg-yellow-500", width: "66%" };
    return { label: "Strong", color: "bg-emerald-500", width: "100%" };
  };

  const strength = getPasswordStrength(formData.password);

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
      const { error: signUpError } = await signUp.email({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        callbackURL: "/arena",
      });

      if (signUpError) {
        setError(signUpError.message || "Registration Failed");
      } else {
        router.push("/arena");
      }
    } catch (err) {
      setError("System handshake failure.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard
      title="Create Account"
      subtitle="Start your data engineering journey today"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          icon={User}
          label="Full Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />

        <InputField
          icon={Mail}
          label="Email Address"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />

        <div className="space-y-4 pt-2">
          <PasswordInput
            label="Password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />

          {strength && (
            <div className="px-1 space-y-2 transition-all">
              <div className="flex justify-between items-center">
                <span className="text-[8px] font-black uppercase tracking-widest text-white/20">
                  Password Strength
                </span>
                <span className={cn("text-[9px] font-black uppercase tracking-widest", strength.color.replace("bg-", "text-"))}>
                  {strength.label}
                </span>
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: strength.width }}
                  className={`h-full transition-all duration-700 ${strength.color}`}
                />
              </div>
            </div>
          )}

          <PasswordInput
            label="Confirm Password"
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
            required
            error={
              formData.confirmPassword &&
              formData.password !== formData.confirmPassword
                ? "Passwords do not match"
                : ""
            }
          />
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 rounded-2xl bg-destructive/5 border border-destructive/10 text-destructive text-[10px] font-black uppercase tracking-widest text-center mt-4"
          >
            {error}
          </motion.div>
        )}

        <Button
          type="submit"
          className="w-full h-16 rounded-[2rem] bg-primary text-white font-black text-lg transition-all hover:shadow-[0_0_40px_rgba(99,102,241,0.4)] hover:scale-[1.02] active:scale-[0.98] group relative overflow-hidden mt-6 uppercase tracking-widest italic"
          disabled={isLoading}
        >
          <span className="relative z-10 flex items-center justify-center gap-3">
            {isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                Initialize Account
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
        text="Already an architect?"
        linkText="Sign In"
        href="/login"
      />
    </AuthCard>
  );
}

import { cn } from "@/lib/utils";
