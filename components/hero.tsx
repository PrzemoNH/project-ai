import Image from "next/image";

export default function Hero() {
  return (
    <section className="hero">

      <Image
        src="/images/logo/project-ai-icon.svg"
        alt="Project-AI"
        width={800}
        height={800}
        className="hero-icon"
        priority
      />

      <div className="hero-content">

        <h1>
          Twórz.
          <br />
          Ucz się.
          <br />
          <span>Rozwijaj.</span>
        </h1>

        <p>
          Twoja platforma AI do tworzenia
          <br />
          stron internetowych, gier i aplikacji.
        </p>

        <div className="hero-buttons">

          <button className="primary-button">
            Rozpocznij tworzenie →
          </button>

          <button className="secondary-button">
            Zobacz możliwości
          </button>

        </div>

      </div>

    </section>
  );
}