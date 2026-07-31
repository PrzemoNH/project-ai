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
5. Jeśli wiadomość użytkownika to pytanie lub prośba o wyjaśnienie (nie dotyczy budowy strony) — odpowiedz normalnie, zwykłym tekstem, bez formatu plików.
6. NIGDY nie generuj formularzy logowania, rejestracji, ani jakichkolwiek pól do wpisywania hasła, chyba że użytkownik WYRAŹNIE o to poprosi (np. napisze "dodaj panel logowania"). Bez takiej wyraźnej prośby pomijaj tę funkcję całkowicie — nie dodawaj jej jako "ozdobnika" czy demo.`;

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

const GEMINI_MODEL = "gemini-3.5-flash";
const OPENROUTER_MODEL = "cohere/north-mini-code:free";

async function callGemini(apiKey: string, systemInstruction: string, contents: any[]) {
  return fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemInstruction }] },
        contents,
      }),
    }
  );
}

async function callOpenRouter(apiKey: string, systemInstruction: string, userMessage: string) {
  return fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      messages: [
        { role: "system", content: systemInstruction },
        { role: "user", content: userMessage },
      ],
    }),
  });
}

export async function POST(request: NextRequest) {
  try {
    const { message, currentFiles, mode } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Brak wiadomości" }, { status: 400 });
    }

    const geminiKey = process.env.GOOGLE_AI_API_KEY;
    const openRouterKey = process.env.OPENROUTER_API_KEY;

    if (!geminiKey) {
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

    const contents = [{ role: "user", parts: [{ text: promptText }] }];

    // Próba 1-3: Gemini
    let response = await callGemini(geminiKey, systemInstruction, contents);

    for (
      let attempt = 0;
      attempt < 2 && (response.status === 503 || response.status === 429);
      attempt++
    ) {
      const waitMs = response.status === 429 ? 8000 : 1500;
      await new Promise((resolve) => setTimeout(resolve, waitMs));
      response = await callGemini(geminiKey, systemInstruction, contents);
    }

    // Jeśli Gemini ostatecznie zawiódł, a m
