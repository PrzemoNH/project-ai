import Link from "next/link";

export default function LandingCard() {
  return (
    <section className="landing-shell">
      <div className="landing-card">
        <h1>
          Jedno miejsce do nauki,
          <br />
          tworzenia i projektowania z AI.
        </h1>

        <p>
          Project-AI pomaga tworzyć strony internetowe, gry i aplikacje
          z wykorzystaniem sztucznej inteligencji.
        </p>

        <Link href="/dashboard" className="primary-button">
          Rozpocznij tworzenie →
        </Link>
      </div>
    </section>
  );
}
