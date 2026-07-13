export default function DashboardHeader() {
  return (
    <header className="dashboard-header">

      <div className="dashboard-logo">
        🤖 <span>Project-AI</span>
      </div>

      <div className="dashboard-actions">

        <button className="header-profile">
        👤 Konto
      </button>

        <button className="header-button" aria-label="Ustawienia">
          ⚙️
        </button>

        <button className="header-profile">
          👤 Przemysław
        </button>

      </div>

    </header>
  );
}