import Image from "next/image";

export default function Hero() {
  return (
    <section className="hero">

      <Image
        src="/images/logo/project-ai-icon.svg"
        alt="project-ai"
        width={700}
        height={700}
        className="hero-icon"
        priority
      />

      <div className="hero-content">

        <h1>
          Twórz.
          <br />
          Ucz się.
          <br />
          Rozwijaj.
        </h1>

        <p className="hero-subtitle">
          Twoja platforma do tworzenia
          <br />
          stron, aplikacji i gier z pomocą AI.
        </p>

      </div>

    </section>
  );
}