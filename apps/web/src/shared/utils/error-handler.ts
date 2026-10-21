// src/shared/utils/error-handler.ts
import { NextRequest } from "next/server";
import { ZodError } from "zod";
import { ApiResponse } from "./api-response";

export class AppError extends Error {
  constructor(public message: string, public statusCode: number = 400) {
    super(message);
  }
}

type RouteHandler = (req: NextRequest, context?: any) => Promise<Response>;

export const asyncHandler = (fn: RouteHandler): RouteHandler => {
  return async (req: NextRequest, context?: unknown) => {
    try {
      return await fn(req, context);
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        return ApiResponse.error("Validation Failed", 422, error.flatten().fieldErrors);
      }
      if (error instanceof AppError) {
        return ApiResponse.error(error.message, error.statusCode);
      }
      console.error("[GLOBAL_ERROR]:", error);
      return ApiResponse.error("Something went wrong on the server", 500);
    }
  };
};

export function handleApiError(error: unknown) {
  if (error instanceof ZodError) {
    return ApiResponse.error("Validation Failed", 422, error.flatten().fieldErrors);
  }
  if (error instanceof AppError) {
    return ApiResponse.error(error.message, error.statusCode);
  }
  const message = error instanceof Error ? error.message : "Internal Server Error";
  return ApiResponse.error(message, 500);
}

