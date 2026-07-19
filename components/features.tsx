import Link from "next/link";

export default function Features() {
  return (
    <section className="features">
      <h2>Poznaj możliwości Project-AI</h2>
      <p className="features-subtitle">
        Jeden wspólny silnik AI do nauki, tworzenia i rozwijania projektów.
      </p>

      <div className="features-grid">
        <article className="feature-card creator">
          <div className="icon">🟢</div>
          <h3>Ucz się</h3>
          <p>
            Nauka programowania, wyjaśnianie kodu i prowadzenie krok po kroku.
            AI dopasowuje poziom pomocy do użytkownika.
          </p>
          <Link href="/dashboard?mode=learn" className="card-link">
            Rozpocznij naukę →
          </Link>
        </article>

        <article className="feature-card studio">
          <div className="icon">🟣</div>
          <h3>Twórz</h3>
          <p>
            Budowanie stron, aplikacji i gier z pomocą jednego silnika AI.
          </p>
          <Link href="/dashboard?mode=create" className="card-link">
            Zacznij tworzyć →
          </Link>
        </article>

        <article className="feature-card projects">
          <div className="icon">🔵</div>
          <h3>Projektuj</h3>
          <p>
            Rozwijaj istniejące projekty, analizuj kod i pracuj jak z zespołem AI.
          </p>
          <Link href="/dashboard?mode=design" className="card-link">
            Moje projekty →
          </Link>
        </article>
      </div>
    </section>
  );
}
