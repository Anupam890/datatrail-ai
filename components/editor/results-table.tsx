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
import type { QueryResult } from "@/types";

export function ResultsTable({ result }: { result: QueryResult }) {
  if (result.error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
        <p className="text-sm font-medium text-destructive">Error</p>
        <p className="text-sm text-destructive/80 mt-1 font-mono">{result.error}</p>
      </div>
    );
  }

  if (result.rows.length === 0) {
    return (
      <div className="rounded-lg border bg-muted/50 p-8 text-center">
        <p className="text-sm text-muted-foreground">No results returned</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{result.rows.length} row{result.rows.length !== 1 ? "s" : ""} returned</span>
        <span>{result.executionTimeMs}ms</span>
      </div>
      <ScrollArea className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              {result.columns.map((col) => (
                <TableHead key={col} className="font-mono text-xs whitespace-nowrap">
                  {col}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {result.rows.map((row, idx) => (
              <TableRow key={idx}>
                {result.columns.map((col) => (
                  <TableCell key={col} className="font-mono text-xs whitespace-nowrap">
                    {row[col] === null ? (
                      <span className="text-muted-foreground italic">NULL</span>
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
