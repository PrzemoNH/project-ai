import { NextRequest, NextResponse } from "next/server";

const SITE_BUILDER_INSTRUCTION = `Jesteś silnikiem AI budującym strony internetowe wewnątrz platformy Project-AI.

Gdy użytkownik opisuje stronę, którą chce zbudować lub zmienić, Twoim zadaniem jest wygenerować KOMPLETNY, samodzielny kod HTML tej strony (z CSS w znaczniku <style> wewnątrz <head>, bez zewnętrznych plików).

ZASADY:
1. Jeśli to pierwsza wiadomość opisująca stronę — stwórz od podstaw kompletny dokument HTML (<!DOCTYPE html>...</html>).
2. Jeśli użytkownik prosi o zmianę w istniejącej stronie (masz ją poniżej w sekcji AKTUALNA STRONA) — zmodyfikuj ją, zachowując resztę bez zmian, i zwróć CAŁY zaktualizowany dokument HTML.
3. Odpowiadaj WYŁĄCZNIE kodem HTML — żadnych wyjaśnień przed ani po, żadnych znaczników markdown (bez \`\`\`html).
4. Strona ma być responsywna, estetyczna, z sensownym, nowoczesnym designem (czytelne fonty, odstępy, kolory dopasowane do tematu strony).
5. Jeśli wiadomość użytkownika to pytanie lub prośba o wyjaśnienie (nie dotyczy budowy strony) — odpowiedz normalnie, zwykłym tekstem, bez HTML.`;

export async function POST(request: NextRequest) {
  try {
    const { message, currentHtml, history } = await request.json();

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
    if (currentHtml) {
      promptText = `AKTUALNA STRONA (zmodyfikuj ją zgodnie z prośbą poniżej, zwróć całość):\n\n${currentHtml}\n\nPROŚBA UŻYTKOWNIKA:\n${message}`;
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
