import DashboardHeader from "@/components/dashboard/dashboard-header";
import DashboardCards from "@/components/dashboard/DashboardCards";
import RecentProjects from "@/components/dashboard/RecentProjects";

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

        <RecentProjects />

      </main>
    </>
  );
}