"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Project = {
  id: string;
  name: string;
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

export default function RecentProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  async function loadProjects() {
    setLoading(true);

    const { data, error } = await supabase
      .from("projects")
      .select("id, name, mode, status, created_at")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setProjects(data);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadProjects();
  }, []);

  async function handleCreateProject() {
    setCreating(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setCreating(false);
      return;
    }

    const { error } = await supabase.from("projects").insert({
      user_id: user.id,
      name: "Nowy projekt",
      status: "draft",
    });

    if (!error) {
      await loadProjects();
    }

    setCreating(false);
  }

  return (
    <div className="projects-box">
      <h2>Twoje projekty</h2>

      <button
        onClick={handleCreateProject}
        disabled={creating}
        className="card-button"
        style={{ background: "#2563EB", marginBottom: "20px" }}
      >
        {creating ? "Tworzenie..." : "+ Nowy projekt"}
      </button>

      {loading ? (
        <p>Ładowanie projektów...</p>
      ) : projects.length === 0 ? (
        <p>Nie masz jeszcze żadnych projektów. Stwórz pierwszy!</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {projects.map((project) => {
            const color = project.mode ? modeColors[project.mode] : "#6B7280";
            const label = project.mode ? modeLabels[project.mode] : "Ogólny";

            return (
              <li
                key={project.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "14px 16px",
                  marginBottom: "10px",
                  borderRadius: "12px",
                  borderLeft: `4px solid ${color}`,
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
                    whiteSpace: "nowrap",
                  }}
                >
                  {label}
                </span>

                <strong style={{ flex: 1 }}>{project.name}</strong>

                <span style={{ color: "#D1D5DB", fontSize: "14px" }}>
                  {project.status}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
