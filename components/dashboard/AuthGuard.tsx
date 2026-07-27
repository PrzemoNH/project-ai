"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    async function checkSession() {
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        router.push("/login");
      } else {
        setChecked(true);
      }
    }

    checkSession();
  }, [router]);

  if (!checked) {
    return (
      <p style={{ textAlign: "center", marginTop: "80px", color: "#D1D5DB" }}>
        Sprawdzanie dostępu...
      </p>
    );
  }

  return <>{children}</>;
}
