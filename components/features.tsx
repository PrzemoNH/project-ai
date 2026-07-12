export default function Features() {
  return (
    <section className="features">

      <h2>
        Co chcesz stworzyć?
      </h2>

      <p className="features-subtitle">
        Wybierz kierunek i rozpocznij pracę
        z pomocą sztucznej inteligencji.
      </p>


      <div className="creation-grid">

        <div className="creation-card">
          <div className="icon">🌐</div>
          <h3>Strona internetowa</h3>
          <p>
            Landing page, portfolio,
            sklep lub własny pomysł.
          </p>
        </div>


        <div className="creation-card">
          <div className="icon">🎮</div>
          <h3>Gra</h3>
          <p>
            Twórz gry 2D, 3D
            i eksperymentuj z pomysłami.
          </p>
        </div>


        <div className="creation-card">
          <div className="icon">📱</div>
          <h3>Aplikacja</h3>
          <p>
            Projektuj aplikacje
            mobilne i desktopowe.
          </p>
        </div>

      </div>


      <h2 className="modules-title">
        Twoje narzędzia
      </h2>


      <div className="modules-grid">

        <div className="module-card main">
          <h3>🌱 Kreator AI</h3>
          <p>
            Stwórz projekt krok po kroku
            razem ze sztuczną inteligencją.
          </p>

          <button>
            Start →
          </button>
        </div>


        <div className="module-card">
          <h3>🛠 Studio</h3>
          <p>
            Edycja kodu i zaawansowane ustawienia.
          </p>
        </div>


        <div className="module-card">
          <h3>📁 Projekty</h3>
          <p>
            Wszystkie projekty w jednym miejscu.
          </p>
        </div>

      </div>

    </section>
  );
}