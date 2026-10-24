// apps/web/src/features/projects/projects.service.ts
import { ProjectsRepository } from "./projects.repository";
import type {
  CreateProjectInput,
  UpdateProjectInput,
  CreateTaskInput,
  UpdateTaskInput,
  MoveTaskInput,
  CreateTaskCommentInput,
  CreateTimesheetInput,
} from "./projects.schema";

export class ProjectsService {
  static async listProjects(workspaceId?: string) {
    return ProjectsRepository.findProjectsByWorkspace(workspaceId);
  }

  static async getProjectDetails(id: string) {
    const project = await ProjectsRepository.findProjectById(id);
    if (!project) throw new Error("Project not found");
    return project;
  }

  static async createProject(data: CreateProjectInput) {
    return ProjectsRepository.createProject(data);
  }

  static async updateProject(id: string, data: UpdateProjectInput) {
    return ProjectsRepository.updateProject(id, data);
  }

  static async deleteProject(id: string) {
    return ProjectsRepository.deleteProject(id);
  }

  static async getProjectTasks(projectId: string) {
    return ProjectsRepository.findTasksByProject(projectId);
  }

  static async createTask(data: CreateTaskInput) {
    return ProjectsRepository.createTask(data);
  }

  static async updateTask(id: string, data: UpdateTaskInput) {
    return ProjectsRepository.updateTask(id, data);
  }

  static async moveTask(id: string, data: MoveTaskInput) {
    return ProjectsRepository.moveTaskStatus(id, data);
  }

  static async deleteTask(id: string) {
    return ProjectsRepository.deleteTask(id);
  }

  static async addComment(userId: string, data: CreateTaskCommentInput) {
    return ProjectsRepository.addComment(userId, data);
  }

  static async logTimesheet(userId: string, data: CreateTimesheetInput) {
    return ProjectsRepository.logTimesheet(userId, data);
  }

  static async getTimesheets(options: { projectId?: string; userId?: string }) {
    return ProjectsRepository.getTimesheets(options);
  }
}
