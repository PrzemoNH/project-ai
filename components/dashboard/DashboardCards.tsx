import Image from "next/image";

export default function DashboardCards() {
  return (
    <section className="dashboard-cards">

      {/* 🟢 UCZ SIĘ */}
      <article className="dashboard-card learn">
        <Image
          src="/images/logo/project-ai-icon-bg.svg"
          alt=""
          width={220}
          height={220}
          className="card-background-icon"
        />

        <div className="card-content">
          <h2 className="learn-title">Ucz się</h2>
          <p>Poznawaj kod, ucz się programowania i korzystaj z pomocy AI.</p>
          <button className="card-button learn-button">AI Nauka →</button>
        </div>
      </article>

      {/* 🟣 TWÓRZ */}
      <article className="dashboard-card create">
        <Image
          src="/images/logo/project-ai-icon-bg.svg"
          alt=""
          width={220}
          height={220}
          className="card-background-icon"
        />

        <div className="card-content">
          <h2 className="create-title">Twórz</h2>
          <p>Twórz strony internetowe, aplikacje i gry z pomocą AI.</p>
          <button className="card-button create-button">Nowy projekt →</button>
        </div>
      </article>

      {/* 🔵 PROJEKTUJ */}
      <article className="dashboard-card projects">
        <Image
          src="/images/logo/project-ai-icon-bg.svg"
          alt=""
          width={220}
          height={220}
          className="card-background-icon"
        />

        <div className="card-content">
          <h2 className="develop-title">Projektuj</h2>
          <p>Buduj zaawansowane projekty i rozwijaj je razem z AI.</p>
          <button className="card-button projects-button">Moje projekty →</button>
        </div>
      </article>

    </section>
  );
}
