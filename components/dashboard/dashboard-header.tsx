import Image from "next/image";

export default function DashboardHeader() {
  return (
    <header className="dashboard-header">

      <div className="dashboard-logo">

        <Image
          src="/images/logo/project-ai-logo.svg"
          alt="Project-AI"
          width={180}
          height={60}
          priority
        />

      </div>


      <button className="dashboard-account">
        👤 Konto ⚠️
      </button>


    </header>
  );
}