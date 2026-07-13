import Image from "next/image";

export default function DashboardHeader() {
  return (
    <header className="dashboard-header">

      <Image
        src="/images/logo/project-ai-logo.svg"
        alt="Project-AI"
        width={220}
        height={65}
        className="dashboard-logo"
        priority
      />

      <button className="dashboard-account">
        👤 Konto ⚠️
      </button>

    </header>
  );
}