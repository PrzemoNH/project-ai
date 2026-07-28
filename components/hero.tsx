import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="hero">

      <div className="hero-icon-wrapper">
        <Image
          src="/images/logo/project-ai-icon-bg.svg"
          alt="Project-AI"
          width={800}
          height={800}
          className="hero-icon"
          priority
        />
      </div>

      <div className="hero-content">

        <h1>
          <span className="learn-text">
            Ucz się.
          </span>

          <br />

          <span className="develop-text">
            Rozwijaj.
          </span>

          <br />

          <span className="create-text">
            Twórz.
          </span>
        </h1>

        <p>
          Twoja platforma AI do tworzenia
          <br />
          stron internetowych, gier i aplikacji.
        </p>

        <div className="hero-buttons">

          <Link href="/dashboard" className="primary-button">
            Rozpocznij tworzenie →
          </Link>

          <Link href="#features" className="secondary-button">
            Zobacz możliwości
          </Link>

        </div>

      </div>

    </section>
  );
}
