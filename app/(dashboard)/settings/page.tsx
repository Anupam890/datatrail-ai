"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { 
  User, 
  Settings as SettingsIcon, 
  Database, 
  Globe, 
  Mail, 
  Lock, 
  Trash2, 
  Save, 
  Loader2,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa6";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  // Profile Form State
  const [formData, setFormData] = useState({
    displayName: "",
    username: "",
    bio: "",
    githubUrl: "",
    linkedinUrl: "",
    website: "",
  });

  // Snowflake Connection State
  const [snowflakeData, setSnowflakeData] = useState({
    account: "",
    username: "",
    warehouse: "",
    database: "",
    schema: "",
    role: "",
  });

  useEffect(() => {
    if (session?.user) {
      fetchProfile();
    }
  }, [session]);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      // We'll fetch by user ID since we are the owner
      const response = await fetch(`/api/user/profile`);
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setFormData({
          displayName: data.display_name || session?.user.name || "",
          username: data.username || "",
          bio: data.bio || "",
          githubUrl: data.github_url || "",
          linkedinUrl: data.linkedin_url || "",
          website: data.website || "",
        });
        
        if (data.snowflake_config) {
          setSnowflakeData(data.snowflake_config);
        }
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/user/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "profile",
          data: formData
        }),
      });

      if (response.ok) {
        toast.success("Profile updated successfully");
      } else {
        const err = await response.json();
        toast.error(err.error || "Failed to update profile");
      }
    } catch (error) {
      toast.error("An error occurred while saving");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSnowflakeSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/user/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "snowflake",
          data: snowflakeData
        }),
      });

      if (response.ok) {
        toast.success("Snowflake configuration saved");
      } else {
        toast.error("Failed to save configuration");
      }
    } catch (error) {
      toast.error("An error occurred while saving");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Loading settings</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-slate-400">Manage your profile, account security, and data connections.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Navigation */}
          <aside className="md:w-64 space-y-2">
            <TabsList className="flex flex-col h-auto bg-transparent p-0 gap-1">
              <TabsTrigger 
                value="profile"
                className="w-full justify-start gap-3 px-4 py-3 rounded-lg data-[state=active]:bg-indigo-500/10 data-[state=active]:text-indigo-400 text-slate-400 hover:text-slate-200 transition-all border border-transparent data-[state=active]:border-indigo-500/20"
              >
                <User className="h-4 w-4" />
                <span>Profile</span>
              </TabsTrigger>
              <TabsTrigger 
                value="connections"
                className="w-full justify-start gap-3 px-4 py-3 rounded-lg data-[state=active]:bg-indigo-500/10 data-[state=active]:text-indigo-400 text-slate-400 hover:text-slate-200 transition-all border border-transparent data-[state=active]:border-indigo-500/20"
              >
                <Database className="h-4 w-4" />
                <span>Connections</span>
              </TabsTrigger>
              <TabsTrigger 
                value="account"
                className="w-full justify-start gap-3 px-4 py-3 rounded-lg data-[state=active]:bg-indigo-500/10 data-[state=active]:text-indigo-400 text-slate-400 hover:text-slate-200 transition-all border border-transparent data-[state=active]:border-indigo-500/20"
              >
                <Lock className="h-4 w-4" />
                <span>Account</span>
              </TabsTrigger>
              <TabsTrigger 
                value="preferences"
                className="w-full justify-start gap-3 px-4 py-3 rounded-lg data-[state=active]:bg-indigo-500/10 data-[state=active]:text-indigo-400 text-slate-400 hover:text-slate-200 transition-all border border-transparent data-[state=active]:border-indigo-500/20"
              >
                <SettingsIcon className="h-4 w-4" />
                <span>Preferences</span>
              </TabsTrigger>
            </TabsList>
          </aside>

          {/* Content Area */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {/* ── PROFILE TAB ── */}
                <TabsContent value="profile" className="mt-0 space-y-6">
                  <Card className="bg-slate-900/40 border-slate-800 shadow-xl">
                    <CardHeader>
                      <CardTitle className="text-xl">Public Profile</CardTitle>
                      <CardDescription>This information will be displayed on your profile page.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                        <Avatar className="h-24 w-24 border-2 border-slate-800 ring-4 ring-indigo-500/10">
                          <AvatarImage src={session?.user.image || ""} />
                          <AvatarFallback className="bg-indigo-500/20 text-indigo-400 text-xl font-bold">
                            {session?.user.name?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-2">
                          <Button variant="outline" size="sm" className="bg-slate-800/50 border-slate-700 hover:bg-slate-800">
                            Change Avatar
                          </Button>
                          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">JPG, GIF or PNG. Max size 2MB.</p>
                        </div>
                      </div>

                      <Separator className="bg-slate-800/50" />

                      <div className="grid gap-6 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="displayName">Display Name</Label>
                          <Input 
                            id="displayName" 
                            placeholder="Alex Smith"
                            value={formData.displayName}
                            onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                            className="bg-slate-900/50 border-slate-700 focus:border-indigo-500/50 transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="username">Username</Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">@</span>
                            <Input 
                              id="username" 
                              placeholder="alexsmith"
                              value={formData.username}
                              onChange={(e) => setFormData({...formData, username: e.target.value})}
                              className="bg-slate-900/50 border-slate-700 focus:border-indigo-500/50 pl-7"
                            />
                          </div>
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                          <Label htmlFor="bio">Bio</Label>
                          <Textarea 
                            id="bio" 
                            placeholder="Tell us about yourself..."
                            value={formData.bio}
                            onChange={(e) => setFormData({...formData, bio: e.target.value})}
                            className="bg-slate-900/50 border-slate-700 focus:border-indigo-500/50 min-h-[100px]"
                          />
                        </div>
                      </div>

                      <div className="grid gap-6 sm:grid-cols-2 pt-2">
                        <div className="space-y-2">
                          <Label className="flex items-center gap-2">
                            <FaGithub className="h-3 w-3" /> GitHub URL
                          </Label>
                          <Input 
                            placeholder="https://github.com/alexsmith"
                            value={formData.githubUrl}
                            onChange={(e) => setFormData({...formData, githubUrl: e.target.value})}
                            className="bg-slate-900/50 border-slate-700 focus:border-indigo-500/50"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="flex items-center gap-2">
                            <FaLinkedin className="h-3 w-3" /> LinkedIn URL
                          </Label>
                          <Input 
                            placeholder="https://linkedin.com/in/alexsmith"
                            value={formData.linkedinUrl}
                            onChange={(e) => setFormData({...formData, linkedinUrl: e.target.value})}
                            className="bg-slate-900/50 border-slate-700 focus:border-indigo-500/50"
                          />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="bg-slate-900/20 border-t border-slate-800 p-4">
                      <Button 
                        onClick={handleProfileSave}
                        disabled={isSaving}
                        className="ml-auto bg-indigo-600 hover:bg-indigo-500 gap-2 min-w-[120px]"
                      >
                        {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        Save Changes
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                {/* ── CONNECTIONS TAB ── */}
                <TabsContent value="connections" className="mt-0 space-y-6">
                  <Card className="bg-slate-900/40 border-slate-800 shadow-xl overflow-hidden">
                    <div className="bg-indigo-500/10 px-6 py-4 border-b border-indigo-500/20 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-500/20 rounded-lg">
                          <Database className="h-5 w-5 text-indigo-400" />
                        </div>
                        <div>
                          <h3 className="font-bold text-white">Snowflake Connection</h3>
                          <p className="text-[10px] text-indigo-400/60 uppercase tracking-widest font-bold">Required for Playground</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700/50">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] text-emerald-400 font-bold">Secure</span>
                      </div>
                    </div>
                    <CardContent className="p-6 space-y-6">
                      <p className="text-sm text-slate-400">
                        Configure your Snowflake credentials to execute queries directly from the playground. 
                        Your password is encrypted and stored securely.
                      </p>
                      
                      <div className="grid gap-6 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Account Identifier</Label>
                          <Input 
                            placeholder="xy12345.us-east-2.aws"
                            value={snowflakeData.account}
                            onChange={(e) => setSnowflakeData({...snowflakeData, account: e.target.value})}
                            className="bg-slate-900/50 border-slate-700"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Username</Label>
                          <Input 
                            placeholder="ALEX_SMITH"
                            value={snowflakeData.username}
                            onChange={(e) => setSnowflakeData({...snowflakeData, username: e.target.value})}
                            className="bg-slate-900/50 border-slate-700"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Warehouse</Label>
                          <Input 
                            placeholder="COMPUTE_WH"
                            value={snowflakeData.warehouse}
                            onChange={(e) => setSnowflakeData({...snowflakeData, warehouse: e.target.value})}
                            className="bg-slate-900/50 border-slate-700"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Role (Optional)</Label>
                          <Input 
                            placeholder="ACCOUNTADMIN"
                            value={snowflakeData.role}
                            onChange={(e) => setSnowflakeData({...snowflakeData, role: e.target.value})}
                            className="bg-slate-900/50 border-slate-700"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Database</Label>
                          <Input 
                            placeholder="SNOWFLAKE_SAMPLE_DATA"
                            value={snowflakeData.database}
                            onChange={(e) => setSnowflakeData({...snowflakeData, database: e.target.value})}
                            className="bg-slate-900/50 border-slate-700"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Schema</Label>
                          <Input 
                            placeholder="TPCH_SF1"
                            value={snowflakeData.schema}
                            onChange={(e) => setSnowflakeData({...snowflakeData, schema: e.target.value})}
                            className="bg-slate-900/50 border-slate-700"
                          />
                        </div>
                      </div>

                      <div className="bg-amber-500/5 border border-amber-500/10 rounded-lg p-4 flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-amber-400">Security Note</p>
                          <p className="text-[11px] text-amber-500/70 leading-relaxed">
                            We recommend creating a dedicated read-only user in Snowflake with restricted permissions for the best security posture.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="bg-slate-900/20 border-t border-slate-800 p-4">
                      <Button 
                        onClick={handleSnowflakeSave}
                        disabled={isSaving}
                        className="ml-auto bg-indigo-600 hover:bg-indigo-500 gap-2 min-w-[120px]"
                      >
                        {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        Save Connection
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                {/* ── ACCOUNT TAB ── */}
                <TabsContent value="account" className="mt-0 space-y-6">
                  <Card className="bg-slate-900/40 border-slate-800 shadow-xl">
                    <CardHeader>
                      <CardTitle className="text-xl">Account Settings</CardTitle>
                      <CardDescription>Manage your account credentials and security.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label>Email Address</Label>
                        <div className="flex gap-2">
                          <Input 
                            value={session?.user.email || ""} 
                            readOnly 
                            className="bg-slate-800/30 border-slate-700 text-slate-500"
                          />
                          <Button variant="outline" className="border-slate-700" disabled>
                            Verified
                          </Button>
                        </div>
                        <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest pt-1">
                          Primary email used for notifications and sign-in.
                        </p>
                      </div>

                      <Separator className="bg-slate-800/50" />

                      <div className="space-y-4">
                        <h4 className="text-sm font-bold text-white">Password</h4>
                        <p className="text-xs text-slate-400">
                          Update your password to keep your account secure.
                        </p>
                        <Button variant="outline" className="border-slate-700 hover:bg-slate-800 transition-colors">
                          Change Password
                        </Button>
                      </div>

                      <Separator className="bg-slate-800/50" />

                      <div className="pt-4">
                        <h4 className="text-sm font-bold text-rose-500 mb-2">Danger Zone</h4>
                        <p className="text-xs text-slate-400 mb-4">
                          Permanently delete your account and all associated data. This action cannot be undone.
                        </p>
                        <Button variant="ghost" className="text-rose-500 hover:text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 gap-2">
                          <Trash2 className="h-4 w-4" />
                          Delete Account
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* ── PREFERENCES TAB ── */}
                <TabsContent value="preferences" className="mt-0 space-y-6">
                  <Card className="bg-slate-900/40 border-slate-800 shadow-xl">
                    <CardHeader>
                      <CardTitle className="text-xl">Preferences</CardTitle>
                      <CardDescription>Customize your experience on DataTrail AI.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">Dark Mode</Label>
                          <p className="text-xs text-slate-400">Enable high-contrast dark theme (recommended).</p>
                        </div>
                        <div className="flex h-6 w-11 items-center rounded-full bg-indigo-600 p-1">
                          <div className="h-4 w-4 translate-x-5 rounded-full bg-white transition-all shadow-sm" />
                        </div>
                      </div>

                      <Separator className="bg-slate-800/50" />

                      <div className="flex items-center justify-between opacity-50">
                        <div className="space-y-0.5">
                          <Label className="text-base">AI Autocomplete</Label>
                          <p className="text-xs text-slate-400">Suggest code as you type in the playground.</p>
                        </div>
                        <div className="flex h-6 w-11 items-center rounded-full bg-slate-700 p-1 cursor-not-allowed">
                          <div className="h-4 w-4 rounded-full bg-white transition-all shadow-sm" />
                        </div>
                      </div>

                      <Separator className="bg-slate-800/50" />

                      <div className="space-y-4">
                        <h4 className="text-sm font-bold text-white">Email Notifications</h4>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-300">New rank achievements</span>
                            <div className="flex h-5 w-9 items-center rounded-full bg-indigo-600 p-1">
                              <div className="h-3 w-3 translate-x-4 rounded-full bg-white shadow-sm" />
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-300">Weekly progress summary</span>
                            <div className="flex h-5 w-9 items-center rounded-full bg-indigo-600 p-1">
                              <div className="h-3 w-3 translate-x-4 rounded-full bg-white shadow-sm" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </Tabs>
    </div>
  );
}
