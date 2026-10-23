"use client";

import { useChat } from "@ai-sdk/react";
import { useState, useRef, useEffect } from "react";
import {
  Bot,
  User,
  Send,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  X,
  Radio,
  Search,
} from "lucide-react";

const SUGGESTED = [
  "Is Bumburet valley safe today? 🏔️",
  "Recent GLOF news in Chitral? 🌊",
  "What is the current risk level in Mastuj?",
  "Explain circularity after glacial floods",
];

export default function Chatbot() {
  const { messages, sendMessage, status, error } = useChat();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [lastReadMessageCount, setLastReadMessageCount] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const unread = isOpen
    ? 0
    : Math.max(
        0,
        messages.filter(
          (m, idx) => idx >= lastReadMessageCount && m.role === "assistant"
        ).length
      );

  const handleOpen = () => {
    setIsOpen(true);
    setLastReadMessageCount(messages.length);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleClose = () => {
    setIsOpen(false);
    setLastReadMessageCount(messages.length);
  };

  const handleToggle = () => {
    if (isOpen) {
      handleClose();
    } else {
      handleOpen();
    }
  };

  const isThinking =
    status === "submitted" ||
    (status === "streaming" &&
      messages.length > 0 &&
      messages.at(-1)?.role === "user");
  const isLoading = status === "submitted" || status === "streaming";

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    void sendMessage({ text: input.trim() });
    setInput("");
  };

  const handleSuggestion = (text: string) => {
    void sendMessage({ text });
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {/* Chat Window */}
      {isOpen && (
        <div
          className="w-[370px] md:w-[420px] bg-white rounded-3xl shadow-2xl border border-gray-200/90 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300"
          style={{ height: "570px" }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#07242C] via-[#0F4C5C] to-[#0A303B] px-5 py-4 flex items-center justify-between text-white border-b border-teal-500/20 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300 shadow-inner">
                  <Bot size={20} className="text-amber-300" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#0F4C5C]" />
              </div>
              <div>
                <p className="font-extrabold text-sm leading-tight text-white flex items-center gap-1.5">
                  <span>Ask AI — Sentinel Chitral</span>
                  <Sparkles size={13} className="text-amber-400" />
                </p>
                <p className="text-[10px] text-teal-200/80 leading-tight mt-0.5 font-medium">
                  Glacier Science &amp; GLOF Telemetry
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/15 transition text-gray-300 hover:text-white"
            >
              <X size={17} />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto px-4 py-3.5 space-y-3.5 bg-slate-50/70">
            {messages.length === 0 && (
              <div className="space-y-3.5 mt-2">
                <div className="bg-white border border-gray-200/90 rounded-2xl p-4 text-center space-y-1 shadow-xs">
                  <p className="text-xs font-bold text-[#0F4C5C]">
                    Hindu Kush Glacier Safety Assistant
                  </p>
                  <p className="text-[11px] text-gray-500 leading-relaxed">
                    Trained on Copernicus satellite passes, 2015 historical flood benchmarks, and PDMA valley telemetry.
                  </p>
                </div>

                <p className="text-[10px] text-center text-gray-400 font-bold uppercase tracking-wider">
                  Quick Inquiries
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {SUGGESTED.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSuggestion(s)}
                      className="text-left text-xs bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 hover:border-teal-500 hover:bg-teal-50/60 transition-all text-gray-700 font-semibold shadow-2xs"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m) => {
              const textParts = m.parts?.filter((p) => p.type === "text" && p.text);
              const hasText = Boolean(textParts && textParts.length > 0);
              const hasTool = m.parts?.some((p) => p.type.startsWith("tool"));

              if (m.role === "assistant" && !hasText && hasTool) {
                return (
                  <div key={m.id} className="flex justify-start items-center gap-2 py-1">
                    <div className="w-7 h-7 rounded-lg bg-teal-100/80 text-teal-800 flex items-center justify-center shrink-0">
                      <Search size={14} className="animate-spin" />
                    </div>
                    <span className="text-xs bg-teal-50 border border-teal-200 text-teal-800 rounded-full px-3 py-1 font-semibold animate-pulse">
                      Searching Sentinel Chitral field intelligence…
                    </span>
                  </div>
                );
              }

              if (m.role === "assistant" && !hasText) {
                return null;
              }

              return (
                <div key={m.id} className={`flex items-start gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  {m.role === "assistant" && (
                    <div className="w-7 h-7 rounded-lg bg-teal-700 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                      <Bot size={15} />
                    </div>
                  )}

                  <div
                    className={`max-w-[82%] px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                      m.role === "user"
                        ? "bg-[#0F4C5C] text-white rounded-br-none shadow-xs font-medium"
                        : "bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-xs"
                    }`}
                  >
                    {m.parts?.map((part, i) =>
                      part.type === "text" ? <span key={i}>{part.text}</span> : null
                    )}
                  </div>

                  {m.role === "user" && (
                    <div className="w-7 h-7 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                      <User size={15} />
                    </div>
                  )}
                </div>
              );
            })}

            {isThinking && (
              <div className="flex justify-start items-end gap-2">
                <div className="w-7 h-7 rounded-lg bg-teal-700 text-white flex items-center justify-center shrink-0">
                  <Bot size={15} />
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-none px-4 py-3 shadow-xs flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-teal-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-teal-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-teal-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl p-3 text-center">
                Unable to get a response right now. Please try again in a moment.
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input Bar */}
          <form onSubmit={handleSubmit} className="px-3.5 py-3 border-t border-gray-100 bg-white flex gap-2 items-center">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about glacier safety, valleys, or floods…"
              className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50/70"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-[#0F4C5C] text-white w-9 h-9 flex items-center justify-center rounded-full hover:bg-teal-800 disabled:opacity-40 transition-transform active:scale-95 shrink-0 shadow-xs"
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}

      {/* Modern Floating Action Button (FAB) */}
      <button
        onClick={handleToggle}
        className="group relative bg-gradient-to-r from-[#0F4C5C] via-teal-700 to-[#0A303B] text-white rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-2.5 pl-4 pr-5 py-3 font-bold text-xs border border-teal-400/30"
      >
        <span className="relative flex items-center justify-center">
          {isOpen ? (
            <X size={18} />
          ) : (
            <>
              <Bot size={18} className="text-amber-300" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </>
          )}
        </span>
        {!isOpen && <span>Ask AI Advisor</span>}
        {unread > 0 && !isOpen && (
          <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-600 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white shadow">
            {unread}
          </span>
        )}
      </button>
    </div>
  );
}
