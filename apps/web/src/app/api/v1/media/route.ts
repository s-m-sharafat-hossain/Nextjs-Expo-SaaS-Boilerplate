// apps/web/src/app/api/v1/media/route.ts
import { MediaController } from "@/features/media/media.controller";

export const GET = MediaController.index;
export const POST = MediaController.store;
