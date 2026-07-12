export default function Dashboard() {
  return (
    <main className="dashboard">

      <h1>
        Witaj w Project-AI
      </h1>

      <p className="dashboard-subtitle">
        Co chcesz dzisiaj zrobić?
      </p>


      <div className="dashboard-grid">


        <section className="dashboard-card create">

          <h2>
            🟣 Twórz
          </h2>

          <p>
            Stwórz stronę internetową,
            grę lub aplikację z pomocą AI.
          </p>

        </section>



        <section className="dashboard-card learn">

          <h2>
            🟢 Ucz się
          </h2>

          <p>
            Poznaj technologie,
            programowanie i sztuczną inteligencję.
          </p>

        </section>



        <section className="dashboard-card develop">

          <h2>
            🔵 Rozwijaj
          </h2>

          <p>
            Kontynuuj projekty
            i dodawaj nowe funkcje.
          </p>

        </section>


      </div>


      <section className="projects-box">

        <h2>
          Ostatnie projekty
        </h2>

        <button>
          + Nowy projekt
        </button>

      </section>


    </main>
  );
}