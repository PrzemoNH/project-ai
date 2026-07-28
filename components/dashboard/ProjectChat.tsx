"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

type ChatMessage = {
  role: "user" | "ai";
  text: string;
};

export default function ProjectChat({ projectId }: { projectId: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadHistory() {
      const { data, error } = await supabase
        .from("projects")
        .select("content")
        .eq("id", projectId)
        .single();

      if (!error && data?.content?.messages) {
        setMessages(data.content.messages);
      }

      setLoaded(true);
    }

    loadHistory();
  }, [projectId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function saveMessages(updated: ChatMessage[]) {
    await supabase
      .from("projects")
      .update({ content: { messages: updated }, updated_at: new Date().toISOString() })
      .eq("id", projectId);
  }

  async function handleSend() {
    const text = input.trim();
    if (!text || sending) return;

    const withUserMessage = [...messages, { role: "user" as const, text }];
    setMessages(withUserMessage);
    setInput("");
    setSending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      const data = await res.json();
      const replyText = res.ok ? data.reply : "❌ " + (data.error ?? "Błąd AI");

      const withReply = [...withUserMessage, { role: "ai" as const, text: replyText }];
      setMessages(withReply);
      await saveMessages(withReply);
    } catch {
      setMessages([
        ...withUserMessage,
        { role: "ai" as const, text: "❌ Nie udało się połączyć z AI." },
      ]);
    }

    setSending(false);
  }

  if (!loaded) {
    return <p style={{ color: "#6B7280", marginTop: "20px" }}>Ładowanie rozmowy...</p>;
  }

  return (
    <div
      style={{
        marginTop: "24px",
        border: "1px solid #374151",
        borderRadius: "16px",
        padding: "16px",
        background: "rgba(255,255,255,0.02)",
      }}
    >
      <h3 style={{ marginBottom: "12px" }}>Asystent AI</h3>

      <div
        style={{
          maxHeight: "350px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          marginBottom: "14px",
        }}
      >
        {messages.length === 0 && (
          <p style={{ color: "#6B7280", fontSize: "14px" }}>
            Napisz coś, żeby zacząć rozmowę z AI o tym projekcie.
          </p>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
              maxWidth: "80%",
              padding: "10px 14px",
              borderRadius: "12px",
              background: msg.role === "user" ? "#2563EB" : "#1F2937",
              color: "#F9FAFB",
              whiteSpace: "pre-wrap",
              fontSize: "14px",
            }}
          >
            {msg.text}
          </div>
        ))}

        <div ref={bottomRef} />
      </div>

      <div style={{ display: "flex", gap: "8px" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Napisz wiadomość..."
          style={{ flex: 1, padding: "10px" }}
          disabled={sending}
        />
        <button
          onClick={handleSend}
          disabled={sending}
          className="card-button"
          style={{ background: "#2563EB" }}
        >
          {sending ? "..." : "Wyślij"}
        </button>
      </div>
    </div>
  );
}
