import { NextRequest, NextResponse } from "next/server";

const BASE_INSTRUCTION = `Jesteś silnikiem AI budującym strony internetowe wewnątrz platformy Project-AI.

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

const MODE_ADDENDUM: Record<string, string> = {
  learn: `

TRYB: UCZ SIĘ — bardzo ważne dodatkowe zasady:
- Dodaj DUŻO komentarzy w kodzie HTML/CSS/JS, tłumacząc prostym językiem co robi dana sekcja/reguła/funkcja (jakby tłumaczył początkującemu).
- Komentarze w HTML: <!-- To jest ... -->, w CSS: /* ... */, w JS: // ...
- Komentuj każdą większą sekcję, nie tylko pojedyncze linijki.`,
  create: `

TRYB: TWÓRZ — pisz czysty, produkcyjny kod bez zbędnych komentarzy, skup się na szybkości i estetyce.`,
  design: `

TRYB: PROJEKTUJ — zwróć szczególną uwagę na architekturę kodu, czytelność struktury i możliwość łatwego rozwijania w przyszłości.`,
};

export async function POST(request: NextRequest) {
  try {
    const { message, currentFiles, history, mode } = await request.json();

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

    const systemInstruction =
      BASE_INSTRUCTION + (mode && MODE_ADDENDUM[mode] ? MODE_ADDENDUM[mode] : "");

    let promptText = message;
    if (currentFiles) {
      promptText = `AKTUALNE PLIKI (zmodyfikuj zgodnie z prośbą, zwróć wszystkie trzy na nowo):\n\n${currentFiles}\n\nPROŚBA UŻYTKOWNIKA:\n${message}`;
    }

    const contents = [
      ...(Array.isArray(history) ? history : []),
      { role: "user", parts: [{ text: promptText }] },
    ];

    async function callGemini() {
      return fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": apiKey!,
          },
          body: JSON.stringify({
            system_instruction: {
              parts: [{ text: systemInstruction }],
            },
            contents,
          }),
        }
      );
    }

    let response = await callGemini();

    for (let attempt = 0; attempt < 2 && response.status === 503; attempt++) {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      response = await callGemini();
    }

    if (!response.ok) {
      const errorText = await response.text();
      const friendlyError =
        response.status === 503
          ? "Model AI jest chwilowo przeciążony. Spróbuj wysłać wiadomość ponownie za chwilę."
          : "Błąd AI: " + errorText;
      return NextResponse.json({ error: friendlyError }, { status: 500 });
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
