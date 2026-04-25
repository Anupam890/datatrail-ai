"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { RealtimeChannel } from "@supabase/supabase-js";

export interface RealtimeSubmission {
  id: string;
  user_id: string;
  problem_id: string;
  query: string;
  status: string;
  execution_time: number;
  error_message: string | null;
  created_at: string;
}

interface UseRealtimeOptions {
  problemId: string | undefined;
  problemSlug: string;
  userId: string | undefined;
  userName: string | undefined;
  onProblemChange?: () => void;
}

export function useSupabaseRealtime({
  problemId,
  problemSlug,
  userId,
  userName,
  onProblemChange,
}: UseRealtimeOptions) {
  const [onlineCount, setOnlineCount] = useState(0);
  const [realtimeSubmissions, setRealtimeSubmissions] = useState<RealtimeSubmission[]>([]);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const submissionsChannelRef = useRef<RealtimeChannel | null>(null);

  // Presence: track online users on this problem
  useEffect(() => {
    if (!problemSlug) return;

    const channel = supabase.channel(`presence:problem:${problemSlug}`, {
      config: { presence: { key: userId || "anon-" + Math.random().toString(36).slice(2) } },
    });

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        const count = Object.keys(state).length;
        setOnlineCount(count);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({
            user_id: userId || null,
            user_name: userName || "Anonymous",
            online_at: new Date().toISOString(),
          });
        }
      });

    channelRef.current = channel;

    return () => {
      channel.untrack();
      supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, [problemSlug, userId, userName]);

  // Realtime: listen for problem metadata changes
  useEffect(() => {
    if (!problemId) return;

    const channel = supabase
      .channel(`problem-changes:${problemId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "problems",
          filter: `id=eq.${problemId}`,
        },
        () => {
          onProblemChange?.();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [problemId, onProblemChange]);

  // Realtime: listen for new submissions on this problem
  useEffect(() => {
    if (!problemId) return;

    const channel = supabase
      .channel(`submissions:${problemId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "submissions",
          filter: `problem_id=eq.${problemId}`,
        },
        (payload) => {
          const newSubmission = payload.new as RealtimeSubmission;
          setRealtimeSubmissions((prev) => [newSubmission, ...prev]);
        }
      )
      .subscribe();

    submissionsChannelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
      submissionsChannelRef.current = null;
    };
  }, [problemId]);

  // Seed initial submissions
  const setInitialSubmissions = useCallback((submissions: RealtimeSubmission[]) => {
    setRealtimeSubmissions(submissions);
  }, []);

  return {
    onlineCount,
    realtimeSubmissions,
    setInitialSubmissions,
  };
}
