import Image from "next/image";
import Link from "next/link";

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

      <Link href="/login" className="dashboard-account">
        👤 Konto
      </Link>

    </header>
  );
}
