// apps/web/src/app/(dashboard)/provider/projects/page.tsx
import { StandardPageShell } from "@/shared/layouts/StandardPageShell";
import { auth } from "@/shared/lib/auth";
import { redirect } from "next/navigation";
import { ProjectsService } from "@/features/projects/projects.service";
import { KanbanBoard } from "@/features/projects/components/KanbanBoard";
import { TimesheetLogger } from "@/features/projects/components/TimesheetLogger";

export const metadata = {
  title: "Projects & Tasks — Workspace Dashboard",
  description: "Collaborative project management, Kanban task workflow, and work hour timesheets.",
};

export default async function ProviderProjectsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  // Find or create default workspace project
  let projects = await ProjectsService.listProjects();

  let activeProject = projects[0];

  if (!activeProject) {
    // Seed initial project
    activeProject = (await ProjectsService.createProject({
      name: "SaaS Launch Roadmap",
      description: "Core roadmap deliverables for release v1.0",
    })) as any;

    // Seed sample tasks
    await Promise.all([
      ProjectsService.createTask({
        projectId: activeProject.id,
        title: "Setup Stripe Webhooks & Metering",
        description: "Configure Stripe secret keys and test metered billing events.",
        status: "TODO",
        priority: "HIGH",
        order: 0,
      }),
      ProjectsService.createTask({
        projectId: activeProject.id,
        title: "Implement Domain DNS Verification",
        description: "Add CNAME check for custom tenant domains with automatic SSL status.",
        status: "IN_PROGRESS",
        priority: "URGENT",
        order: 0,
      }),
      ProjectsService.createTask({
        projectId: activeProject.id,
        title: "Review Security Headers & Rate Limits",
        description: "Verify Upstash Redis rate limit token bucket and CSRF protections.",
        status: "IN_REVIEW",
        priority: "MEDIUM",
        order: 0,
      }),
      ProjectsService.createTask({
        projectId: activeProject.id,
        title: "Setup Sentry Client & Server Monitoring",
        description: "Instrument global ErrorBoundary and traces performance tracking.",
        status: "DONE",
        priority: "LOW",
        order: 0,
      }),
    ]);
  }

  const projectDetails = await ProjectsService.getProjectDetails(activeProject.id);
  const timesheetEntries = await ProjectsService.getTimesheets({ projectId: activeProject.id });

  return (
    <StandardPageShell
      title="Projects & Workflows"
      description="Collaborate with your team, move tasks across Kanban stages, and track development hours."
    >
      <div className="space-y-8">
        {/* Kanban Board View */}
        <KanbanBoard
          projectId={activeProject.id}
          projectName={activeProject.name}
          initialTasks={projectDetails.tasks as any}
        />

        {/* Timesheet Section */}
        <TimesheetLogger
          projectId={activeProject.id}
          initialEntries={timesheetEntries as any}
        />
      </div>
    </StandardPageShell>
  );
}
