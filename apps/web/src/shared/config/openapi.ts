// src/shared/config/openapi.ts
import { siteConfig } from "@shared/config";

export const openApiSpec = {
  openapi: "3.0.0",
  info: {
    title: siteConfig.name,
    description: siteConfig.description,
    version: "1.0.0",
    contact: {
      name: "API Support",
      email: "support@example.com",
    },
  },
  servers: [
    {
      url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      description: "Development Server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      User: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          email: { type: "string", format: "email" },
          role: { type: "string", enum: ["ADMIN", "VENDOR", "CUSTOMER"] },
          plan: { type: "string", enum: ["FREE", "STARTER", "PRO", "AGENCY"] },
          credits: { type: "integer" },
        },
      },
      ApiResponse: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          statusCode: { type: "integer" },
          message: { type: "string" },
          data: { type: "object" },
        },
      },
      Error: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          statusCode: { type: "integer" },
          message: { type: "string" },
          errors: { type: "object" },
        },
      },
    },
  },
  paths: {
    "/api/v1/health": {
      get: {
        summary: "Health Check",
        description: "Check API and database health status",
        tags: ["Health"],
        responses: {
          "200": {
            description: "Health status",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiResponse" },
              },
            },
          },
        },
      },
    },
    "/api/v1/auth/demo": {
      post: {
        summary: "Demo Login",
        description: "Login with demo account for testing",
        tags: ["Authentication"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  role: {
                    type: "string",
                    enum: ["ADMIN", "VENDOR", "CUSTOMER"],
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Login successful",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiResponse" },
              },
            },
          },
        },
      },
    },
    "/api/v1/auth/register": {
      post: {
        summary: "Register User",
        description: "Create a new user account",
        tags: ["Authentication"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "email", "password"],
                properties: {
                  name: { type: "string" },
                  email: { type: "string", format: "email" },
                  password: { type: "string", minLength: 8 },
                  role: {
                    type: "string",
                    enum: ["ADMIN", "VENDOR", "CUSTOMER"],
                    default: "CUSTOMER",
                  },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "User created successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiResponse" },
              },
            },
          },
          "409": {
            description: "User already exists",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/api/v1/auth/login": {
      post: {
        summary: "Login User",
        description: "Authenticate user with email and password",
        tags: ["Authentication"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", format: "email" },
                  password: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Login successful",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiResponse" },
              },
            },
          },
          "401": {
            description: "Invalid credentials",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/api/v1/auth/password-reset/forgot": {
      post: {
        summary: "Forgot Password",
        description: "Request password reset email",
        tags: ["Authentication"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email"],
                properties: {
                  email: { type: "string", format: "email" },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Reset email sent",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiResponse" },
              },
            },
          },
        },
      },
    },
    "/api/v1/auth/password-reset/reset": {
      post: {
        summary: "Reset Password",
        description: "Reset password with token",
        tags: ["Authentication"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["token", "password"],
                properties: {
                  token: { type: "string" },
                  password: { type: "string", minLength: 8 },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Password reset successful",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiResponse" },
              },
            },
          },
        },
      },
    },
    "/api/v1/analytics": {
      get: {
        summary: "Get Revenue Metrics",
        description: "Retrieve SaaS revenue and growth metrics",
        tags: ["Analytics"],
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Metrics retrieved",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiResponse" },
              },
            },
          },
        },
      },
      post: {
        summary: "Track Event",
        description: "Track custom analytics event",
        tags: ["Analytics"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["event"],
                properties: {
                  event: { type: "string" },
                  properties: { type: "object" },
                  userId: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Event tracked",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiResponse" },
              },
            },
          },
        },
      },
    },
  },
  tags: [
    { name: "Health", description: "Health check endpoints" },
    { name: "Authentication", description: "User authentication" },
    { name: "Analytics", description: "Analytics and metrics" },
  ],
} as const;
