// apps/web/src/features/projects/projects.schema.ts
import { z } from "zod";

export const CreateProjectSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().max(1000).optional(),
  workspaceId: z.string().optional(),
  startDate: z.string().datetime().optional(),
  dueDate: z.string().datetime().optional(),
});

export const UpdateProjectSchema = CreateProjectSchema.partial().extend({
  status: z.enum(["ACTIVE", "COMPLETED", "ARCHIVED"]).optional(),
});

export const TaskStatusEnum = z.enum(["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"]);
export const TaskPriorityEnum = z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]);

export const CreateTaskSchema = z.object({
  projectId: z.string(),
  title: z.string().min(2).max(200),
  description: z.string().max(2000).optional(),
  status: TaskStatusEnum.default("TODO"),
  priority: TaskPriorityEnum.default("MEDIUM"),
  assigneeId: z.string().optional(),
  dueDate: z.string().datetime().optional(),
  order: z.number().int().default(0),
});

export const UpdateTaskSchema = CreateTaskSchema.partial();

export const MoveTaskSchema = z.object({
  status: TaskStatusEnum,
  order: z.number().int().optional(),
});

export const CreateTaskCommentSchema = z.object({
  taskId: z.string(),
  content: z.string().min(1).max(2000),
});

export const CreateTimesheetSchema = z.object({
  projectId: z.string(),
  taskId: z.string().optional(),
  hours: z.number().positive().max(24),
  description: z.string().max(500).optional(),
  date: z.string().datetime().optional(),
});

export type CreateProjectInput = z.infer<typeof CreateProjectSchema>;
export type UpdateProjectInput = z.infer<typeof UpdateProjectSchema>;
export type CreateTaskInput = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>;
export type MoveTaskInput = z.infer<typeof MoveTaskSchema>;
export type CreateTaskCommentInput = z.infer<typeof CreateTaskCommentSchema>;
export type CreateTimesheetInput = z.infer<typeof CreateTimesheetSchema>;
