# Project-AI — Dokumentacja

Platforma AI do nauki programowania, tworzenia stron/aplikacji/gier i rozwijania projektów. Jeden wspólny silnik AI, opakowany w trzy "wejścia" (Ucz się / Twórz / Projektuj) dla różnych potrzeb użytkownika.

**Adres produkcyjny:** https://project-ai-flax.vercel.app
**Repozytorium:** https://github.com/PrzemoNH/project-ai

---

## Stack technologiczny

- **Next.js 16.2.10** (App Router) — framework do budowy strony
- **React 19.2** — biblioteka do interfejsu
- **TypeScript** — JavaScript z dodatkowym sprawdzaniem typów (łapie błędy zanim strona się wyświetli)
- **Czysty CSS** — bez Tailwind ani innych bibliotek stylów
- **Supabase** — baza danych + logowanie użytkowników ("backend w pudełku")
- **Vercel** — hosting, automatyczne wdrażanie po każdym commicie

---

## Jak działa wdrażanie (deploy)

Każdy commit na gałęzi `main` w GitHubie automatycznie uruchamia nowy build na Vercelu (trwa ~1 minutę). Jeśli build się powiedzie, strona pod adresem `project-ai-flax.vercel.app` aktualizuje się sama. Jeśli build się nie powiedzie (błąd w kodzie), stara wersja strony zostaje — nic się nie psuje "na żywo".

---

## Struktura folderów

project-ai/
├── app/                    ← strony (routing Next.js)
│   ├── layout.tsx          ← wspólny szkielet całej strony
│   ├── page.tsx            ← strona główna (/)
│   ├── globals.css         ← globalne style
│   ├── dashboard/
│   │   ├── page.tsx        ← strona /dashboard
│   │   └── dashboard.css   ← style dla dashboardu
│   └── login/
│       └── page.tsx        ← strona /login
│
├── components/              ← elementy UI, pogrupowane tematycznie
│   ├── header.tsx
│   ├── hero.tsx
│   ├── features.tsx
│   ├── footer.tsx
│   ├── LandingCard.tsx
│   ├── dashboard/
│   │   ├── dashboard-header.tsx
│   │   ├── DashboardCards.tsx
│   │   ├── RecentProjects.tsx
│   │   └── AuthGuard.tsx
│   ├── login/
│   │   └── LoginForm.tsx
│   └── visual/
│       └── LandingGlow.tsx
│
├── lib/
│   └── supabase.ts          ← połączenie z Supabase
│
├── public/images/logo/       ← pliki logo (SVG)
│
├── package.json              ← lista używanych narzędzi/bibliotek
├── next.config.ts             ← konfiguracja Next.js
├── tsconfig.json               ← konfiguracja TypeScript
└── .gitignore                   ← pliki wykluczone z GitHuba (np. sekrety)

---

## Opis kluczowych plików

### app/layout.tsx
Wspólny "szkielet" dla każdej strony — ustawia język (lang="pl"), tytuł strony, importuje globalne style. Rzadko trzeba go ruszać.

### app/page.tsx
Strona główna. Składa się z komponentów: Header, LandingCard, Hero, Features, Footer — sama nie zawiera treści, tylko układa gotowe elementy.

### app/globals.css
Style obowiązujące na całej stronie: kolory motywu (ciemne tło, akcenty zielony/fioletowy/niebieski dla trzech trybów), style hero, przycisków, kart na landing page.

### lib/supabase.ts
Najważniejszy plik do połączenia z Supabase. Tworzy jeden gotowy "obiekt" (supabase), którego używa się w innych plikach do rozmowy z bazą danych i logowaniem. Czyta dwie tajne wartości (URL i klucz) ze zmiennych środowiskowych — nigdy nie wpisuj tych wartości bezpośrednio w tym pliku, bo trafiłyby do publicznego repo.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

### components/login/LoginForm.tsx
Formularz logowania/rejestracji. Dwie funkcje:
- handleLogin() — loguje istniejące konto (signInWithPassword)
- handleSignUp() — zakłada nowe konto (signUp)

Po sukcesie obu — przenosi (router.push) na /dashboard.

### components/dashboard/AuthGuard.tsx
"Strażnik" dashboardu. Sprawdza, czy ktoś jest zalogowany, zanim pokaże zawartość strony. Jeśli nie — przenosi na /login. Używa się go, owijając nim zawartość strony:

