import "./dashboard.css";

import DashboardHeader from "@/components/dashboard/dashboard-header";
import DashboardCards from "@/components/dashboard/DashboardCards";
import RecentProjects from "@/components/dashboard/RecentProjects";
import Image from "next/image";

export default function Dashboard() {
  return (
    <>
      <DashboardHeader />

      <main className="dashboard">

        <div className="dashboard-background">
  <Image
    src="/images/logo/project-ai-icon-bg.svg"
    alt=""
    width={900}
    height={900}
    className="dashboard-bg"
    priority
  />
</div>

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