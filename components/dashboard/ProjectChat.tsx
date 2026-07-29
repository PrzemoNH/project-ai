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

const WHAT_OPTIONS = [
  { value: "stronę internetową", label: "Strona" },
  { value: "aplikację webową", label: "Aplikacja" },
  { value: "prostą grę", label: "Gra" },
  { value: "landing page", label: "Landing page" },
];

const TECH_OPTIONS = ["HTML", "CSS", "JavaScript", "Animacje", "Formularz kontaktowy"];

export default function ProjectChat({ projectId }: { projectId: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [siteHtml, setSiteHtml] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [view, setView] = useState<"preview" | "code">("preview");
  const bottomRef = useRef<HTMLDivElement>(null);

  const [builderOpen, setBuilderOpen] = useState(false);
  const [what, setWhat] = useState(WHAT_OPTIONS[0].value);
  const [topic, setTopic] = useState("");
  const [colors, setColors] = useState("");
  const [tech, setTech] = useState<string[]>(["HTML", "CSS"]);
  const [extra, setExtra] = useState("");

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
  }, [messages, sending]);

  async function saveState(updatedMessages: ChatMessage[], updatedHtml: string | null) {
    await supabase
      .from("projects")
      .update({
        content: { messages: updatedMessages, site_html: updatedHtml },
        updated_at: new Date().toISOString(),
      })
      .eq("id", projectId);
  }

  function toggleTech(name: string) {
    setTech((prev) =>
      prev.includes(name) ? prev.filter((t) => t !== name) : [...prev, name]
    );
  }

  function buildPromptFromForm() {
    let prompt = `Utwórz ${what}`;
    if (topic.trim()) prompt += ` na temat: ${topic.trim()}`;
    prompt += ".";

    if (tech.length > 0) {
      prompt += ` Wykorzystaj: ${tech.join(", ")}.`;
    }
    if (colors.trim()) {
      prompt += ` Kolorystyka: ${colors.trim()}.`;
    }
    if (extra.trim()) {
      prompt += ` Dodatkowo: ${extra.trim()}.`;
    }

    setInput(prompt);
    setBuilderOpen(false);
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
        setView("preview");
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

  function handleDownload() {
    if (!siteHtml) return;
    const blob = new Blob([siteHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "strona.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  if (!loaded) {
    return <p style={{ color: "#6B7280", marginTop: "20px" }}>Ładowanie...</p>;
  }

  const chipStyle = (active: boolean) => ({
    padding: "6px 12px",
    borderRadius: "999px",
    border: `1px solid ${active ? "#2563EB" : "#374151"}`,
    background: active ? "#2563EB" : "transparent",
    color: "#F9FAFB",
    fontSize: "13px",
    cursor: "pointer",
  });

  return (
    <div style={{ marginTop: "24px" }}>
      <div
        style={{
          border: "1px solid #374151",
          borderRadius: "16px",
          padding: "16px",
          background: "rgba(255,255,255,0.02)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "12px",
          }}
        >
          <h3>Asystent AI</h3>
          <button
            onClick={() => setBuilderOpen((v) => !v)}
            style={{
              padding: "6px 14px",
              borderRadius: "8px",
              border: "1px solid #7C3AED",
              background: builderOpen ? "#7C3AED" : "transparent",
              color: "#F9FAFB",
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            🧩 Kreator promptu
          </button>
        </div>

        {builderOpen && (
          <div
            style={{
              border: "1px solid #7C3AED",
              borderRadius: "12px",
              padding: "16px",
              marginBottom: "16px",
              background: "rgba(124,58,237,0.05)",
            }}
          >
            <p style={{ fontSize: "13px", color: "#D1D5DB", marginBottom: "8px" }}>
              Co chcesz zbudować?
            </p>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
              {WHAT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setWhat(opt.value)}
                  style={chipStyle(what === opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <p style={{ fontSize: "13px", color: "#D1D5DB", marginBottom: "8px" }}>
              Temat / branża (opcjonalnie)
            </p>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="np. kawiarnia, siłownia, portfolio fotografa..."
              style={{ width: "100%", padding: "8px", marginBottom: "16px" }}
            />

            <p style={{ fontSize: "13px", color: "#D1D5DB", marginBottom: "8px" }}>
              Technologie / elementy
            </p>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
              {TECH_OPTIONS.map((t) => (
                <button key={t} onClick={() => toggleTech(t)} style={chipStyle(tech.includes(t))}>
                  {t}
                </button>
              ))}
            </div>

            <p style={{ fontSize: "13px", color: "#D1D5DB", marginBottom: "8px" }}>
              Kolory / styl (opcjonalnie)
            </p>
            <input
              type="text"
              value={colors}
              onChange={(e) => setColors(e.target.value)}
              placeholder="np. ciemne tło z akcentami pomarańczu"
              style={{ width: "100%", padding: "8px", marginBottom: "16px" }}
            />

            <p style={{ fontSize: "13px", color: "#D1D5DB", marginBottom: "8px" }}>
              Dodatkowe wymagania (opcjonalnie)
            </p>
            <input
              type="text"
              value={extra}
              onChange={(e) => setExtra(e.target.value)}
              placeholder="np. sekcja z opiniami, formularz kontaktowy"
              style={{ width: "100%", padding: "8px", marginBottom: "16px" }}
            />

            <button
              onClick={buildPromptFromForm}
              className="card-button"
              style={{ background: "#7C3AED", width: "100%" }}
            >
              ✨ Zbuduj prompt
            </button>
          </div>
        )}

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
              Użyj &quot;Kreatora promptu&quot; powyżej albo opisz stronę własnymi słowami.
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

          {sending && (
            <div
              style={{
                alignSelf: "flex-start",
                maxWidth: "80%",
                padding: "10px 14px",
                borderRadius: "12px",
                background: "#1F2937",
                color: "#9CA3AF",
                fontSize: "14px",
                fontStyle: "italic",
              }}
            >
              AI tworzy odpowiedź...
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        <div style={{ display: "flex", gap: "8px", alignItems: "flex-end" }}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Opisz stronę lub poproś o zmianę... (Ctrl+Enter, żeby wysłać)"
            rows={3}
            style={{ flex: 1, padding: "10px", resize: "vertical", fontFamily: "inherit" }}
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

      {siteHtml && (
        <div
          style={{
            marginTop: "16px",
            padding: "14px",
            borderRadius: "16px",
            border: "1px solid #2563EB",
            background: "rgba(37,99,235,0.05)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "10px",
              flexWrap: "wrap",
              gap: "8px",
            }}
          >
            <span style={{ fontSize: "13px", color: "#93C5FD", fontWeight: 700 }}>
              🌐 Podgląd strony
            </span>

            <div style={{ display: "flex", gap: "6px" }}>
              <button
                onClick={() => setView("preview")}
                style={{
                  padding: "6px 14px",
                  borderRadius: "8px",
                  border: "1px solid #374151",
                  background: view === "preview" ? "#2563EB" : "transparent",
                  color: "#F9FAFB",
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                Podgląd
              </button>
              <button
                onClick={() => setView("code")}
                style={{
                  padding: "6px 14px",
                  borderRadius: "8px",
                  border: "1px solid #374151",
                  background: view === "code" ? "#2563EB" : "transparent",
                  color: "#F9FAFB",
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                Kod źródłowy
              </button>
              <button
                onClick={handleDownload}
                style={{
                  padding: "6px 14px",
                  borderRadius: "8px",
                  border: "1px solid #374151",
                  background: "transparent",
                  color: "#D1D5DB",
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                ⬇ Pobierz
              </button>
            </div>
          </div>

          {view === "preview" ? (
            <iframe
              srcDoc={siteHtml}
              style={{
                width: "100%",
                height: "500px",
                border: "1px solid #374151",
                borderRadius: "12px",
                background: "white",
              }}
              sandbox="allow-scripts"
            />
          ) : (
            <textarea
              readOnly
              value={siteHtml}
              style={{
                width: "100%",
                height: "500px",
                border: "1px solid #374151",
                borderRadius: "12px",
                background: "#0B0F19",
                color: "#93C5FD",
                fontFamily: "monospace",
                fontSize: "12px",
                padding: "14px",
                resize: "vertical",
              }}
            />
          )}

          <p style={{ marginTop: "10px", fontSize: "13px", color: "#9CA3AF" }}>
            💡 Napisz w czacie powyżej, co poprawić lub dopisać.
          </p>
        </div>
      )}
    </div>
  );
}
