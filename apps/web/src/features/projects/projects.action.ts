// apps/web/src/features/projects/projects.action.ts
"use server";

import { ProjectsService } from "./projects.service";
import {
  CreateProjectSchema,
  CreateTaskSchema,
  MoveTaskSchema,
  CreateTimesheetSchema,
  type CreateProjectInput,
  type CreateTaskInput,
  type MoveTaskInput,
  type CreateTimesheetInput,
} from "./projects.schema";
import { auth } from "@/shared/lib/auth";
import { revalidatePath } from "next/cache";

export async function createProjectAction(data: CreateProjectInput) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const validated = CreateProjectSchema.parse(data);
  const project = await ProjectsService.createProject(validated);
  revalidatePath("/provider/projects");
  return project;
}

export async function createTaskAction(data: CreateTaskInput) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const validated = CreateTaskSchema.parse(data);
  const task = await ProjectsService.createTask(validated);
  revalidatePath("/provider/projects");
  return task;
}

export async function moveTaskAction(id: string, data: MoveTaskInput) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const validated = MoveTaskSchema.parse(data);
  const task = await ProjectsService.moveTask(id, validated);
  revalidatePath("/provider/projects");
  return task;
}

export async function logTimesheetAction(data: CreateTimesheetInput) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const validated = CreateTimesheetSchema.parse(data);
  const entry = await ProjectsService.logTimesheet(session.user.id, validated);
  revalidatePath("/provider/projects");
  return entry;
}
