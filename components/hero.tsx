import Image from "next/image";

export default function Hero() {
  return (
    <section className="hero">

      <Image
        src="/images/logo/project-ai-icon-bg.svg"
        alt="Project-AI"
        width={800}
        height={800}
        className="hero-icon"
        priority
      />

      <div className="hero-content">

<h1>
  <span className="learn-text">
  Ucz się.
</span>

<br />

<span className="develop-text">
  Rozwijaj.
</span>

<br />

<span className="create-text">
  Twórz.
</span>
</h1>

        <p>
          Twoja platforma AI do tworzenia
          <br />
          stron internetowych, gier i aplikacji.
        </p>

        <div className="hero-buttons">

          <button className="primary-button">
            Rozpocznij tworzenie →
          </button>

          <button className="secondary-button">
            Zobacz możliwości
          </button>

        </div>

      </div>
.hero {
  display:flex;
  flex-direction:column;
  align-items:center;
  text-align:center;
  padding:40px 20px 80px;
}

.hero-icon {
  margin-bottom:20px;
  opacity:.9;
}

.hero-content {
  max-width:800px;
}

.hero-content p {
  margin:20px auto 35px;
  max-width:600px;
  color:#D1D5DB;
  font-size:20px;
  line-height:1.6;
}

.hero-buttons {
  display:flex;
  gap:16px;
  justify-content:center;
  flex-wrap:wrap;
}

.primary-button {
  display:inline-block;
  padding:14px 32px;
  border:none;
  border-radius:12px;
  font-size:16px;
  cursor:pointer;
  transition:.2s;
}

.primary-button:hover {
  transform:translateY(-2px);
}

.secondary-button {
  background:transparent;
  color:#F9FAFB;
  border:1px solid #374151;
  padding:14px 32px;
  border-radius:12px;
  font-size:16px;
  transition:.2s;
}

.secondary-button:hover {
  border-color:#7C3AED;
  transform:translateY(-2px);
}

    </section>
  );
}