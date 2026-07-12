export default function Features() {
  return (
    <section className="features">

      <h2>
        Poznaj możliwości Project-AI
      </h2>


      <p className="features-subtitle">
        Twórz strony internetowe, gry i aplikacje
        z pomocą sztucznej inteligencji.
      </p>



      <div className="features-grid">


        <article className="feature-card creator">

          <div className="icon">
            🌱
          </div>

          <h3>
            Kreator AI
          </h3>

          <p>
            Prowadź projekt krok po kroku.
            AI pomoże Ci zaplanować, stworzyć
            i rozwinąć Twój pomysł.
          </p>

          <button>
            Rozpocznij →
          </button>

        </article>




        <article className="feature-card studio">

          <div className="icon">
            🛠
          </div>

          <h3>
            Studio AI
          </h3>

          <p>
            Zaawansowana edycja kodu,
            komponentów i ustawień projektu.
          </p>

        </article>





        <article className="feature-card projects">

          <div className="icon">
            📁
          </div>

          <h3>
            Projekty
          </h3>

          <p>
            Wszystkie Twoje projekty
            w jednym miejscu.
          </p>

        </article>



      </div>


    </section>
  );
}