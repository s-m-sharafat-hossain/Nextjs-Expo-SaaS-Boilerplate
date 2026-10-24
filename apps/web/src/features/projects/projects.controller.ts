// apps/web/src/features/projects/projects.controller.ts
import { NextRequest } from "next/server";
import { ApiResponse } from "@/shared/utils/api-response";
import { ProjectsService } from "./projects.service";
import {
  CreateProjectSchema,
  UpdateProjectSchema,
  CreateTaskSchema,
  UpdateTaskSchema,
  MoveTaskSchema,
  CreateTimesheetSchema,
  CreateTaskCommentSchema,
} from "./projects.schema";

export class ProjectsController {
  // ── Projects ──

  static async listProjects(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get("workspaceId") || undefined;
    try {
      const projects = await ProjectsService.listProjects(workspaceId);
      return ApiResponse.success(projects, "Projects retrieved");
    } catch (err: any) {
      return ApiResponse.error(err.message, 500);
    }
  }

  static async getProject(id: string) {
    try {
      const project = await ProjectsService.getProjectDetails(id);
      return ApiResponse.success(project, "Project retrieved");
    } catch (err: any) {
      return ApiResponse.error(err.message, 404);
    }
  }

  static async createProject(req: NextRequest) {
    try {
      const body = await req.json();
      const parsed = CreateProjectSchema.safeParse(body);
      if (!parsed.success) {
        return ApiResponse.error(parsed.error.issues[0]?.message || "Invalid payload", 400);
      }
      const project = await ProjectsService.createProject(parsed.data);
      return ApiResponse.success(project, "Project created", 201);
    } catch (err: any) {
      return ApiResponse.error(err.message, 500);
    }
  }

  static async updateProject(id: string, req: NextRequest) {
    try {
      const body = await req.json();
      const parsed = UpdateProjectSchema.safeParse(body);
      if (!parsed.success) {
        return ApiResponse.error(parsed.error.issues[0]?.message || "Invalid payload", 400);
      }
      const updated = await ProjectsService.updateProject(id, parsed.data);
      return ApiResponse.success(updated, "Project updated");
    } catch (err: any) {
      return ApiResponse.error(err.message, 500);
    }
  }

  static async deleteProject(id: string) {
    try {
      await ProjectsService.deleteProject(id);
      return ApiResponse.success(null, "Project deleted");
    } catch (err: any) {
      return ApiResponse.error(err.message, 500);
    }
  }

  // ── Tasks ──

  static async listTasks(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");
    if (!projectId) return ApiResponse.error("Missing projectId", 400);

    try {
      const tasks = await ProjectsService.getProjectTasks(projectId);
      return ApiResponse.success(tasks, "Tasks retrieved");
    } catch (err: any) {
      return ApiResponse.error(err.message, 500);
    }
  }

  static async createTask(req: NextRequest) {
    try {
      const body = await req.json();
      const parsed = CreateTaskSchema.safeParse(body);
      if (!parsed.success) {
        return ApiResponse.error(parsed.error.issues[0]?.message || "Invalid payload", 400);
      }
      const task = await ProjectsService.createTask(parsed.data);
      return ApiResponse.success(task, "Task created", 201);
    } catch (err: any) {
      return ApiResponse.error(err.message, 500);
    }
  }

  static async updateTask(id: string, req: NextRequest) {
    try {
      const body = await req.json();
      const parsed = UpdateTaskSchema.safeParse(body);
      if (!parsed.success) {
        return ApiResponse.error(parsed.error.issues[0]?.message || "Invalid payload", 400);
      }
      const task = await ProjectsService.updateTask(id, parsed.data);
      return ApiResponse.success(task, "Task updated");
    } catch (err: any) {
      return ApiResponse.error(err.message, 500);
    }
  }

  static async moveTask(id: string, req: NextRequest) {
    try {
      const body = await req.json();
      const parsed = MoveTaskSchema.safeParse(body);
      if (!parsed.success) {
        return ApiResponse.error(parsed.error.issues[0]?.message || "Invalid payload", 400);
      }
      const task = await ProjectsService.moveTask(id, parsed.data);
      return ApiResponse.success(task, "Task moved");
    } catch (err: any) {
      return ApiResponse.error(err.message, 500);
    }
  }

  static async deleteTask(id: string) {
    try {
      await ProjectsService.deleteTask(id);
      return ApiResponse.success(null, "Task deleted");
    } catch (err: any) {
      return ApiResponse.error(err.message, 500);
    }
  }

  // ── Timesheets ──

  static async logTimesheet(userId: string, req: NextRequest) {
    try {
      const body = await req.json();
      const parsed = CreateTimesheetSchema.safeParse(body);
      if (!parsed.success) {
        return ApiResponse.error(parsed.error.issues[0]?.message || "Invalid payload", 400);
      }
      const entry = await ProjectsService.logTimesheet(userId, parsed.data);
      return ApiResponse.success(entry, "Timesheet logged", 201);
    } catch (err: any) {
      return ApiResponse.error(err.message, 500);
    }
  }

  static async getTimesheets(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId") || undefined;
    const userId = searchParams.get("userId") || undefined;
    try {
      const entries = await ProjectsService.getTimesheets({ projectId, userId });
      return ApiResponse.success(entries, "Timesheets retrieved");
    } catch (err: any) {
      return ApiResponse.error(err.message, 500);
    }
  }
}
