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
import { AlertCircle, Database, Equal, ListFilter } from "lucide-react";
import type { QueryResult } from "@/types";
import { cn } from "@/lib/utils";

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

  const hasExpected = result.expected && result.expected.length > 0;
  
  // If we have expected data and it's NOT a sandbox query (where expected might be null)
  // We can show a side-by-side or a "Mismatch" indicator if they differ
  
  const renderTable = (rows: Record<string, any>[], columns: string[], title?: string, isExpected?: boolean) => (
    <div className="space-y-2">
      {title && (
        <div className="flex items-center gap-2 px-1">
          <ListFilter className={cn("h-3 w-3", isExpected ? "text-emerald-400" : "text-indigo-400")} />
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{title}</span>
        </div>
      )}
      <ScrollArea className={cn(
        "rounded-md border max-h-[300px]",
        isExpected ? "border-emerald-500/10 bg-emerald-500/[0.01]" : "border-slate-800 bg-slate-900/20"
      )}>
        <Table>
          <TableHeader className="bg-slate-900/60 sticky top-0 z-10 backdrop-blur-md">
            <TableRow className="border-slate-800 hover:bg-transparent">
              {columns.map((col) => (
                <TableHead key={col} className="font-mono text-[10px] font-bold uppercase tracking-tight text-slate-500 h-9 whitespace-nowrap">
                  {col}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-8 text-slate-600 text-[10px]">
                  No Rows Returned
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row, idx) => (
                <TableRow key={idx} className="border-slate-800/40 hover:bg-slate-800/30 transition-colors group">
                  {columns.map((col) => (
                    <TableCell key={col} className="font-mono text-xs py-2 whitespace-nowrap text-slate-300 group-hover:text-white transition-colors">
                      {row[col] === null ? (
                        <span className="text-slate-600 italic">NULL</span>
                      ) : (
                        String(row[col])
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );

  if (hasExpected) {
    const expectedColumns = result.expected && result.expected.length > 0 ? Object.keys(result.expected[0]) : [];
    
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-500">
        {renderTable(result.rows, result.columns, "Your Output")}
        {renderTable(result.expected!, expectedColumns, "Expected Output", true)}
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

  return renderTable(result.rows, result.columns);
}
