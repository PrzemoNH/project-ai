export default function Features() {
  return (
    <section className="features">

      <h2>
        Poznaj możliwości Project-AI
      </h2>


      <p className="features-subtitle">
        Jeden system AI do tworzenia,
        rozwijania i nauki projektów.
      </p>



      <div className="features-grid">


        {/* KREATOR AI - UCZ SIĘ */}

        <article className="feature-card creator">

          <div className="icon">
            🟢
          </div>


          <h3>
            Kreator AI
          </h3>


          <p>
            Rozpocznij swoją przygodę z tworzeniem.
            AI poprowadzi Cię krok po kroku,
            wyjaśni proces i pomoże zbudować
            pierwszy projekt.
          </p>


          <button>
            Rozpocznij naukę →
          </button>

        </article>





        {/* PROJEKTY - ROZWIJAJ */}

        <article className="feature-card projects">

          <div className="icon">
            🔵
          </div>


          <h3>
            Projekty
          </h3>


          <p>
            Masz już projekt?
            Analizuj pliki, poprawiaj kod,
            dodawaj funkcje i rozwijaj swoje
            rozwiązania razem z AI.
          </p>


          <button>
            Moje projekty →
          </button>

        </article>





        {/* STUDIO AI - TWÓRZ */}

        <article className="feature-card studio">

          <div className="icon">
            🟣
          </div>


          <h3>
            Studio AI
          </h3>


          <p>
            Twórz po swojemu.
            Pracuj nad kodem, projektuj
            aplikacje i gry, a AI będzie
            Twoim zaawansowanym pomocnikiem.
          </p>


          <button>
            Otwórz Studio →
          </button>

        </article>



      </div>


    </section>
  );
}