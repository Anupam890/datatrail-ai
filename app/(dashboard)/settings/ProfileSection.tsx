"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSession } from "@/lib/auth-client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FaGithub, FaLinkedin } from "react-icons/fa6";
import { Loader2, Camera, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

const profileSchema = z.object({
  displayName: z.string().min(2, "Name must be at least 2 characters"),
  username: z.string().min(3, "Username must be at least 3 characters").regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores"),
  bio: z.string().max(160, "Bio must be less than 160 characters").optional(),
  githubUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  linkedinUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function ProfileSection() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await fetch("/api/user/profile");
      if (!res.ok) throw new Error("Failed to fetch profile");
      return res.json();
    }
  });

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    values: {
      displayName: profile?.display_name || session?.user.name || "",
      username: profile?.username || "",
      bio: profile?.bio || "",
      githubUrl: profile?.github_url || "",
      linkedinUrl: profile?.linkedin_url || "",
    }
  });

  const mutation = useMutation({
    mutationFn: async (values: ProfileFormValues) => {
      const res = await fetch("/api/user/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "profile", data: values }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to update profile");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("Profile updated successfully");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit((v) => mutation.mutate(v))} className="space-y-10">
      <div>
        <h2 className="text-xl font-bold text-white">Public Profile</h2>
        <p className="text-sm text-slate-500 mt-1">This information will be visible to other members of SQLArena.</p>
      </div>

      {/* Avatar Section */}
      <div className="flex items-center gap-8">
        <div className="relative group">
          <Avatar className="h-24 w-24 border-2 border-slate-800 ring-4 ring-indigo-500/10">
            <AvatarImage src={session?.user.image || ""} />
            <AvatarFallback className="bg-indigo-600 text-white text-2xl font-bold">
              {session?.user.name?.[0] || "U"}
            </AvatarFallback>
          </Avatar>
          <button className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="h-6 w-6 text-white" />
          </button>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-bold text-white">Profile Photo</p>
          <p className="text-xs text-slate-500">JPG, GIF or PNG. Max size 2MB.</p>
          <div className="flex gap-2 mt-2">
            <Button variant="outline" size="sm" className="bg-slate-900 border-slate-800 text-xs">Update</Button>
            <Button variant="ghost" size="sm" className="text-rose-500 hover:text-rose-400 hover:bg-rose-500/10 text-xs">Remove</Button>
          </div>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-3">
          <Label htmlFor="displayName" className="text-sm font-medium text-slate-300">Display Name</Label>
          <Input 
            {...form.register("displayName")} 
            className="bg-slate-900/50 border-slate-800 focus:ring-indigo-500/50"
            placeholder="John Doe"
          />
          {form.formState.errors.displayName && (
            <p className="text-xs text-rose-500 font-medium">{form.formState.errors.displayName.message}</p>
          )}
        </div>

        <div className="space-y-3">
          <Label htmlFor="username" className="text-sm font-medium text-slate-300">Username</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">@</span>
            <Input 
              {...form.register("username")} 
              className="bg-slate-900/50 border-slate-800 pl-8 focus:ring-indigo-500/50"
              placeholder="johndoe"
            />
          </div>
          {form.formState.errors.username && (
            <p className="text-xs text-rose-500 font-medium">{form.formState.errors.username.message}</p>
          )}
        </div>

        <div className="space-y-3 md:col-span-2">
          <Label htmlFor="bio" className="text-sm font-medium text-slate-300">Bio</Label>
          <Textarea 
            {...form.register("bio")} 
            className="bg-slate-900/50 border-slate-800 focus:ring-indigo-500/50 min-h-[100px] resize-none"
            placeholder="A brief description of your journey with SQL..."
          />
          <div className="flex justify-between items-center">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Max 160 characters</p>
            {form.formState.errors.bio && (
              <p className="text-xs text-rose-500 font-medium">{form.formState.errors.bio.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium text-slate-300 flex items-center gap-2">
            <FaGithub className="h-4 w-4" /> GitHub
          </Label>
          <Input 
            {...form.register("githubUrl")} 
            className="bg-slate-900/50 border-slate-800 focus:ring-indigo-500/50"
            placeholder="https://github.com/..."
          />
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium text-slate-300 flex items-center gap-2">
            <FaLinkedin className="h-4 w-4" /> LinkedIn
          </Label>
          <Input 
            {...form.register("linkedinUrl")} 
            className="bg-slate-900/50 border-slate-800 focus:ring-indigo-500/50"
            placeholder="https://linkedin.com/in/..."
          />
        </div>
      </div>

      <div className="pt-6 border-t border-slate-800/50 flex justify-end">
        <Button 
          type="submit" 
          disabled={mutation.isPending || !form.formState.isDirty}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 h-11 rounded-xl shadow-lg shadow-indigo-600/20 gap-2 transition-all"
        >
          {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {mutation.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
