"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

type ChatMessage = {
  role: "user" | "ai";
  text: string;
};

function extractHtml(text: string): string | null {
  const match = text.match(/<!DOCTYPE html[\s\S]*<\/html>/i);
  return match ? match[0] : null;
}

export default function ProjectChat({ projectId }: { projectId: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [siteHtml, setSiteHtml] = useState<string | null>(null);
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

      if (!error && data?.content) {
        setMessages(data.content.messages ?? []);
        setSiteHtml(data.content.site_html ?? null);
      }

      setLoaded(true);
    }

    loadHistory();
  }, [projectId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function saveState(updatedMessages: ChatMessage[], updatedHtml: string | null) {
    await supabase
      .from("projects")
      .update({
        content: { messages: updatedMessages, site_html: updatedHtml },
        updated_at: new Date().toISOString(),
      })
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
        body: JSON.stringify({
          message: text,
          currentHtml: siteHtml,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        const withError = [
          ...withUserMessage,
          { role: "ai" as const, text: "❌ " + (data.error ?? "Błąd AI") },
        ];
        setMessages(withError);
        await saveState(withError, siteHtml);
        setSending(false);
        return;
      }

      const html = extractHtml(data.reply);

      if (html) {
        const confirmMsg = "✅ Strona zaktualizowana — sprawdź podgląd poniżej.";
        const withReply = [...withUserMessage, { role: "ai" as const, text: confirmMsg }];
        setMessages(withReply);
        setSiteHtml(html);
        await saveState(withReply, html);
      } else {
        const withReply = [...withUserMessage, { role: "ai" as const, text: data.reply }];
        setMessages(withReply);
        await saveState(withReply, siteHtml);
      }
    } catch {
      const withError = [
        ...withUserMessage,
        { role: "ai" as const, text: "❌ Nie udało się połączyć z AI." },
      ];
      setMessages(withError);
    }

    setSending(false);
  }

  if (!loaded) {
    return <p style={{ color: "#6B7280", marginTop: "20px" }}>Ładowanie...</p>;
  }

  return (
    <div style={{ marginTop: "24px" }}>
      {siteHtml && (
        <div style={{ marginBottom: "20px" }}>
          <h3 style={{ marginBottom: "10px" }}>Podgląd strony</h3>
          <iframe
            srcDoc={siteHtml}
            style={{
              width: "100%",
              height: "500px",
              border: "1px solid #374151",
              borderRadius: "12px",
              background: "white",
            }}
            sandbox=""
          />
        </div>
      )}

      <div
        style={{
          border: "1px solid #374151",
          borderRadius: "16px",
          padding: "16px",
          background: "rgba(255,255,255,0.02)",
        }}
      >
        <h3 style={{ marginBottom: "12px" }}>Asystent AI</h3>

        <div
          style={{
            maxHeight: "300px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            marginBottom: "14px",
          }}
        >
          {messages.length === 0 && (
            <p style={{ color: "#6B7280", fontSize: "14px" }}>
              Opisz, jaką stronę chcesz zbudować — np. &quot;strona dla kawiarni z menu i
              galerią zdjęć&quot;.
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
            placeholder="Opisz stronę lub poproś o zmianę..."
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
    </div>
  );
}
