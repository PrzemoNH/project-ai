"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type ScheduledJob = {
  id: string;
  prompt: string;
  status: string;
  attempt: number;
  max_attempts: number;
  scheduled_for: string;
  error: string | null;
};

export default function ScheduledPanel({
  projectId,
  mode,
}: {
  projectId: string;
  mode: string | null;
}) {
  const [prompt, setPrompt] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [jobs, setJobs] = useState<ScheduledJob[]>([]);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);

  async function loadJobs() {
    const { data, error } = await supabase
      .from("scheduled_generations")
      .select("id, prompt, status, attempt, max_attempts, scheduled_for, error")
      .eq("project_id", projectId)
      .order("scheduled_for", { ascending: false });

    if (!error && data) {
      setJobs(data);
    }
  }

  useEffect(() => {
    loadJobs();
  }, [projectId]);

  async function handleSchedule() {
    if (!prompt.trim() || !dateTime) return;
    setSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setSaving(false);
      return;
    }

    const { error } = await supabase.from("scheduled_generations").insert({
      user_id: user.id,
      project_id: projectId,
      prompt: prompt.trim(),
      mode,
      scheduled_for: new Date(dateTime).toISOString(),
      status: "pending",
    });

    if (!error) {
      setPrompt("");
      setDateTime("");
      await loadJobs();
    }

    setSaving(false);
  }

  async function handleDelete(id: string) {
    await supabase.from("scheduled_generations").delete().eq("id", id);
    await loadJobs();
  }

  const statusLabel: Record<string, string> = {
    pending: "⏳ Oczekuje",
    processing: "⚙️ W trakcie",
    done: "✅ Gotowe",
    failed: "❌ Nieudane",
  };

  const statusColor: Record<string, string> = {
    pending: "#F59E0B",
    processing: "#2563EB",
    done: "#10B981",
    failed: "#DC2626",
  };

  return (
    <div
      style={{
        marginTop: "16px",
        border: "1px solid #7C3AED",
        borderRadius: "16px",
        padding: "16px",
        background: "rgba(124,58,237,0.05)",
      }}
    >
      <div
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}
        onClick={() => setOpen((v) => !v)}
      >
        <h3 style={{ fontSize: "15px" }}>🕒 Zaplanuj generowanie na później</h3>
        <span style={{ fontSize: "13px", color: "#9CA3AF" }}>{open ? "Zwiń ▲" : "Rozwiń ▼"}</span>
      </div>

      {open && (
        <div style={{ marginTop: "14px" }}>
          <p style={{ fontSize: "13px", color: "#D1D5DB", marginBottom: "8px" }}>
            Opisz, co ma się wygenerować
          </p>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
            placeholder="np. Zbuduj stronę dla kawiarni z menu i sekcją kontakt"
            style={{ width: "100%", padding: "8px", marginBottom: "12px", resize: "vertical" }}
          />

          <p style={{ fontSize: "13px", color: "#D1D5DB", marginBottom: "8px" }}>
            Data i godzina wykonania
          </p>
          <input
            type="datetime-local"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
            style={{ width: "100%", padding: "8px", marginBottom: "12px" }}
          />

          <button
            onClick={handleSchedule}
            disabled={saving || !prompt.trim() || !dateTime}
            className="card-button"
            style={{ background: "#7C3AED", width: "100%", marginBottom: "16px" }}
          >
            {saving ? "Zapisywanie..." : "📅 Zaplanuj"}
          </button>

          {jobs.length === 0 ? (
            <p style={{ fontSize: "13px", color: "#6B7280" }}>Brak zaplanowanych zadań.</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0 }}>
              {jobs.map((job) => (
                <li
                  key={job.id}
                  style={{
                    padding: "10px",
                    marginBottom: "8px",
                    borderRadius: "10px",
                    border: `1px solid ${statusColor[job.status] ?? "#374151"}`,
                    fontSize: "13px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <span style={{ color: statusColor[job.status], fontWeight: 700 }}>
                      {statusLabel[job.status] ?? job.status}
                    </span>
                    <button
                      onClick={() => handleDelete(job.id)}
                      style={{ background: "transparent", border: "none", color: "#DC2626", cursor: "pointer", fontSize: "12px" }}
                    >
                      Usuń
                    </button>
                  </div>
                  <p style={{ color: "#D1D5DB", marginBottom: "4px" }}>{job.prompt}</p>
                  <p style={{ color: "#6B7280", fontSize: "12px" }}>
                    Zaplanowano na: {new Date(job.scheduled_for).toLocaleString("pl-PL")}
                    {job.attempt > 0 && ` · Próba ${job.attempt}/${job.max_attempts}`}
                  </p>
                  {job.error && job.status === "failed" && (
                    <p style={{ color: "#DC2626", fontSize: "11px", marginTop: "4px" }}>
                      Błąd: {job.error.slice(0, 150)}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
