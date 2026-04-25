"use client";

import { useRef, useState } from "react";
import Editor, { type OnMount } from "@monaco-editor/react";
import { useTheme } from "next-themes";

interface SQLEditorProps {
  value: string;
  onChange: (value: string) => void;
  onRun?: () => void;
  height?: string;
  language?: string;
  fontSize?: number;
  tabSize?: number;
  lineNumbers?: "on" | "off";
  wordWrap?: "on" | "off";
}

export function SQLEditor({ 
  value, 
  onChange, 
  onRun, 
  height = "300px", 
  language = "sql",
  fontSize = 14,
  tabSize = 2,
  lineNumbers = "on",
  wordWrap = "on"
}: SQLEditorProps) {
  const { theme } = useTheme();
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);

  const handleMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // Add keyboard shortcut for running queries
    editor.addAction({
      id: "run-query",
      label: "Run Query",
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
      run: () => onRun?.(),
    });
  };

  return (
    <div className="w-full h-full">
      <Editor
        height={height}
        language={language}
        theme="datatrail-dark"
        value={value}
        onChange={(val) => onChange(val || "")}
        onMount={(editor, monaco) => {
          handleMount(editor, monaco);
          
          // Define custom theme
          monaco.editor.defineTheme("datatrail-dark", {
            base: "vs-dark",
            inherit: true,
            rules: [
              { token: "keyword", foreground: "818cf8", fontStyle: "bold" },
              { token: "string", foreground: "34d399" },
              { token: "number", foreground: "fbbf24" },
              { token: "comment", foreground: "64748b", fontStyle: "italic" },
              { token: "identifier", foreground: "e2e8f0" },
            ],
            colors: {
              "editor.background": "#0B0F1900", // Transparent
              "editor.foreground": "#e2e8f0",
              "editorLineNumber.foreground": "#475569",
              "editorLineNumber.activeForeground": "#818cf8",
              "editor.selectionBackground": "#818cf820",
              "editorCursor.foreground": "#818cf8",
              "editor.lineHighlightBackground": "#1e293b50",
            },
          });
          monaco.editor.setTheme("datatrail-dark");
        }}
        options={{
          minimap: { enabled: false },
          fontSize: fontSize,
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          lineNumbers: lineNumbers,
          renderLineHighlight: "all",
          tabSize: tabSize,
          wordWrap: wordWrap,
          automaticLayout: true,
          scrollBeyondLastLine: false,
          padding: { top: 16, bottom: 16 },
          fontLigatures: true,
          cursorSmoothCaretAnimation: "on",
          smoothScrolling: true,
        }}
      />
    </div>
  );
}
