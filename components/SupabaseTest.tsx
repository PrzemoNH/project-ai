"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SupabaseTest() {
  const [status, setStatus] = useState("Sprawdzam połączenie...");

  useEffect(() => {
    async function testConnection() {
      const { error } = await supabase.auth.getSession();

      if (error) {
        setStatus("❌ Błąd połączenia: " + error.message);
      } else {
        setStatus("✅ Połączenie z Supabase działa!");
      }
    }

    testConnection();
  }, []);

  return (
    <p style={{ color: status.startsWith("✅") ? "lime" : "red", textAlign: "center" }}>
      {status}
    </p>
  );
}
