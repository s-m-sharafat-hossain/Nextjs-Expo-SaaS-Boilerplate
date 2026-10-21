// src/shared/utils/api-response.ts
import { NextResponse } from "next/server";

export class ApiResponse {
  static success<T>(data: T, message = "Success", statusCode = 200, meta?: Record<string, unknown>) {
    return NextResponse.json(
      {
        success: true,
        statusCode,
        message,
        data,
        ...(meta ? { meta } : {}),
      },
      { status: statusCode }
    );
  }

  static error(message = "Internal Server Error", statusCode = 500, errors?: unknown) {
    return NextResponse.json(
      {
        success: false,
        statusCode,
        message,
        ...(errors !== undefined && errors !== null ? { errors } : {}),
      },
      { status: statusCode }
    );
  }
}
