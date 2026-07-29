"use client";

import { useEffect, useRef, useState } from "react";
import JSZip from "jszip";
import { supabase } from "@/lib/supabase";

type ChatMessage = {
  role: "user" | "ai";
  text: string;
};

type ProjectFile = {
  name: string;
  content: string;
};

function extractFiles(text: string): ProjectFile[] {
  const regex = /---FILE:(.+?)---\s*([\s\S]*?)(?=---FILE:|$)/g;
  const files: ProjectFile[] = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    files.push({ name: match[1].trim(), content: match[2].trim() });
  }
  return files;
}

function buildPreviewHtml(files: ProjectFile[]): string {
  const html = files.find((f) => f.name === "index.html")?.content ?? "";
  const css = files.find((f) => f.name === "style.css")?.content ?? "";
  const js = files.find((f) => f.name === "script.js")?.content ?? "";

  return html
    .replace(
      /<link[^>]*href=["']style\.css["'][^>]*>/i,
      `<style>${css}</style>`
    )
    .replace(
      /<script[^>]*src=["']script\.js["'][^>]*><\/script>/i,
      `<script>${js}</script>`
    );
}

const WHAT_OPTIONS = [
  { value: "stronę internetową", label: "Strona" },
  { value: "aplikację webową", label: "Aplikacja" },
  { value: "prostą grę", label: "Gra" },
  { value: "landing page", label: "Landing page" },
];

const TECH_OPTIONS = ["HTML", "CSS", "JavaScript", "Animacje", "Formularz kontaktowy"];

export default function ProjectChat({ projectId, mode }: { projectId: string; mode: string | null }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [view, setView] = useState<"preview" | "code">("preview");
  const [activeFile, setActiveFile] = useState("index.html");
  const [copied, setCopied] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const wakeLockRef = useRef<any>(null);
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
        setFiles(data.content.files ?? []);
      }

      setLoaded(true);
    }

    loadHistory();
  }, [projectId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  async function saveState(updatedMessages: ChatMessage[], updatedFiles: ProjectFile[]) {
    await supabase
      .from("projects")
      .update({
        content: { messages: updatedMessages, files: updatedFiles },
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
    if (tech.length > 0) prompt += ` Wykorzystaj: ${tech.join(", ")}.`;
    if (colors.trim()) prompt += ` Kolorystyka: ${colors.trim()}.`;
    if (extra.trim()) prompt += ` Dodatkowo: ${extra.trim()}.`;

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
      if ("wakeLock" in navigator) {
        wakeLockRef.current = await (navigator as any).wakeLock.request("screen");
      }
    } catch {
      // brak wsparcia w przeglądarce — nic się nie dzieje, po prostu ekran może zgasnąć
    }


    const currentFilesText =
      files.length > 0
        ? files.map((f) => `---FILE:${f.name}---\n${f.content}`).join("\n\n")
        : null;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, currentFiles: currentFilesText, mode }),
      });

      const data = await res.json();

      if (!res.ok) {
        const withError = [
          ...withUserMessage,
          { role: "ai" as const, text: "❌ " + (data.error ?? "Błąd AI") },
        ];
        setMessages(withError);
        await saveState(withError, files);
        setSending(false);
        return;
      }

      const newFiles = extractFiles(data.reply);

      if (newFiles.length > 0) {
        const confirmMsg = `✅ Wygenerowano pliki: ${newFiles.map((f) => f.name).join(", ")}`;
        const withReply = [...withUserMessage, { role: "ai" as const, text: confirmMsg }];
        setMessages(withReply);
        setFiles(newFiles);
        setActiveFile(newFiles[0].name);
        setView("preview");
        await saveState(withReply, newFiles);
      } else {
        const withReply = [...withUserMessage, { role: "ai" as const, text: data.reply }];
        setMessages(withReply);
        await saveState(withReply, files);
      }
    } catch {
      const withError = [
        ...withUserMessage,
        { role: "ai" as const, text: "❌ Nie udało się połączyć z AI." },
      ];
      setMessages(withError);
    }

    setSending(false);
    wakeLockRef.current?.release?.();
    wakeLockRef.current = null;
  }

  function handleCopy() {
    const current = files.find((f) => f.name === activeFile);
    if (!current) return;
    navigator.clipboard.writeText(current.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleDownloadZip() {
    if (files.length === 0) return;
    const zip = new JSZip();
    files.forEach((f) => zip.file(f.name, f.content));
    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "projekt.zip";
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

  const activeFileContent = files.find((f) => f.name === activeFile)?.content ?? "";

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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
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
          <div style={{ border: "1px solid #7C3AED", borderRadius: "12px", padding: "16px", marginBottom: "16px", background: "rgba(124,58,237,0.05)" }}>
            <p style={{ fontSize: "13px", color: "#D1D5DB", marginBottom: "8px" }}>Co chcesz zbudować?</p>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
              {WHAT_OPTIONS.map((opt) => (
                <button key={opt.value} onClick={() => setWhat(opt.value)} style={chipStyle(what === opt.value)}>
                  {opt.label}
                </button>
              ))}
            </div>

            <p style={{ fontSize: "13px", color: "#D1D5DB", marginBottom: "8px" }}>Temat / branża (opcjonalnie)</p>
            <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="np. kawiarnia, siłownia..." style={{ width: "100%", padding: "8px", marginBottom: "16px" }} />

            <p style={{ fontSize: "13px", color: "#D1D5DB", marginBottom: "8px" }}>Technologie / elementy</p>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
              {TECH_OPTIONS.map((t) => (
                <button key={t} onClick={() => toggleTech(t)} style={chipStyle(tech.includes(t))}>
                  {t}
                </button>
              ))}
            </div>

            <p style={{ fontSize: "13px", color: "#D1D5DB", marginBottom: "8px" }}>Kolory / styl (opcjonalnie)</p>
            <input type="text" value={colors} onChange={(e) => setColors(e.target.value)} placeholder="np. ciemne tło z akcentami pomarańczu" style={{ width: "100%", padding: "8px", marginBottom: "16px" }} />

            <p style={{ fontSize: "13px", color: "#D1D5DB", marginBottom: "8px" }}>Dodatkowe wymagania (opcjonalnie)</p>
            <input type="text" value={extra} onChange={(e) => setExtra(e.target.value)} placeholder="np. sekcja z opiniami" style={{ width: "100%", padding: "8px", marginBottom: "16px" }} />

            <button onClick={buildPromptFromForm} className="card-button" style={{ background: "#7C3AED", width: "100%" }}>
              ✨ Zbuduj prompt
            </button>
          </div>
        )}

        <div style={{ maxHeight: "300px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px", marginBottom: "14px" }}>
          {messages.length === 0 && (
            <p style={{ color: "#6B7280", fontSize: "14px" }}>
              Użyj &quot;Kreatora promptu&quot; powyżej albo opisz stronę własnymi słowami.
            </p>
          )}

          {messages.map((msg, i) => (
            <div key={i} style={{ alignSelf: msg.role === "user" ? "flex-end" : "flex-start", maxWidth: "80%", padding: "10px 14px", borderRadius: "12px", background: msg.role === "user" ? "#2563EB" : "#1F2937", color: "#F9FAFB", whiteSpace: "pre-wrap", fontSize: "14px" }}>
              {msg.text}
            </div>
          ))}

          {sending && (
            <div style={{ alignSelf: "flex-start", maxWidth: "80%", padding: "10px 14px", borderRadius: "12px", background: "#1F2937", color: "#9CA3AF", fontSize: "14px", display: "flex", alignItems: "center", gap: "6px" }}>
              <span>AI pracuje</span>
              <span className="typing-dots">
                <span></span><span></span><span></span>
              </span>
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
          <button onClick={handleSend} disabled={sending} className="card-button" style={{ background: "#2563EB" }}>
            {sending ? "..." : "Wyślij"}
          </button>
        </div>
      </div>

      {files.length > 0 && (
        <div style={{ marginTop: "16px", padding: "14px", borderRadius: "16px", border: "1px solid #2563EB", background: "rgba(37,99,235,0.05)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px", flexWrap: "wrap", gap: "8px" }}>
            <span style={{ fontSize: "13px", color: "#93C5FD", fontWeight: 700 }}>🌐 Podgląd strony</span>

            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              <button onClick={() => setView("preview")} style={{ padding: "6px 14px", borderRadius: "8px", border: "1px solid #374151", background: view === "preview" ? "#2563EB" : "transparent", color: "#F9FAFB", fontSize: "13px", cursor: "pointer" }}>
                Podgląd
              </button>
              <button onClick={() => setView("code")} style={{ padding: "6px 14px", borderRadius: "8px", border: "1px solid #374151", background: view === "code" ? "#2563EB" : "transparent", color: "#F9FAFB", fontSize: "13px", cursor: "pointer" }}>
                Kod źródłowy
              </button>
              <button onClick={handleDownloadZip} style={{ padding: "6px 14px", borderRadius: "8px", border: "1px solid #374151", background: "transparent", color: "#D1D5DB", fontSize: "13px", cursor: "pointer" }}>
                ⬇ Pobierz ZIP
              </button>
            </div>
          </div>

          {view === "preview" ? (
            <iframe
              srcDoc={buildPreviewHtml(files)}
              style={{ width: "100%", height: "500px", border: "1px solid #374151", borderRadius: "12px", background: "white" }}
              sandbox="allow-scripts"
            />
          ) : (
            <div>
              <div style={{ display: "flex", gap: "6px", marginBottom: "10px", flexWrap: "wrap" }}>
                {files.map((f) => (
                  <button
                    key={f.name}
                    onClick={() => setActiveFile(f.name)}
                    style={{ padding: "5px 12px", borderRadius: "6px", border: "1px solid #374151", background: activeFile === f.name ? "#374151" : "transparent", color: "#F9FAFB", fontSize: "12px", cursor: "pointer" }}
                  >
                    {f.name}
                  </button>
                ))}
                <button
                  onClick={handleCopy}
                  style={{ marginLeft: "auto", padding: "5px 12px", borderRadius: "6px", border: "1px solid #10B981", background: "transparent", color: "#10B981", fontSize: "12px", cursor: "pointer" }}
                >
                  {copied ? "✓ Skopiowano" : "📋 Kopiuj kod"}
                </button>
              </div>
              <textarea
                readOnly
                value={activeFileContent}
                style={{ width: "100%", height: "460px", border: "1px solid #374151", borderRadius: "12px", background: "#0B0F19", color: "#93C5FD", fontFamily: "monospace", fontSize: "12px", padding: "14px", resize: "vertical" }}
              />
            </div>
          )}

          <p style={{ marginTop: "10px", fontSize: "13px", color: "#9CA3AF" }}>
            💡 Napisz w czacie powyżej, co poprawić lub dopisać.
          </p>
        </div>
      )}
    </div>
  );
}
