// apps/web/src/app/api/v1/workspaces/route.ts
import { WorkspacesController } from "@/features/workspaces/workspaces.controller";

export const GET = WorkspacesController.index;
export const POST = WorkspacesController.store;
