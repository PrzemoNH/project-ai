import Link from "next/link";
import Image from "next/image";

export default function Features() {
  return (
    <section className="features" id="features">
      <h2>Wybierz swoją drogę</h2>
      <p className="features-subtitle">
        Nieważne, czy dopiero zaczynasz, czy masz już pomysł gotowy do realizacji —
        znajdziesz tu dokładnie to, czego potrzebujesz.
      </p>

      <div className="features-grid">

        <article className="feature-card creator">
          <Image
            src="/images/logo/project-ai-icon-bg.svg"
            alt=""
            width={140}
            height={140}
            className="card-background-icon"
          />
          <div className="card-content">
            <div className="icon">🟢</div>
            <h3>Ucz się</h3>
            <p>
              Zrozum programowanie w swoim tempie. AI tłumaczy każdy fragment
              kodu tak, jakbyś miał osobistego nauczyciela zawsze pod ręką.
            </p>
            <Link href="/dashboard?mode=learn" className="card-link">
              Zacznij naukę →
            </Link>
          </div>
        </article>

        <article className="feature-card studio">
          <Image
            src="/images/logo/project-ai-icon-bg.svg"
            alt=""
            width={140}
            height={140}
            className="card-background-icon"
          />
          <div className="card-content">
            <div className="icon">🟣</div>
            <h3>Twórz</h3>
            <p>
              Masz wizję strony, gry albo aplikacji? Opisz ją, a AI zbuduje
              pierwszą wersję szybciej, niż zdążysz zaparzyć kawę.
            </p>
            <Link href="/dashboard?mode=create" className="card-link">
              Zacznij tworzyć →
            </Link>
          </div>
        </article>

        <article className="feature-card projects">
          <Image
            src="/images/logo/project-ai-icon-bg.svg"
            alt=""
            width={140}
            height={140}
            className="card-background-icon"
          />
          <div className="card-content">
            <div className="icon">🔵</div>
            <h3>Projektuj</h3>
            <p>
              Masz już coś stworzonego? Rozwijaj to dalej z AI jako partnerem,
              który rozumie Twój kod i pomaga iść o krok dalej.
            </p>
            <Link href="/dashboard?mode=design" className="card-link">
              Rozwijaj projekt →
            </Link>
          </div>
        </article>

      </div>
    </section>
  );
}