<AuthGuard>
  {/* zawartość widoczna tylko dla zalogowanych */}
</AuthGuard>

### components/dashboard/dashboard-header.tsx
Nagłówek dashboardu z logo i przyciskiem konta. Sprawdza aktualny stan logowania (onAuthStateChange) i pokazuje:
- "Zaloguj" (link do /login) — jeśli nikt nie jest zalogowany
- "Wyloguj (e-mail)" — jeśli ktoś jest zalogowany; po kliknięciu wylogowuje i przenosi na stronę główną (/)

### components/dashboard/RecentProjects.tsx
Lista projektów użytkownika + przycisk tworzenia nowego.
- loadProjects() — pobiera projekty z tabeli projects w Supabase. Dzięki RLS automatycznie widać tylko projekty zalogowanej osoby.
- handleCreateProject() — tworzy nowy wiersz w tabeli, przypisany do aktualnie zalogowanego użytkownika.

### .gitignore
Lista plików, które nigdy nie trafiają do GitHuba — najważniejsze: .env i .env.local (miejsca na tajne klucze, gdyby kiedyś były potrzebne lokalnie).

---

## Supabase — baza danych i logowanie

**Projekt:** project-ai (region: Frankfurt/eu-central-1)
**URL:** https://ixyismzenlorsxygwxnv.supabase.co

### Zmienne środowiskowe (ustawione na Vercelu, nie w kodzie!)

| Nazwa | Do czego służy |
|---|---|
| NEXT_PUBLIC_SUPABASE_URL | adres Twojego projektu Supabase |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | publiczny klucz dostępu (bezpieczny do pokazania w przeglądarce) |

Ustawione w: Vercel → project-ai → Settings → Environment Variables (środowiska: Production + Development).

### Tabela projects

| Kolumna | Typ | Opis |
|---|---|---|
| id | uuid | unikalny numer (automatyczny) |
| user_id | uuid | właściciel projektu (powiązany z kontem) |
| name | text | nazwa projektu |
| description | text | opis (opcjonalny) |
| mode | text | skąd projekt "wszedł": learn / create / design |
| status | text | draft / active / archived |
| content | jsonb | elastyczne pole na przyszłe dane projektu |
| created_at | timestamptz | data utworzenia (automatyczna) |
| updated_at | timestamptz | data ostatniej edycji (automatyczna) |

### Row Level Security (RLS)

Włączone i skonfigurowane. To reguły na poziomie bazy danych, które pilnują, żeby każdy użytkownik widział, edytował i usuwał wyłącznie swoje projekty — nawet gdyby ktoś próbował "oszukać" front-end, baza sama tego pilnuje. Cztery reguły: select, insert, update, delete — każda sprawdza auth.uid() = user_id.

### Ustawienia bezpieczeństwa logowania (Authentication)

- Email provider: włączony (logowanie e-mail + hasło)
- Confirm email: włączone (użytkownik musi potwierdzić e-mail — obecnie wyłączane tylko tymczasowo do testów)
- Rate limits: domyślne wartości Supabase (ochrona przed nadużyciami)
- Do zrobienia: "Leaked Password Protection" — obecnie wyłączone, warto włączyć (Authentication → Providers → Email)

---

## Stan projektu — co gotowe, co w planach

### Gotowe
- Landing page (kompletny wizualnie)
- Dashboard UI ze stylami
- Rejestracja / logowanie / wylogowanie (Supabase Auth)
- Zabezpieczenie dashboardu przed niezalogowanymi (AuthGuard)
- Tabela projects z RLS
- Tworzenie i wyświetlanie projektów użytkownika

### ✅ Gotowe
- Landing page (marketingowy ton, sekcja "Od pomysłu do gotowego projektu")
- Dashboard UI ze stylami
- Rejestracja / logowanie / wylogowanie (Supabase Auth, z wymogami siły hasła)
- Zabezpieczenie dashboardu przed niezalogowanymi (AuthGuard)
- Tabela `projects` z RLS, zoptymalizowana pod wydajność
- Pełny CRUD projektów (tworzenie, podgląd, edycja, usuwanie) z podstroną projektu
- **Silnik AI generujący strony** — czat, Kreator promptu, podgląd na żywo, pobieranie HTML

