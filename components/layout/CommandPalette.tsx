"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { Search, FileCode2, User, ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchProblem {
  id: string;
  title: string;
  slug: string;
  difficulty: string;
  tags: string[];
}

interface SearchUser {
  user_id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  xp: number;
}

interface SearchResults {
  problems: SearchProblem[];
  users: SearchUser[];
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults>({ problems: [], users: [] });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Toggle with Ctrl+K / Cmd+K or custom event from navbar button
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    const handleOpen = () => setOpen(true);
    document.addEventListener("keydown", down);
    document.addEventListener("open-command-palette", handleOpen);
    return () => {
      document.removeEventListener("keydown", down);
      document.removeEventListener("open-command-palette", handleOpen);
    };
  }, []);

  // Debounced search
  useEffect(() => {
    if (query.length < 2) {
      setResults({ problems: [], users: [] });
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          setResults(await res.json());
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const navigate = useCallback(
    (path: string) => {
      setOpen(false);
      setQuery("");
      router.push(path);
    },
    [router]
  );

  if (!open) return null;

  const hasResults = results.problems.length > 0 || results.users.length > 0;

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />

      {/* Command palette */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-full max-w-lg px-4">
        <Command
          className="bg-[#0f1420] border border-slate-700/50 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden"
          shouldFilter={false}
        >
          {/* Search input */}
          <div className="flex items-center gap-3 px-4 border-b border-slate-800/50">
            {loading ? (
              <Loader2 className="h-4 w-4 text-slate-500 animate-spin shrink-0" />
            ) : (
              <Search className="h-4 w-4 text-slate-500 shrink-0" />
            )}
            <Command.Input
              value={query}
              onValueChange={setQuery}
              placeholder="Search problems, users..."
              className="h-12 w-full bg-transparent text-sm text-white placeholder:text-slate-500 outline-none"
              autoFocus
            />
            <kbd className="hidden sm:inline-flex h-5 items-center rounded border border-slate-700 bg-slate-800 px-1.5 text-[10px] font-mono text-slate-500">
              ESC
            </kbd>
          </div>

          {/* Results */}
          <Command.List className="max-h-[300px] overflow-y-auto p-2">
            {query.length >= 2 && !loading && !hasResults && (
              <Command.Empty className="py-8 text-center text-sm text-slate-500">
                No results found.
              </Command.Empty>
            )}

            {query.length < 2 && (
              <div className="py-8 text-center text-sm text-slate-600">
                Type at least 2 characters to search...
              </div>
            )}

            {results.problems.length > 0 && (
              <Command.Group
                heading={
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600 px-2">
                    Problems
                  </span>
                }
              >
                {results.problems.map((problem) => (
                  <Command.Item
                    key={problem.id}
                    value={problem.title}
                    onSelect={() => navigate(`/arena/${problem.slug}`)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-sm text-slate-300 hover:bg-white/5 data-[selected=true]:bg-white/5 transition-colors"
                  >
                    <FileCode2 className="h-4 w-4 text-indigo-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <span className="font-medium truncate block">{problem.title}</span>
                    </div>
                    <span
                      className={cn(
                        "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md",
                        problem.difficulty === "easy" && "text-emerald-400 bg-emerald-500/10",
                        problem.difficulty === "medium" && "text-amber-400 bg-amber-500/10",
                        problem.difficulty === "hard" && "text-rose-400 bg-rose-500/10"
                      )}
                    >
                      {problem.difficulty}
                    </span>
                    <ArrowRight className="h-3 w-3 text-slate-600 shrink-0" />
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            {results.users.length > 0 && (
              <Command.Group
                heading={
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600 px-2">
                    Users
                  </span>
                }
              >
                {results.users.map((user) => (
                  <Command.Item
                    key={user.user_id}
                    value={user.username}
                    onSelect={() => navigate(`/u/${user.username}`)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-sm text-slate-300 hover:bg-white/5 data-[selected=true]:bg-white/5 transition-colors"
                  >
                    <div className="h-6 w-6 rounded-lg bg-slate-800 flex items-center justify-center text-[10px] font-bold overflow-hidden shrink-0">
                      {user.avatar_url ? (
                        <img src={user.avatar_url} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <User className="h-3 w-3 text-slate-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-medium truncate block">
                        {user.display_name || user.username}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-600 font-mono">
                      {user.xp.toLocaleString()} XP
                    </span>
                    <ArrowRight className="h-3 w-3 text-slate-600 shrink-0" />
                  </Command.Item>
                ))}
              </Command.Group>
            )}
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
