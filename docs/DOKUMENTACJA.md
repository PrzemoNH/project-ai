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

### W planach
- Ostylowanie listy projektów (obecnie "surowy" wygląd)
- Edycja / usuwanie projektów
- Połączenie kart trybów (Ucz się/Twórz/Projektuj) z realnym tworzeniem projektu danego typu
- Rozróżnienie treści landing page vs dashboard (obecnie się częściowo powtarzają)
- Wielojęzyczność (PL / DE / EN) — planowana po dokończeniu funkcji
- ESLint (obecnie brak)
- Włączenie "Leaked Password Protection" w Supabase

---

## Częste problemy i jak je rozwiązać

**Build na Vercelu się wysypuje z błędem supabaseKey is required / supabaseUrl is required**
→ Sprawdź Environment Variables na Vercelu — brakuje albo jest źle wpisana nazwa zmiennej. Musi być dokładnie NEXT_PUBLIC_SUPABASE_URL i NEXT_PUBLIC_SUPABASE_ANON_KEY, zaznaczone dla środowiska Production.

**Zmiana w kodzie nie widoczna na stronie**
→ Sprawdź, czy build na Vercelu zakończył się sukcesem (Deployments → status musi być "Ready"), i czy testujesz pod project-ai-flax.vercel.app (nie pod tymczasowym linkiem konkretnego deploya).

**"Nie mam jak dodać czegoś na Vercelu przez kod"**
→ Zmienne środowiskowe, ustawienia projektu itp. zawsze robi się ręcznie w panelu Vercela (vercel.com), nie przez plik w repo.
