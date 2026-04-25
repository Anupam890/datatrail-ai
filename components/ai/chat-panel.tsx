"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useAIChatStore } from "@/store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import {
  X,
  Send,
  Sparkles,
  Loader2,
  Code2,
  Bug,
  Zap,
  Trash2,
} from "lucide-react";
import type { ChatMessage } from "@/types";

const quickActions = [
  { label: "Explain", icon: Code2, action: "explain", prompt: "Explain this SQL query:" },
  { label: "Debug", icon: Bug, action: "debug", prompt: "Debug this SQL query:" },
  { label: "Optimize", icon: Zap, action: "optimize", prompt: "Optimize this SQL query:" },
];

export function AIChatPanel() {
  const { messages, isOpen, isLoading, addMessage, setLoading, clearMessages, setOpen } = useAIChatStore();
  const [input, setInput] = useState("");
  const [streamingContent, setStreamingContent] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamingContent]);

  const sendMessage = useCallback(async (content: string, action: string = "chat") => {
    if (!content.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: content.trim(),
      timestamp: Date.now(),
    };
    addMessage(userMsg);
    setInput("");
    setLoading(true);
    setStreamingContent("");

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          message: content.trim(),
          query: content.trim(),
          context: messages
            .slice(-6)
            .map((m) => `${m.role}: ${m.content}`)
            .join("\n"),
        }),
      });

      if (!res.ok) {
        throw new Error("Request failed");
      }

      // Stream the response
      if (res.body) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let accumulated = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          accumulated += decoder.decode(value, { stream: true });
          setStreamingContent(accumulated);
        }

        // Finalize: add as a complete message
        const assistantMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: accumulated || "No response",
          timestamp: Date.now(),
        };
        addMessage(assistantMsg);
        setStreamingContent("");
      } else {
        // Fallback for non-streaming response
        const data = await res.json();
        addMessage({
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.result || data.error || "No response",
          timestamp: Date.now(),
        });
      }
    } catch {
      addMessage({
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Failed to connect to AI. Check your API key configuration.",
        timestamp: Date.now(),
      });
      setStreamingContent("");
    } finally {
      setLoading(false);
    }
  }, [messages, addMessage, setLoading]);

  if (!isOpen) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  return (
    <Card className="fixed right-4 bottom-4 z-50 w-[400px] h-[600px] flex flex-col shadow-2xl border">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="font-semibold text-sm">AI Assistant</span>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={clearMessages}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setOpen(false)}>
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-1.5 p-2 border-b">
        {quickActions.map((qa) => (
          <Button
            key={qa.action}
            variant="outline"
            size="sm"
            className="text-xs h-7 gap-1"
            onClick={() => sendMessage(qa.prompt, qa.action)}
          >
            <qa.icon className="h-3 w-3" />
            {qa.label}
          </Button>
        ))}
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-3" ref={scrollRef}>
        <div className="space-y-3">
          {messages.length === 0 && !streamingContent && (
            <div className="text-center py-8">
              <Sparkles className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">Ask me anything about SQL!</p>
              <p className="text-xs text-muted-foreground mt-1">I can explain, debug, and optimize queries.</p>
            </div>
          )}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                {msg.role === "assistant" ? (
                  <div className="prose prose-sm prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 [&_pre]:bg-black/30 [&_pre]:rounded [&_pre]:p-2 [&_pre]:text-xs [&_code]:text-xs [&_code]:bg-black/20 [&_code]:px-1 [&_code]:rounded [&_p]:text-sm [&_p]:leading-relaxed [&_li]:text-sm [&_h2]:text-sm [&_h2]:font-bold [&_h2]:mt-3 [&_h2]:mb-1">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">{msg.content}</pre>
                )}
              </div>
            </div>
          ))}
          {/* Streaming message */}
          {streamingContent && (
            <div className="flex justify-start">
              <div className="max-w-[85%] rounded-lg px-3 py-2 text-sm bg-muted">
                <div className="prose prose-sm prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 [&_pre]:bg-black/30 [&_pre]:rounded [&_pre]:p-2 [&_pre]:text-xs [&_code]:text-xs [&_code]:bg-black/20 [&_code]:px-1 [&_code]:rounded [&_p]:text-sm [&_p]:leading-relaxed [&_li]:text-sm [&_h2]:text-sm [&_h2]:font-bold [&_h2]:mt-3 [&_h2]:mb-1">
                  <ReactMarkdown>{streamingContent}</ReactMarkdown>
                </div>
              </div>
            </div>
          )}
          {isLoading && !streamingContent && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg px-3 py-2">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-3 border-t">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about SQL..."
            className="min-h-[40px] max-h-[100px] resize-none text-sm"
            rows={1}
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </Card>
  );
}
