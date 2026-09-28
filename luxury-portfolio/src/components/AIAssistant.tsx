"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePortfolio } from "@/context/PortfolioContext";
import { Bot, Send, Sparkles, Minimize2, RotateCcw, FileText } from "lucide-react";

export default function AIAssistant() {
  const { data } = usePortfolio();
  const [isOpen, setIsOpen] = useState(false);

  const defaultGreeting =
    data.aiCopy?.greeting ||
    `Greetings. I am ${data.hero.name}'s digital twin and portfolio system guide. Ask me anything regarding engineering projects, technical competencies, architecture, credentials, or verified background documentation.`;

  const [messages, setMessages] = useState<Array<{ sender: "user" | "ai"; text: string }>>([
    {
      sender: "ai",
      text: defaultGreeting,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Synchronize greeting when portfolio data is rehydrated
  useEffect(() => {
    if (messages.length === 1 && messages[0].sender === "ai") {
      setMessages([{ sender: "ai", text: defaultGreeting }]);
    }
  }, [defaultGreeting]);

  const handleResetChat = () => {
    setMessages([
      {
        sender: "ai",
        text: "Session context refreshed. How can I assist you with the verified portfolio data or background document?",
      },
    ]);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput("");

    // Map internal 'ai' sender to the standard 'model' identifier expected by the route
    const formattedHistory = messages.map((m) => ({
      sender: m.sender === "ai" ? "model" : "user",
      text: m.text,
    }));

    setMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setLoading(true);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          history: formattedHistory,
          context: data, // Passes live portfolio state AND data.resumePdfText
          aiInstructions: data.aiInstructions,
        }),
      });

      const json = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: json.reply || "No response received from system telemetry.",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "Connection interrupted. Please verify your network connection and server status.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Orb */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full glass-panel border border-[var(--color-primary)] text-[var(--color-text)] shadow-luxury-glow hover:scale-105 active:scale-95 transition-all group"
          aria-label="Open AI Assistant"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-[var(--color-primary)] group-hover:rotate-12 transition-transform" />
            <span className="animate-ping absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[var(--color-primary)] opacity-75" />
            <span className="relative -top-1 -right-1 w-2 h-2 rounded-full bg-[var(--color-primary)] inline-block" />
          </div>
          <span className="text-xs uppercase tracking-wider font-semibold font-serif hidden sm:inline">
            AI Assistant
          </span>
        </button>
      )}

      {/* Floating Chat Window (100% Mobile Responsive) */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] h-[540px] max-h-[85dvh] rounded-3xl glass-panel border border-[var(--color-border)] shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          
          {/* Header */}
          <div className="px-5 py-3.5 border-b border-[var(--color-border)] bg-[var(--color-surface)]/80 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3 truncate">
              <div className="p-2 rounded-xl bg-[var(--color-primary)] text-[var(--color-bg)] shadow-luxury-glow flex-shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="truncate">
                <h3 className="font-serif text-sm font-bold text-[var(--color-text)]">
                  {data.aiCopy?.title || "Digital Twin AI"}
                </h3>
                <span className="text-[10px] font-mono text-[var(--color-primary)] truncate flex items-center gap-1">
                  {data.resumePdfName ? (
                    <>
                      <FileText className="w-3 h-3 flex-shrink-0 text-emerald-400" />
                      <span className="truncate">Indexed: {data.resumePdfName}</span>
                    </>
                  ) : (
                    data.aiCopy?.subtitle || "Online • Grounded in system data"
                  )}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                onClick={handleResetChat}
                className="p-1.5 rounded-xl text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors"
                title="Reset session history"
                aria-label="Reset session history"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors"
                aria-label="Minimize AI Assistant"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs font-sans book-scroll">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.sender === "ai" && (
                  <div className="w-6 h-6 rounded-lg bg-[var(--color-primary)] text-[var(--color-bg)] flex items-center justify-center flex-shrink-0 text-[10px] font-bold mt-0.5">
                    AI
                  </div>
                )}
                <div
                  className={`max-w-[84%] px-3.5 py-2.5 rounded-2xl leading-relaxed whitespace-pre-line ${
                    m.sender === "user"
                      ? "bg-[var(--color-primary)] text-[var(--color-bg)] font-medium rounded-tr-sm shadow-sm"
                      : "glass-panel border border-[var(--color-border)] text-[var(--color-text)] rounded-tl-sm"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-[var(--color-muted)] text-xs font-mono pl-8">
                <span className="animate-spin text-[var(--color-primary)]">✦</span> Grounding response against portfolio state & PDF...
              </div>
            )}
            <div ref={scrollRef} />
          </div>

          {/* Chat Input */}
          <form
            onSubmit={handleSend}
            className="p-3 border-t border-[var(--color-border)] bg-[var(--color-surface)]/80 flex items-center gap-2 flex-shrink-0"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={data.aiCopy?.inputPlaceholder || "Ask about certificates, education, stack..."}
              className="flex-1 px-3.5 py-2 rounded-xl glass-panel border border-[var(--color-border)] text-xs text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)] bg-transparent"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2 rounded-xl bg-[var(--color-primary)] text-[var(--color-bg)] hover:brightness-110 disabled:opacity-40 transition-all flex-shrink-0"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}