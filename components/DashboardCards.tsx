export default function DashboardCards() {
  return (
    <section className="dashboard-cards">

      <article className="dashboard-card create">

        <div className="dashboard-icon">
          🟣
        </div>

        <h2>
          Twórz
        </h2>

        <p>
          Stwórz stronę internetową,
          grę lub aplikację z pomocą AI.
        </p>

      </article>


      <article className="dashboard-card learn">

        <div className="dashboard-icon">
          🟢
        </div>

        <h2>
          Ucz się
        </h2>

        <p>
          Poznaj technologie,
          programowanie i sztuczną inteligencję.
        </p>

      </article>


      <article className="dashboard-card develop">

        <div className="dashboard-icon">
          🔵
        </div>

        <h2>
          Rozwijaj
        </h2>

        <p>
          Kontynuuj projekty
          i dodawaj nowe funkcje.
        </p>

      </article>


    </section>
  );
}