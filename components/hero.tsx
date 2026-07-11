import Image from "next/image";

export default function Hero() {
  return (
    <section>
      <Image
        src="/images/logo/project-ai-icon.svg"
        alt=""
        width={700}
        height={700}
      />

      <div>
        <h1>
          Twórz.
          <br />
          Ucz się.
          <br />
          Rozwijaj.
        </h1>

        <h2>
          Twórz strony internetowe, gry i aplikacje
          z pomocą sztucznej inteligencji.
        </h2>

        <p>
          Project-AI łączy kreatywność, naukę i technologię
          w jednym miejscu.
        </p>

        <button>
          Rozpocznij tworzenie
        </button>
      </div>
    </section>
  );
}