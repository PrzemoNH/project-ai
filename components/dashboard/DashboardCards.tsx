import Image from "next/image";

export default function DashboardCards() {
  return (
    <section className="dashboard-cards">


      <article className="dashboard-card create">

        <div className="card-background-icon">
          <Image
            src="/images/logo/project-ai-icon-bg.svg"
            alt=""
            width={300}
            height={300}
          />
        </div>

        <h2>
          Twórz
        </h2>

        <p>
          Rozpocznij nowy projekt.
          Twórz strony internetowe,
          aplikacje i gry z pomocą AI.
        </p>

        <button className="card-button create-button">
          Nowy projekt →
        </button>

      </article>



      <article className="dashboard-card projects">

        <div className="card-background-icon">
          <Image
            src="/images/logo/project-ai-icon-bg.svg"
            alt=""
            width={300}
            height={300}
          />
        </div>

        <h2>
          Rozwijaj
        </h2>

        <p>
          Otwieraj swoje projekty,
          dodawaj funkcje i ulepszaj
          je razem z AI.
        </p>

        <button className="card-button projects-button">
          Moje projekty →
        </button>

      </article>



      <article className="dashboard-card studio">

        <div className="card-background-icon">
          <Image
            src="/images/logo/project-ai-icon-bg.svg"
            alt=""
            width={300}
            height={300}
          />
        </div>

        <h2>
          Ucz się
        </h2>

        <p>
          Poznawaj kod, ucz się
          programowania i korzystaj
          z pomocy AI.
        </p>

        <button className="card-button studio-button">
          AI Studio →
        </button>

      </article>


    </section>
  );
}