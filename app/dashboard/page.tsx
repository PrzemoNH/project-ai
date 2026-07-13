import DashboardHeader from "@/components/dashboard-header";
import DashboardCards from "@/components/dashboard/DashboardCards";

export default function Dashboard() {
  return (
    <>
      <DashboardHeader />

      <main className="dashboard">

        <h1>
          Witaj w Project-AI 👋
        </h1>

        <p className="dashboard-subtitle">
          Zacznij tworzyć lub kontynuuj swoje projekty.
        </p>


        <DashboardCards />


        <section className="projects-box">

          <h2>
            Ostatnie projekty
          </h2>

          <button>
            + Nowy projekt
          </button>

        </section>


      </main>
    </>
  );
}