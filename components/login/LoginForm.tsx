"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage("❌ " + error.message);
      setLoading(false);
    } else {
      setMessage("✅ Zalogowano pomyślnie!");
      router.push("/dashboard");
    }
  }

  async function handleSignUp() {
    setLoading(true);
    setMessage("");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setMessage("❌ " + error.message);
      setLoading(false);
    } else if (data.session) {
      setMessage("✅ Konto założone i zalogowano!");
      router.push("/dashboard");
    } else {
      setMessage("✅ Konto założone! Sprawdź e-mail, jeśli wymagane jest potwierdzenie.");
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: "400px", margin: "80px auto", padding: "20px", textAlign: "center" }}>
      <h1>Logowanie / Rejestracja</h1>

      <input
        type="email"
        placeholder="E-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: "100%", padding: "10px", margin: "10px 0" }}
      />

      <input
        type="password"
        placeholder="Hasło"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "100%", padding: "10px", margin: "10px 0" }}
      />

      <button onClick={handleLogin} disabled={loading} style={{ margin: "5px", padding: "10px 20px" }}>
        Zaloguj się
      </button>

      <button onClick={handleSignUp} disabled={loading} style={{ margin: "5px", padding: "10px 20px" }}>
        Zarejestruj się
      </button>

      {message && <p style={{ marginTop: "20px" }}>{message}</p>}
    </main>
  );
}
