"use client";

import { useState } from "react";
import { Monitor, Type, Code, Palette, Check } from "lucide-react";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";

export function PreferencesSection() {
  const [fontSize, setFontSize] = useState([14]);
  const [tabSize, setTabSize] = useState("2");
  const [dialect, setDialect] = useState("postgresql");

  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-xl font-bold text-white">Application Preferences</h2>
        <p className="text-sm text-slate-500 mt-1">Customize how you interact with the SQLArena playground and interface.</p>
      </div>

      {/* Editor Preferences */}
      <div className="space-y-8">
        <div className="flex items-center gap-3 text-indigo-400">
          <Code className="h-5 w-5" />
          <h3 className="text-sm font-bold uppercase tracking-widest">Editor Settings</h3>
        </div>

        <div className="grid gap-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <Label className="text-sm font-medium text-slate-200">Font Size</Label>
              <p className="text-xs text-slate-500">Adjust the code editor font size for better readability.</p>
            </div>
            <div className="w-full md:w-64 flex items-center gap-4">
              <Slider 
                value={fontSize} 
                onValueChange={setFontSize} 
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
              <Label className="text-sm font-medium text-slate-200">Tab Size</Label>
              <p className="text-xs text-slate-500">Number of spaces per indentation level.</p>
            </div>
            <Select value={tabSize} onValueChange={setTabSize}>
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
              <Label className="text-sm font-medium text-slate-200">Default SQL Dialect</Label>
              <p className="text-xs text-slate-500">The primary SQL syntax used in your playground sessions.</p>
            </div>
            <Select value={dialect} onValueChange={setDialect}>
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
          <h3 className="text-sm font-bold uppercase tracking-widest">Interface Settings</h3>
        </div>

        <div className="grid gap-10">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium text-slate-200">Animated Transitions</Label>
              <p className="text-xs text-slate-500">Enable smooth UI transitions and micro-animations.</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium text-slate-200">Compact Mode</Label>
              <p className="text-xs text-slate-500">Reduces spacing in table rows and lists.</p>
            </div>
            <Switch />
          </div>
        </div>
      </div>
    </div>
  );
}
