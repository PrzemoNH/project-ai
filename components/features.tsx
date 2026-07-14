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


        {/* KREATOR AI */}

        <article className="feature-card creator">

          <div className="icon">
            🟣
          </div>


          <h3>
            Kreator AI
          </h3>


          <p>
            Rozpocznij projekt od podstaw.
            AI pomoże Ci zaplanować,
            stworzyć i prowadzić cały proces
            krok po kroku.
          </p>


          <button>
            Rozpocznij →
          </button>

        </article>





        {/* STUDIO AI */}

        <article className="feature-card studio">

          <div className="icon">
            🟢
          </div>


          <h3>
            Studio AI
          </h3>


          <p>
            Pracuj z kodem, ucz się nowych
            technologii i korzystaj z pomocy AI.
            Możesz otrzymać wyjaśnienia lub
            konkretne rozwiązania.
          </p>


          <button>
            Otwórz Studio →
          </button>

        </article>





        {/* PROJEKTY */}

        <article className="feature-card projects">

          <div className="icon">
            🔵
          </div>


          <h3>
            Projekty
          </h3>


          <p>
            Zarządzaj swoimi projektami,
            rozwijaj istniejące rozwiązania
            i wracaj do pracy dokładnie
            tam, gdzie skończyłeś.
          </p>


          <button>
            Moje projekty →
          </button>

        </article>



      </div>


    </section>
  );
}