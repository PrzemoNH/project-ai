export default function Features() {
  return (
    <section className="features">

      <h2>
        Co chcesz stworzyć?
      </h2>

      <p className="features-subtitle">
        Wybierz rodzaj projektu i rozpocznij pracę
        razem ze sztuczną inteligencją.
      </p>


      <div className="creation-grid">


        <article className="creation-card">

          <div className="card-icon">
            🌐
          </div>

          <h3>
            Strona internetowa
          </h3>

          <p>
            Twórz strony firmowe,
            portfolio, blogi i sklepy.
          </p>

        </article>



        <article className="creation-card">

          <div className="card-icon">
            🎮
          </div>

          <h3>
            Gra
          </h3>

          <p>
            Projektuj gry 2D i 3D
            z pomocą AI.
          </p>

        </article>



        <article className="creation-card">

          <div className="card-icon">
            📱
          </div>

          <h3>
            Aplikacja
          </h3>

          <p>
            Buduj aplikacje mobilne
            i desktopowe.
          </p>

        </article>


      </div>



      <div className="ai-tools">


        <h2>
          Twoje narzędzia AI
        </h2>



        <div className="modules-grid">


          <article className="module-card main">

            <h3>
              🌱 Kreator AI
            </h3>

            <p>
              Prowadź projekt krok po kroku.
              AI pomoże Ci zaplanować,
              stworzyć i rozwinąć pomysł.
            </p>


            <button>
              Rozpocznij →
            </button>

          </article>



          <article className="module-card">

            <h3>
              🛠 Studio
            </h3>

            <p>
              Zaawansowana edycja
              kodu i komponentów.
            </p>

          </article>



          <article className="module-card">

            <h3>
              📁 Projekty
            </h3>

            <p>
              Wszystkie projekty
              w jednym miejscu.
            </p>

          </article>


        </div>

      </div>


    </section>
  );
}