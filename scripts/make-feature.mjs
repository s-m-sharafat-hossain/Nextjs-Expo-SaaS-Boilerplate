// scripts/make-feature.mjs
// Usage: node scripts/make-feature.mjs appointment
// Or: npm run make:feature appointment

import fs from "fs";
import path from "path";

const featureName = process.argv[2]?.toLowerCase();
if (!featureName) {
  console.error("❌ Please provide a feature name! Example: npm run make:feature appointment");
  process.exit(1);
}

const PascalName = featureName
  .split("-")
  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  .join("");

const featureDir = path.join(process.cwd(), "apps", "web", "src", "features", featureName);
const apiDir = path.join(process.cwd(), "apps", "web", "src", "app", "api", "v1", `${featureName}s`);

fs.mkdirSync(featureDir, { recursive: true });
fs.mkdirSync(apiDir, { recursive: true });

// 1. Model / Schema (<feature>.schema.ts)
fs.writeFileSync(
  path.join(featureDir, `${featureName}.schema.ts`),
  `import { z } from "zod";

export const create${PascalName}Schema = z.object({
  title: z.string().min(2, "Title is required"),
  description: z.string().optional(),
});

export const update${PascalName}Schema = create${PascalName}Schema.partial();

export type Create${PascalName}Input = z.infer<typeof create${PascalName}Schema>;
export type Update${PascalName}Input = z.infer<typeof update${PascalName}Schema>;
`
);

// 2. Model / Repository (<feature>.repository.ts)
fs.writeFileSync(
  path.join(featureDir, `${featureName}.repository.ts`),
  `import { prisma } from "@/shared/lib/db";
import { Create${PascalName}Input, Update${PascalName}Input } from "./${featureName}.schema";

export class ${PascalName}Repository {
  /**
   * Enforces Tenant/Role Isolation
   */
  static async findAll(userId: string) {
    return [];
  }

  static async findById(id: string, userId: string) {
    return null;
  }

  static async create(data: Create${PascalName}Input, userId: string) {
    return { id: "demo-id", ...data, userId };
  }

  static async update(id: string, data: Update${PascalName}Input, userId: string) {
    return { id, ...data, userId };
  }

  static async delete(id: string, userId: string) {
    return true;
  }
}
`
);

// 3. Service (<feature>.service.ts)
fs.writeFileSync(
  path.join(featureDir, `${featureName}.service.ts`),
  `import { ${PascalName}Repository } from "./${featureName}.repository";
import { Create${PascalName}Input, Update${PascalName}Input } from "./${featureName}.schema";
import { AppError } from "@/shared/utils/error-handler";

export class ${PascalName}Service {
  static async list(userId: string) {
    return ${PascalName}Repository.findAll(userId);
  }

  static async getById(id: string, userId: string) {
    const item = await ${PascalName}Repository.findById(id, userId);
    if (!item) {
      throw new AppError("${PascalName} record not found", 404);
    }
    return item;
  }

  static async create(payload: Create${PascalName}Input, userId: string) {
    return ${PascalName}Repository.create(payload, userId);
  }

  static async update(id: string, payload: Update${PascalName}Input, userId: string) {
    await this.getById(id, userId);
    return ${PascalName}Repository.update(id, payload, userId);
  }

  static async remove(id: string, userId: string) {
    await this.getById(id, userId);
    return ${PascalName}Repository.delete(id, userId);
  }
}
`
);

// 4. Controller (<feature>.action.ts & <feature>.controller.ts)
fs.writeFileSync(
  path.join(featureDir, `${featureName}.action.ts`),
  `"use server";

import { ${PascalName}Service } from "./${featureName}.service";
import { create${PascalName}Schema, Create${PascalName}Input } from "./${featureName}.schema";
import { revalidatePath } from "next/cache";

export async function create${PascalName}Action(input: Create${PascalName}Input, userId: string) {
  try {
    const validated = create${PascalName}Schema.parse(input);
    const result = await ${PascalName}Service.create(validated, userId);
    revalidatePath("/admin");
    return { success: true, data: result };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to create ${PascalName}" };
  }
}
`
);

fs.writeFileSync(
  path.join(featureDir, `${featureName}.controller.ts`),
  `import { NextRequest } from "next/server";
import { ${PascalName}Service } from "./${featureName}.service";
import { create${PascalName}Schema } from "./${featureName}.schema";
import { ApiResponse } from "@/shared/utils/api-response";
import { asyncHandler } from "@/shared/utils/error-handler";

export class ${PascalName}Controller {
  static index = asyncHandler(async (req: NextRequest) => {
    const userId = req.headers.get("x-user-id") || "demo-user";
    const data = await ${PascalName}Service.list(userId);
    return ApiResponse.success(data, "${PascalName}s fetched successfully");
  });

  static store = asyncHandler(async (req: NextRequest) => {
    const userId = req.headers.get("x-user-id") || "demo-user";
    const body = await req.json();
    const validated = create${PascalName}Schema.parse(body);
    const created = await ${PascalName}Service.create(validated, userId);
    return ApiResponse.success(created, "${PascalName} created successfully", 201);
  });
}
`
);

// 5. View (<feature>.component.tsx)
fs.writeFileSync(
  path.join(featureDir, `${featureName}.component.tsx`),
  `"use client";

import { StandardPageShell } from "@/shared/layouts/StandardPageShell";

export function ${PascalName}View() {
  return (
    <StandardPageShell
      title="${PascalName} Management"
      description="Manage all ${featureName} operations with strict role isolation."
      breadcrumbs={[
        { label: "Dashboard", href: "/admin" },
        { label: "${PascalName}s" },
      ]}
    >
      <div className="p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
        <p className="text-sm text-gray-500">
          ${PascalName} view component initialized with StandardPageShell.
        </p>
      </div>
    </StandardPageShell>
  );
}
`
);

// 6. REST API Route
fs.writeFileSync(
  path.join(apiDir, `route.ts`),
  `import { ${PascalName}Controller } from "@/features/${featureName}/${featureName}.controller";

export const GET = ${PascalName}Controller.index;
export const POST = ${PascalName}Controller.store;
`
);

console.log(`✅ Feature '${featureName}' successfully generated inside 'apps/web/src/features/${featureName}/'!`);
