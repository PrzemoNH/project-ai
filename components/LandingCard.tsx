import Link from "next/link";

export default function LandingCard() {
  return (
    <section className="landing-shell">
      <div className="landing-card">
        <h1>
          Masz pomysł?
          <br />
          AI zamieni go w gotowy projekt.
        </h1>
        <p>
          Nie musisz umieć programować, żeby stworzyć własną stronę, grę czy
          aplikację. Project-AI prowadzi Cię krok po kroku — Ty opisujesz,
          co chcesz zbudować, a AI robi resztę.
        </p>
        <Link href="/dashboard" className="primary-button">
          Zacznij za darmo →
        </Link>
      </div>
    </section>
  );
}
