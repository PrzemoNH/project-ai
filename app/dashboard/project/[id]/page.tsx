 import "../../dashboard.css";
import AuthGuard from "@/components/dashboard/AuthGuard";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import ProjectDetail from "@/components/dashboard/ProjectDetail";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <AuthGuard>
      <DashboardHeader />
      <main className="dashboard">
        <ProjectDetail projectId={id} />
      </main>
    </AuthGuard>
  );
}
