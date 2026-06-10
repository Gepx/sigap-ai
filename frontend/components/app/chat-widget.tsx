"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Loader2, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/lib/api";

interface ChatWidgetProps {
  warningContext?: any;
  analysis?: any;
}

interface ChatMessage {
  role: "user" | "model";
  content: string;
}

export default function ChatWidget({ warningContext, analysis }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (analysis?.chat_history) {
      return analysis.chat_history.map((m: any) => ({
        role: m.role,
        content: m.parts?.[0]?.text || "",
      }));
    }
    return [];
  });
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (analysis?.chat_history) {
      setMessages(
        analysis.chat_history.map((m: any) => ({
          role: m.role,
          content: m.parts?.[0]?.text || "",
        }))
      );
    } else {
      setMessages([]);
    }
  }, [analysis?.chat_history]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    
    // Convert current messages to Gemini history format
    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.content }]
    }));

    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await api.post("/api/ai/chat", {
        message: userMessage,
        history,
        warningContext,
        analysisId: analysis?.uuid,
      });

      if (response.data?.success) {
        setMessages(prev => [...prev, { role: "model", content: response.data.data }]);
      } else {
        setMessages(prev => [...prev, { role: "model", content: "Sorry, I encountered an error. Please try again." }]);
      }
    } catch (e) {
      setMessages(prev => [...prev, { role: "model", content: "Connection error. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 size-14 rounded-full bg-[#00B074] shadow-xl shadow-[#00B074]/30 transition-transform duration-300 hover:scale-110 hover:bg-[#079968] ${isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"}`}
      >
        <MessageSquare className="size-6 text-white" />
      </Button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-6 right-6 z-50 flex h-[32rem] w-80 flex-col overflow-hidden rounded-3xl border border-[#1A2E26]/10 bg-white shadow-2xl transition-all duration-300 sm:w-96 ${
          isOpen ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-10 opacity-0"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-[#00B074] px-5 py-4 text-white">
          <div className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-full bg-white/20">
              <Bot className="size-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Sigap Analyst</h3>
              <p className="text-xs text-white/80">Ask about your data</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-full p-1.5 transition-colors hover:bg-white/20"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto bg-[#F4F9F6] p-5">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center text-[#1A2E26]">
              <div className="flex size-12 items-center justify-center rounded-full bg-[#00B074]/10 text-[#00B074] mb-4">
                <Bot className="size-6" />
              </div>
              <p className="text-sm font-bold">
                Hi! I'm your Sigap Analyst.
              </p>
              <p className="text-sm font-medium text-[#1A2E26]/60 mb-6 mt-1">
                Ask me anything about this specific data.
              </p>
              
              <div className="flex w-full flex-col gap-2">
                {[
                  "Summarize the main complaints.",
                  "What's causing the negative sentiment?",
                  "Give me a breakdown of the positive feedback.",
                ].map((q, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(q)}
                    className="rounded-xl border border-[#1A2E26]/10 bg-white p-3 text-left text-sm font-medium text-[#1A2E26]/80 shadow-sm transition hover:border-[#00B074]/30 hover:bg-[#E8FFF4] hover:text-[#007A51]"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex max-w-[85%] items-end gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                    <div className={`flex size-6 shrink-0 items-center justify-center rounded-full ${msg.role === "user" ? "bg-[#1A2E26] text-white" : "bg-[#00B074] text-white"}`}>
                      {msg.role === "user" ? <User className="size-3.5" /> : <Bot className="size-3.5" />}
                    </div>
                    <div
                      className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                        msg.role === "user"
                          ? "rounded-br-sm bg-[#1A2E26] text-white"
                          : "rounded-bl-sm bg-white text-[#1A2E26] border border-[#1A2E26]/5"
                      }`}
                    >
                      <span className="whitespace-pre-wrap">{msg.content}</span>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex w-full justify-start">
                  <div className="flex max-w-[85%] items-end gap-2">
                    <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#00B074] text-white">
                      <Bot className="size-3.5" />
                    </div>
                    <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm border border-[#1A2E26]/5 bg-white px-4 py-3.5 shadow-sm">
                      <div className="size-1.5 animate-bounce rounded-full bg-[#00B074]"></div>
                      <div className="size-1.5 animate-bounce rounded-full bg-[#00B074] [animation-delay:0.2s]"></div>
                      <div className="size-1.5 animate-bounce rounded-full bg-[#00B074] [animation-delay:0.4s]"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="bg-white p-4 border-t border-[#1A2E26]/5">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              className="flex-1 rounded-full border-[#1A2E26]/10 bg-[#F4F9F6] px-4 py-5 text-sm focus-visible:ring-[#00B074]"
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              size="icon"
              className="size-10 shrink-0 rounded-full bg-[#00B074] text-white hover:bg-[#079968]"
            >
              <Send className="size-4" />
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
