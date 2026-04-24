"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Code, Palette, Loader2, Save, Check } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Preferences {
  font_size: number;
  tab_size: number;
  sql_dialect: string;
  animated_transitions: boolean;
  compact_mode: boolean;
}

export function PreferencesSection() {
  const queryClient = useQueryClient();

  const { data: prefs, isLoading } = useQuery<Preferences>({
    queryKey: ["preferences"],
    queryFn: async () => {
      const res = await fetch("/api/user/preferences");
      if (!res.ok) throw new Error("Failed to fetch preferences");
      return res.json();
    },
  });

  const [fontSize, setFontSize] = useState([14]);
  const [tabSize, setTabSize] = useState("2");
  const [dialect, setDialect] = useState("postgresql");
  const [animatedTransitions, setAnimatedTransitions] = useState(true);
  const [compactMode, setCompactMode] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (prefs) {
      setFontSize([prefs.font_size]);
      setTabSize(String(prefs.tab_size));
      setDialect(prefs.sql_dialect);
      setAnimatedTransitions(prefs.animated_transitions);
      setCompactMode(prefs.compact_mode);
      setIsDirty(false);
    }
  }, [prefs]);

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/user/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fontSize: fontSize[0],
          tabSize: parseInt(tabSize),
          sqlDialect: dialect,
          animatedTransitions,
          compactMode,
        }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to save preferences");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("Preferences saved successfully");
      queryClient.invalidateQueries({ queryKey: ["preferences"] });
      setIsDirty(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const markDirty = () => setIsDirty(true);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-xl font-bold text-white">
          Application Preferences
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Customize how you interact with the SQLArena playground and interface.
        </p>
      </div>

      {/* Editor Preferences */}
      <div className="space-y-8">
        <div className="flex items-center gap-3 text-indigo-400">
          <Code className="h-5 w-5" />
          <h3 className="text-sm font-bold uppercase tracking-widest">
            Editor Settings
          </h3>
        </div>

        <div className="grid gap-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <Label className="text-sm font-medium text-slate-200">
                Font Size
              </Label>
              <p className="text-xs text-slate-500">
                Adjust the code editor font size for better readability.
              </p>
            </div>
            <div className="w-full md:w-64 flex items-center gap-4">
              <Slider
                value={fontSize}
                onValueChange={(v) => {
                  setFontSize(v);
                  markDirty();
                  
                }}
                max={24}
                min={10}
                step={1}
                className="flex-1"
              />
              <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded border border-indigo-500/20 w-12 text-center">
                {fontSize}px
              </span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <Label className="text-sm font-medium text-slate-200">
                Tab Size
              </Label>
              <p className="text-xs text-slate-500">
                Number of spaces per indentation level.
              </p>
            </div>
            <Select
              value={tabSize}
              onValueChange={(v) => {
                setTabSize(v);
                markDirty();
              }}
            >
              <SelectTrigger className="w-full md:w-32 bg-slate-900 border-slate-800">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                <SelectItem value="2">2 Spaces</SelectItem>
                <SelectItem value="4">4 Spaces</SelectItem>
                <SelectItem value="8">8 Spaces</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <Label className="text-sm font-medium text-slate-200">
                Default SQL Dialect
              </Label>
              <p className="text-xs text-slate-500">
                The primary SQL syntax used in your playground sessions.
              </p>
            </div>
            <Select
              value={dialect}
              onValueChange={(v) => {
                setDialect(v);
                markDirty();
              }}
            >
              <SelectTrigger className="w-full md:w-48 bg-slate-900 border-slate-800">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                <SelectItem value="postgresql">PostgreSQL</SelectItem>
                <SelectItem value="mysql">MySQL</SelectItem>
                <SelectItem value="sqlite">SQLite</SelectItem>
                <SelectItem value="snowflake">Snowflake</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Interface Preferences */}
      <div className="space-y-8 pt-6 border-t border-slate-800/50">
        <div className="flex items-center gap-3 text-indigo-400">
          <Palette className="h-5 w-5" />
          <h3 className="text-sm font-bold uppercase tracking-widest">
            Interface Settings
          </h3>
        </div>

        <div className="grid gap-10">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium text-slate-200">
                Animated Transitions
              </Label>
              <p className="text-xs text-slate-500">
                Enable smooth UI transitions and micro-animations.
              </p>
            </div>
            <Switch
              checked={animatedTransitions}
              onCheckedChange={(v) => {
                setAnimatedTransitions(v);
                markDirty();
              }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium text-slate-200">
                Compact Mode
              </Label>
              <p className="text-xs text-slate-500">
                Reduces spacing in table rows and lists.
              </p>
            </div>
            <Switch
              checked={compactMode}
              onCheckedChange={(v) => {
                setCompactMode(v);
                markDirty();
              }}
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="pt-6 border-t border-slate-800/50 flex justify-end">
        <Button
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending || !isDirty}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 h-11 rounded-xl shadow-lg shadow-indigo-600/20 gap-2 transition-all"
        >
          {mutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : mutation.isSuccess && !isDirty ? (
            <Check className="h-4 w-4" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {mutation.isPending
            ? "Saving..."
            : mutation.isSuccess && !isDirty
              ? "Saved"
              : "Save Preferences"}
        </Button>
      </div>
    </div>
  );
}
