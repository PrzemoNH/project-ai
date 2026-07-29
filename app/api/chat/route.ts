import { NextRequest, NextResponse } from "next/server";

const SITE_BUILDER_INSTRUCTION = `Jesteś silnikiem AI budującym strony internetowe wewnątrz platformy Project-AI.

Gdy użytkownik opisuje stronę, którą chce zbudować lub zmienić, generujesz TRZY oddzielne pliki: index.html, style.css, script.js.

FORMAT ODPOWIEDZI (bardzo ważne, trzymaj się dokładnie):
---FILE:index.html---
(tu pełny kod HTML, w <head> dołącz: <link rel="stylesheet" href="style.css"> oraz przed </body>: <script src="script.js"></script>)
---FILE:style.css---
(tu pełny kod CSS)
---FILE:script.js---
(tu kod JavaScript, jeśli strona go potrzebuje; jeśli nie — zostaw pusty komentarz // brak dodatkowego JS)

ZASADY:
1. Jeśli to pierwsza wiadomość opisująca stronę — stwórz wszystkie trzy pliki od podstaw.
2. Jeśli użytkownik prosi o zmianę w istniejącej stronie (masz ją poniżej w sekcji AKTUALNE PLIKI) — zmodyfikuj odpowiednie pliki, zachowując resztę bez zmian, i zwróć WSZYSTKIE TRZY pliki na nowo w tym samym formacie.
3. Odpowiadaj WYŁĄCZNIE w formacie powyżej — żadnych wyjaśnień przed ani po, żadnych znaczników markdown.
4. Strona ma być responsywna, estetyczna, z nowoczesnym designem.
5. Jeśli wiadomość użytkownika to pytanie lub prośba o wyjaśnienie (nie dotyczy budowy strony) — odpowiedz normalnie, zwykłym tekstem, bez formatu plików.`;

export async function POST(request: NextRequest) {
  try {
    const { message, currentFiles, history } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Brak wiadomości" }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_AI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Brak klucza API po stronie serwera" },
        { status: 500 }
      );
    }

    let promptText = message;
    if (currentFiles) {
      promptText = `AKTUALNE PLIKI (zmodyfikuj zgodnie z prośbą, zwróć wszystkie trzy na nowo):\n\n${currentFiles}\n\nPROŚBA UŻYTKOWNIKA:\n${message}`;
    }

    const contents = [
      ...(Array.isArray(history) ? history : []),
      { role: "user", parts: [{ text: promptText }] },
    ];

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: SITE_BUILDER_INSTRUCTION }],
          },
          contents,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: "Błąd AI: " + errorText },
        { status: 500 }
      );
    }

    const data = await response.json();
    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ??
      "Brak odpowiedzi od AI.";

    return NextResponse.json({ reply });
  } catch (err) {
    return NextResponse.json(
      { error: "Nieoczekiwany błąd serwera" },
      { status: 500 }
    );
  }
}