### ⏳ W planach
- Wielojęzyczność (PL / DE / EN)
- ESLint
- Router wielu ról AI (Nauczyciel/Analityk/Projektant/Programista/Tester) — inspiracja z koncepcji "canvas-test"
- Zapasowy dostawca AI (drugi klucz, automatyczne przełączanie przy limicie)

---
## Silnik AI budujący strony

Wewnątrz każdego projektu (`/dashboard/project/[id]`) działa prawdziwy silnik AI, który generuje kompletne strony internetowe na podstawie opisu użytkownika.

### `app/api/chat/route.ts`
"Biuro pośredniczące" — jedyne miejsce, gdzie używany jest tajny klucz `GOOGLE_AI_API_KEY`. Odbiera wiadomość użytkownika (i opcjonalnie aktualny kod strony, jeśli to poprawka), wysyła zapytanie do Google Gemini (`gemini-3.5-flash`) z instrukcją systemową nakazującą zwracać czysty kod HTML, i odsyła odpowiedź.

### `components/dashboard/ProjectChat.tsx`
Interfejs czatu wewnątrz projektu. Zawiera:
- **Kreator promptu** — panel z gotowymi opcjami (co budować, jakie technologie, temat, kolory, dodatkowe wymagania), który sam składa gotowy, dobrze sformułowany prompt do pola tekstowego
- **Historia rozmowy** — zapisywana w kolumnie `content.messages` tabeli `projects`
- **Podgląd strony na żywo** — wygenerowany kod HTML wyświetla się w `<iframe>` z `sandbox="allow-scripts"` (bezpieczny, ale pozwala na działanie stylów/skryptów wygenerowanej strony)
- **Zakładka "Kod źródłowy"** — surowy podgląd wygenerowanego HTML
- **Przycisk "Pobierz HTML"** — zapisuje wygenerowaną stronę jako plik na urządzenie użytkownika
- Wygenerowana strona zapisywana jest w kolumnie `content.site_html`

### Jak działa generowanie i poprawki
1. Pierwsza wiadomość opisująca stronę → AI generuje kompletny dokument HTML od podstaw
2. Kolejne wiadomości (np. "zmień kolor") → do zapytania dołączany jest aktualny kod strony (`currentHtml`), AI modyfikuje go i zwraca całość na nowo
3. Funkcja `extractHtml()` wyszukuje w odpowiedzi AI blok od `<!DOCTYPE html>` do `</html>` — jeśli go znajdzie, aktualizuje podgląd; jeśli nie, traktuje odpowiedź jako zwykłą wiadomość tekstową

### Zmienne środowiskowe (dodatkowe, względem Supabase)

| Nazwa | Do czego służy | Sensitive? |
|---|---|---|
| `GOOGLE_AI_API_KEY` | klucz do Google Gemini (Google AI Studio) | ✅ Tak — bez prefiksu `NEXT_PUBLIC_`, tylko po stronie serwera |

### Dostawca AI
Google Gemini, model `gemini-3.5-flash`, darmowy plan przez Google AI Studio (aistudio.google.com). Model dobierany był po tym, jak `gemini-2.5-flash` przestał być dostępny dla nowych kluczy — jeśli w przyszłości pojawi się podobny błąd 404, sprawdź aktualną nazwę dostępnego modelu w dokumentacji Google.


---

## Częste problemy i jak je rozwiązać

**Build na Vercelu się wysypuje z błędem supabaseKey is required / supabaseUrl is required**
→ Sprawdź Environment Variables na Vercelu — brakuje albo jest źle wpisana nazwa zmiennej. Musi być dokładnie NEXT_PUBLIC_SUPABASE_URL i NEXT_PUBLIC_SUPABASE_ANON_KEY, zaznaczone dla środowiska Production.

**Zmiana w kodzie nie widoczna na stronie**
→ Sprawdź, czy build na Vercelu zakończył się sukcesem (Deployments → status musi być "Ready"), i czy testujesz pod project-ai-flax.vercel.app (nie pod tymczasowym linkiem konkretnego deploya).

**"Nie mam jak dodać czegoś na Vercelu przez kod"**
→ Zmienne środowiskowe, ustawienia projektu itp. zawsze robi się ręcznie w panelu Vercela (vercel.com), nie przez plik w repo.
