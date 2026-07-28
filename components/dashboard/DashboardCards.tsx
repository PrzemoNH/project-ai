"use client";

import { useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

export default function DashboardCards() {
  const [creating, setCreating] = useState<string | null>(null);

  async function createProject(mode: string, name: string) {
    setCreating(mode);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setCreating(null);
      return;
    }

    const { error } = await supabase.from("projects").insert({
      user_id: user.id,
      name,
      mode,
      status: "draft",
    });

    if (!error) {
      window.location.reload();
    } else {
      setCreating(null);
    }
  }

  return (
    <section className="dashboard-cards">

      {/* 🟢 UCZ SIĘ */}
      <article className="dashboard-card learn">
        <Image
          src="/images/logo/project-ai-icon-bg.svg"
          alt=""
          width={220}
          height={220}
          className="card-background-icon"
        />

        <div className="card-content">
          <h2 className="learn-title">Ucz się</h2>
          <p>Poznawaj kod, ucz się programowania i korzystaj z pomocy AI.</p>
          <button
            className="card-button learn-button"
            onClick={() => createProject("learn", "Nowy projekt — Nauka")}
            disabled={creating !== null}
          >
            {creating === "learn" ? "Tworzenie..." : "AI Nauka →"}
          </button>
        </div>
      </article>

      {/* 🟣 TWÓRZ */}
      <article className="dashboard-card create">
        <Image
          src="/images/logo/project-ai-icon-bg.svg"
          alt=""
          width={220}
          height={220}
          className="card-background-icon"
        />

        <div className="card-content">
          <h2 className="create-title">Twórz</h2>
          <p>Twórz strony internetowe, aplikacje i gry z pomocą AI.</p>
          <button
            className="card-button create-button"
            onClick={() => createProject("create", "Nowy projekt — Tworzenie")}
            disabled={creating !== null}
          >
            {creating === "create" ? "Tworzenie..." : "Nowy projekt →"}
          </button>
        </div>
      </article>

      {/* 🔵 PROJEKTUJ */}
      <article className="dashboard-card projects">
        <Image
          src="/images/logo/project-ai-icon-bg.svg"
          alt=""
          width={220}
          height={220}
          className="card-background-icon"
        />

        <div className="card-content">
          <h2 className="develop-title">Projektuj</h2>
          <p>Buduj zaawansowane projekty i rozwijaj je razem z AI.</p>
          <button
            className="card-button projects-button"
            onClick={() => createProject("design", "Nowy projekt — Rozwijanie")}
            disabled={creating !== null}
          >
            {creating === "design" ? "Tworzenie..." : "Moje projekty →"}
          </button>
        </div>
      </article>

    </section>
  );
}
