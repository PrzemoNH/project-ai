 "use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Project = {
  id: string;
  name: string;
  description: string | null;
  mode: string | null;
  status: string;
  created_at: string;
};

const modeColors: Record<string, string> = {
  learn: "#10B981",
  create: "#7C3AED",
  design: "#2563EB",
};

const modeLabels: Record<string, string> = {
  learn: "Ucz się",
  create: "Twórz",
  design: "Projektuj",
};

export default function ProjectDetail({ projectId }: { projectId: string }) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .single();

      if (!error && data) {
        setProject(data);
        setName(data.name);
        setDescription(data.description ?? "");
      }

      setLoading(false);
    }

    load();
  }, [projectId]);

  async function handleSave() {
    setSaving(true);

    const { error } = await supabase
      .from("projects")
      .update({ name, description, updated_at: new Date().toISOString() })
      .eq("id", projectId);

    if (!error) {
      setProject((prev) => (prev ? { ...prev, name, description } : prev));
    }

    setSaving(false);
  }

  if (loading) {
    return <p style={{ textAlign: "center", marginTop: "60px" }}>Ładowanie...</p>;
  }

  if (!project) {
    return (
      <div style={{ textAlign: "center", marginTop: "60px" }}>
        <p>Nie znaleziono projektu.</p>
        <Link href="/dashboard" className="secondary-button">
          ← Wróć do dashboardu
        </Link>
      </div>
    );
  }

  const color = project.mode ? modeColors[project.mode] : "#6B7280";
  const label = project.mode ? modeLabels[project.mode] : "Ogólny";

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto" }}>
      <Link
        href="/dashboard"
        style={{ color: "#D1D5DB", textDecoration: "none", fontSize: "14px" }}
      >
        ← Wróć do dashboardu
      </Link>

      <div
        style={{
          marginTop: "20px",
          padding: "30px",
          borderRadius: "24px",
          border: `1px solid ${color}`,
          background: "rgba(255,255,255,0.03)",
        }}
      >
        <span
          style={{
            fontSize: "12px",
            fontWeight: 700,
            color: color,
            border: `1px solid ${color}`,
            borderRadius: "999px",
            padding: "3px 10px",
          }}
        >
          {label}
        </span>

        <div style={{ marginTop: "16px" }}>
          <label style={{ fontSize: "14px", color: "#D1D5DB" }}>Nazwa</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: "100%", padding: "10px", margin: "6px 0 16px" }}
          />

          <label style={{ fontSize: "14px", color: "#D1D5DB" }}>Opis</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            style={{ width: "100%", padding: "10px", margin: "6px 0 16px" }}
          />

          <button
            onClick={handleSave}
            disabled={saving}
            className="card-button"
            style={{ background: color }}
          >
            {saving ? "Zapisywanie..." : "Zapisz zmiany"}
          </button>

          <p style={{ marginTop: "20px", color: "#6B7280", fontSize: "13px" }}>
            Status: {project.status} · Utworzono:{" "}
            {new Date(project.created_at).toLocaleDateString("pl-PL")}
          </p>
        </div>
      </div>
    
