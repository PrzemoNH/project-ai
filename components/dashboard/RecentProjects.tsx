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
          {projects.map((project) => (
            <li
              key={project.id}
              style={{
                padding: "14px 0",
                borderBottom: "1px solid #374151",
              }}
            >
              <strong>{project.name}</strong>
              {" — "}
              <span style={{ color: "#D1D5DB" }}>{project.status}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
