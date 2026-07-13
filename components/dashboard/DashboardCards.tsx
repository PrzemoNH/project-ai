export default function DashboardCards() {
  return (
    <section className="dashboard-cards">

      <article className="dashboard-card create">

        <div className="dashboard-icon">
          🟣
        </div>

        <h2>
          Nowy projekt
        </h2>

        <p>
          Stwórz stronę internetową,
          grę lub aplikację z pomocą AI.
        </p>

        <button>
          Rozpocznij →
        </button>

      </article>


      <article className="dashboard-card projects">

        <div className="dashboard-icon">
          📁
        </div>

        <h2>
          Moje projekty
        </h2>

        <p>
          Otwieraj zapisane projekty,
          kontynuuj pracę i rozwijaj funkcje.
        </p>

        <button>
          Zobacz projekty →
        </button>

      </article>


      <article className="dashboard-card studio">

        <div className="dashboard-icon">
          🤖
        </div>

        <h2>
          AI Studio
        </h2>

        <p>
          Pracuj z AI nad kodem,
          wyglądem i funkcjami projektu.
        </p>

        <button>
          Otwórz Studio →
        </button>

      </article>

    </section>
  );
}