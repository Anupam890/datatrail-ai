"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import initSqlJs, { type Database as SqlDatabase, type SqlValue } from "sql.js";
import type { QueryResult } from "@/types";

export interface TableSchema {
  name: string;
  columns: string; // SQL column definitions, e.g. "id INTEGER PRIMARY KEY, name TEXT"
}

export interface TableData {
  name: string;
  rows: Record<string, unknown>[];
}

const SQL_JS_WASM_URL = "/";

/**
 * Reusable hook for in-browser SQL execution via sql.js (WASM SQLite).
 * Accepts table schemas and data, creates an in-memory DB, and exposes runQuery().
 */
export function useSqlSandbox(
  tables: TableSchema[],
  data: TableData[]
) {
  const dbRef = useRef<SqlDatabase | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      const SQL = await initSqlJs({
        locateFile: (file: string) => `${SQL_JS_WASM_URL}${file}`,
      });
      if (cancelled) return;

      const db = new SQL.Database();

      // Create tables
      for (const table of tables) {
        db.run(`CREATE TABLE IF NOT EXISTS "${table.name}" (${table.columns})`);
      }

      // Populate data
      for (const tableData of data) {
        if (tableData.rows.length === 0) continue;
        const cols = Object.keys(tableData.rows[0]);
        const placeholders = cols.map(() => "?").join(", ");
        const colNames = cols.map((c) => `"${c}"`).join(", ");
        const stmt = db.prepare(
          `INSERT INTO "${tableData.name}" (${colNames}) VALUES (${placeholders})`
        );
        for (const row of tableData.rows) {
          const values: SqlValue[] = cols.map((col) => {
            const v = row[col];
            if (v == null) return null;
            if (typeof v === "number" || typeof v === "string") return v;
            return String(v);
          });
          stmt.run(values);
        }
        stmt.free();
      }

      dbRef.current = db;
      if (!cancelled) setReady(true);
    }

    init();

    return () => {
      cancelled = true;
      dbRef.current?.close();
      dbRef.current = null;
      setReady(false);
    };
  }, [tables, data]);

  const runQuery = useCallback(
    (sql: string): QueryResult => {
      if (!dbRef.current) {
        return {
          columns: [],
          rows: [],
          executionTimeMs: 0,
          error: "Database not initialized. Please wait...",
        };
      }

      try {
        const startTime = performance.now();
        const stmtResults = dbRef.current.exec(sql.trim());
        const executionTimeMs = Math.round(performance.now() - startTime);

        if (stmtResults.length > 0) {
          const first = stmtResults[0];
          const columns = first.columns;
          const rows = first.values.map((vals) => {
            const obj: Record<string, unknown> = {};
            columns.forEach((col, i) => {
              obj[col] = vals[i];
            });
            return obj;
          });
          return { columns, rows, executionTimeMs };
        }

        return { columns: [], rows: [], executionTimeMs };
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Failed to execute query";
        return { columns: [], rows: [], executionTimeMs: 0, error: message };
      }
    },
    [ready]
  );

  return { ready, runQuery };
}

// ─── Default sandbox data (employees + departments) ───────────────────────

export const DEFAULT_SANDBOX_TABLES: TableSchema[] = [
  {
    name: "employees",
    columns:
      "id INTEGER PRIMARY KEY, name TEXT, role TEXT, department TEXT, salary INTEGER, hire_date TEXT",
  },
  {
    name: "departments",
    columns: "id INTEGER PRIMARY KEY, name TEXT, location TEXT",
  },
];

export const DEFAULT_SANDBOX_DATA: TableData[] = [
  {
    name: "employees",
    rows: [
      { id: 1, name: "Alice Johnson", role: "Engineer", department: "Engineering", salary: 120000, hire_date: "2020-01-15" },
      { id: 2, name: "Bob Smith", role: "Engineer", department: "Engineering", salary: 110000, hire_date: "2020-03-20" },
      { id: 3, name: "Carol White", role: "Marketer", department: "Marketing", salary: 90000, hire_date: "2019-06-10" },
      { id: 4, name: "David Brown", role: "Sales Rep", department: "Sales", salary: 85000, hire_date: "2021-02-14" },
      { id: 5, name: "Eve Davis", role: "Lead Engineer", department: "Engineering", salary: 130000, hire_date: "2018-09-01" },
      { id: 6, name: "Frank Miller", role: "Designer", department: "Design", salary: 95000, hire_date: "2020-11-30" },
      { id: 7, name: "Grace Lee", role: "Manager", department: "Marketing", salary: 105000, hire_date: "2017-04-22" },
      { id: 8, name: "Henry Wilson", role: "Sales Lead", department: "Sales", salary: 100000, hire_date: "2019-08-05" },
      { id: 9, name: "Ivy Chen", role: "Engineer", department: "Engineering", salary: 115000, hire_date: "2021-01-10" },
      { id: 10, name: "Jack Taylor", role: "Analyst", department: "Marketing", salary: 88000, hire_date: "2022-03-15" },
    ],
  },
  {
    name: "departments",
    rows: [
      { id: 1, name: "Engineering", location: "San Francisco" },
      { id: 2, name: "Marketing", location: "New York" },
      { id: 3, name: "Sales", location: "Chicago" },
      { id: 4, name: "Design", location: "Los Angeles" },
    ],
  },
];

// ─── Helper: Convert problem's schema_json/sample_data_json to sandbox format

export function problemToSandbox(
  schemaJson: Record<string, string>,
  sampleDataJson: Record<string, Record<string, unknown>[]>
): { tables: TableSchema[]; data: TableData[] } {
  const tables: TableSchema[] = Object.entries(schemaJson).map(
    ([name, columns]) => ({ name, columns })
  );
  const data: TableData[] = Object.entries(sampleDataJson).map(
    ([name, rows]) => ({ name, rows })
  );
  return { tables, data };
}
