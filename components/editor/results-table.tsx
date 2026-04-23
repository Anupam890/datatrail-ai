"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, Database } from "lucide-react";
import type { QueryResult } from "@/types";

export function ResultsTable({ result }: { result: QueryResult }) {
  if (result.error) {
    return (
      <div className="rounded-lg border border-rose-500/20 bg-rose-500/5 p-4 animate-in fade-in slide-in-from-top-2 duration-300">
        <div className="flex items-center gap-2 text-rose-400 mb-1">
          <AlertCircle className="h-4 w-4" />
          <p className="text-xs font-bold uppercase tracking-wider">Query Error</p>
        </div>
        <p className="text-sm text-slate-300 mt-1 font-mono leading-relaxed">{result.error}</p>
      </div>
    );
  }

  if (result.rows.length === 0) {
    return (
      <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-12 text-center">
        <Database className="h-8 w-8 text-slate-700 mx-auto mb-3 opacity-20" />
        <p className="text-sm text-slate-500">No results returned for this query</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <ScrollArea className="rounded-md border border-slate-800 bg-slate-900/20 max-h-[400px]">
        <Table>
          <TableHeader className="bg-slate-900/60 sticky top-0 z-10 backdrop-blur-md">
            <TableRow className="border-slate-800 hover:bg-transparent">
              {result.columns.map((col) => (
                <TableHead key={col} className="font-mono text-[10px] font-bold uppercase tracking-tight text-slate-500 h-9 whitespace-nowrap">
                  {col}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {result.rows.map((row, idx) => (
              <TableRow key={idx} className="border-slate-800/40 hover:bg-slate-800/30 transition-colors group">
                {result.columns.map((col) => (
                  <TableCell key={col} className="font-mono text-xs py-2 whitespace-nowrap text-slate-300 group-hover:text-white transition-colors">
                    {row[col] === null ? (
                      <span className="text-slate-600 italic">NULL</span>
                    ) : (
                      String(row[col])
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}
