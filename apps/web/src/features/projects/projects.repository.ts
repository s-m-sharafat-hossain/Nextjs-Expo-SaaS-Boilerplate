// apps/web/src/features/projects/projects.repository.ts
import { prisma } from "@/shared/lib/prisma";
import type {
  CreateProjectInput,
  UpdateProjectInput,
  CreateTaskInput,
  UpdateTaskInput,
  MoveTaskInput,
  CreateTaskCommentInput,
  CreateTimesheetInput,
} from "./projects.schema";

export class ProjectsRepository {
  // ── Projects ──

  static async findProjectsByWorkspace(workspaceId?: string) {
    return prisma.project.findMany({
      where: workspaceId ? { workspaceId } : {},
      include: {
        _count: { select: { tasks: true } },
      },
      orderBy: { updatedAt: "desc" },
    });
  }

  static async findProjectById(id: string) {
    return prisma.project.findUnique({
      where: { id },
      include: {
        tasks: {
          include: {
            assignee: { select: { id: true, name: true, image: true } },
            _count: { select: { comments: true } },
          },
          orderBy: { order: "asc" },
        },
      },
    });
  }

  static async createProject(data: CreateProjectInput) {
    return prisma.project.create({
      data: {
        name: data.name,
        description: data.description,
        workspaceId: data.workspaceId,
        startDate: data.startDate ? new Date(data.startDate) : null,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
      },
    });
  }

  static async updateProject(id: string, data: UpdateProjectInput) {
    return prisma.project.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.status && { status: data.status }),
        ...(data.startDate && { startDate: new Date(data.startDate) }),
        ...(data.dueDate && { dueDate: new Date(data.dueDate) }),
      },
    });
  }

  static async deleteProject(id: string) {
    return prisma.project.delete({ where: { id } });
  }

  // ── Tasks ──

  static async findTasksByProject(projectId: string) {
    return prisma.task.findMany({
      where: { projectId },
      include: {
        assignee: { select: { id: true, name: true, image: true } },
        _count: { select: { comments: true } },
      },
      orderBy: [{ status: "asc" }, { order: "asc" }],
    });
  }

  static async findTaskById(id: string) {
    return prisma.task.findUnique({
      where: { id },
      include: {
        assignee: { select: { id: true, name: true, image: true } },
        comments: {
          include: { user: { select: { id: true, name: true, image: true } } },
          orderBy: { createdAt: "asc" },
        },
      },
    });
  }

  static async createTask(data: CreateTaskInput) {
    return prisma.task.create({
      data: {
        projectId: data.projectId,
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        assigneeId: data.assigneeId,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        order: data.order,
      },
      include: {
        assignee: { select: { id: true, name: true, image: true } },
      },
    });
  }

  static async updateTask(id: string, data: UpdateTaskInput) {
    return prisma.task.update({
      where: { id },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.status && { status: data.status }),
        ...(data.priority && { priority: data.priority }),
        ...(data.assigneeId !== undefined && { assigneeId: data.assigneeId }),
        ...(data.dueDate && { dueDate: new Date(data.dueDate) }),
        ...(data.order !== undefined && { order: data.order }),
      },
      include: {
        assignee: { select: { id: true, name: true, image: true } },
      },
    });
  }

  static async moveTaskStatus(id: string, data: MoveTaskInput) {
    return prisma.task.update({
      where: { id },
      data: {
        status: data.status,
        ...(data.order !== undefined && { order: data.order }),
      },
    });
  }

  static async deleteTask(id: string) {
    return prisma.task.delete({ where: { id } });
  }

  // ── Comments ──

  static async addComment(userId: string, data: CreateTaskCommentInput) {
    return prisma.taskComment.create({
      data: {
        taskId: data.taskId,
        userId,
        content: data.content,
      },
      include: {
        user: { select: { id: true, name: true, image: true } },
      },
    });
  }

  // ── Timesheets ──

  static async logTimesheet(userId: string, data: CreateTimesheetInput) {
    return prisma.timesheetEntry.create({
      data: {
        projectId: data.projectId,
        taskId: data.taskId,
        userId,
        hours: data.hours,
        description: data.description,
        date: data.date ? new Date(data.date) : new Date(),
      },
      include: {
        user: { select: { id: true, name: true } },
        project: { select: { id: true, name: true } },
      },
    });
  }

  static async getTimesheets(options: { projectId?: string; userId?: string }) {
    const where: any = {};
    if (options.projectId) where.projectId = options.projectId;
    if (options.userId) where.userId = options.userId;

    return prisma.timesheetEntry.findMany({
      where,
      include: {
        user: { select: { id: true, name: true } },
        task: { select: { id: true, title: true } },
        project: { select: { id: true, name: true } },
      },
      orderBy: { date: "desc" },
    });
  }
}
