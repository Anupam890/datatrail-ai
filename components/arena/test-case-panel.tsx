"use client";

import { Database, Eye, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { colors } from "@/lib/colors";

interface TestCasePanelProps {
  sampleTables: {
    table: string;
    columns: string[];
    rows: string[][];
  }[];
  expectedOutput?: any;
}

export function TestCasePanel({ sampleTables, expectedOutput }: TestCasePanelProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {sampleTables.map((dataset) => (
          <div key={dataset.table} className="space-y-2">
            <div className="flex items-center gap-2 px-1">
              <Database className="h-3 w-3 text-indigo-400" />
              <h4 className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">{dataset.table}</h4>
            </div>
            <div className="rounded-lg border border-white/5 overflow-hidden bg-white/[0.01]">
              <div className="overflow-x-auto">
                <table className="w-full text-[10px]">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/5">
                      {dataset.columns.map((col) => (
                        <th key={col} className="px-3 py-1.5 text-left font-mono font-bold text-slate-500 uppercase tracking-tighter">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {dataset.rows.slice(0, 5).map((row, idx) => (
                      <tr key={idx} className="border-b border-white/5 last:border-0">
                        {row.map((cell, cidx) => (
                          <td key={cidx} className="px-3 py-1.5 font-mono text-slate-400">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))}
      </div>

      {expectedOutput && (
        <div className="pt-4 border-t border-white/5 space-y-2">
          <div className="flex items-center gap-2 px-1">
            <Eye className="h-3 w-3 text-emerald-400" />
            <h4 className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Expected Output</h4>
          </div>
          <div className="rounded-lg border border-white/5 bg-emerald-500/[0.01] p-3">
             <pre className="text-[10px] font-mono text-emerald-400/80 overflow-x-auto">
               {JSON.stringify(expectedOutput, null, 2)}
             </pre>
          </div>
        </div>
      )}

      <div className="p-4 rounded-xl bg-indigo-500/[0.02] border border-indigo-500/10 flex items-center gap-3">
         <Lock className="h-4 w-4 text-indigo-400/50" />
         <p className="text-[10px] text-slate-500 font-medium">
           Hidden test cases will be run during <span className="text-indigo-400">Submission</span>.
         </p>
      </div>
    </div>
  );
}
