"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function DashboardHeader() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getSession();
      setUserEmail(data.session?.user.email ?? null);
      setChecked(true);
    }

    loadUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user.email ?? null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <header className="dashboard-header">

      <Image
        src="/images/logo/project-ai-logo.svg"
        alt="Project-AI"
        width={220}
        height={65}
        className="dashboard-logo"
        priority
      />

      {!checked ? null : userEmail ? (
        <button onClick={handleLogout} className="dashboard-account">
          👤 Wyloguj ({userEmail})
        </button>
      ) : (
        <Link href="/login" className="dashboard-account">
          👤 Zaloguj
        </Link>
      )}

    </header>
  );
}
