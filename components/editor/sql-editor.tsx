"use client";

import { useRef, useState } from "react";
import Editor, { type OnMount } from "@monaco-editor/react";
import { useTheme } from "next-themes";

interface SQLEditorProps {
  value: string;
  onChange: (value: string) => void;
  onRun?: () => void;
  height?: string;
}

export function SQLEditor({ value, onChange, onRun, height = "300px" }: SQLEditorProps) {
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
    <div className="rounded-lg border overflow-hidden">
      <Editor
        height={height}
        language="sql"
        theme={theme === "dark" ? "vs-dark" : "light"}
        value={value}
        onChange={(val) => onChange(val || "")}
        onMount={handleMount}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: "on",
          tabSize: 2,
          wordWrap: "on",
          automaticLayout: true,
          scrollBeyondLastLine: false,
          padding: { top: 12 },
          suggestOnTriggerCharacters: true,
        }}
      />
    </div>
  );
}
