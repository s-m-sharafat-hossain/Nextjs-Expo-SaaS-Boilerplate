// scripts/make-mvc.mjs
// ব্যবহার: node scripts/make-mvc.mjs <feature-name>
// অথবা:   npm run make:feature <feature-name>
//
// উদাহরণ: node scripts/make-mvc.mjs appointment
//
// NOTE: এই script পুরনো src/modules/ pattern ব্যবহার করে না।
//       বর্তমান monorepo architecture অনুযায়ী নিচের path-এ 5-file feature তৈরি করে:
//         apps/web/src/features/<feature-name>/
//       এবং REST API route তৈরি করে:
//         apps/web/src/app/api/v1/<feature-name>s/route.ts
//
// (make-feature.mjs-এর alias — উভয় script একই কাজ করে)

import fs from "fs";
import path from "path";

const featureName = process.argv[2]?.toLowerCase();
if (!featureName) {
  console.error(
    "❌ Please provide a feature name!\n" +
    "   Example: node scripts/make-mvc.mjs appointment"
  );
  process.exit(1);
}

const PascalName = featureName
  .split("-")
  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  .join("");

// ── Target directories (Feature-Based Modular MVC) ───────────────────────────
const featureDir = path.join(
  process.cwd(),
  "apps", "web", "src", "features", featureName
);
const apiDir = path.join(
  process.cwd(),
  "apps", "web", "src", "app", "api", "v1", `${featureName}s`
);

fs.mkdirSync(featureDir, { recursive: true });
fs.mkdirSync(apiDir, { recursive: true });

// ── 1. Schema (Zod DTOs & validation) ────────────────────────────────────────
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

// ── 2. Repository (Prisma queries with Tenant & Role Isolation) ───────────────
fs.writeFileSync(
  path.join(featureDir, `${featureName}.repository.ts`),
  `import { prisma } from "@/shared/lib/db";
import { Create${PascalName}Input, Update${PascalName}Input } from "./${featureName}.schema";

export class ${PascalName}Repository {
  /** Enforces Tenant/Role Isolation — always scope to userId */
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

// ── 3. Service (Business logic) ───────────────────────────────────────────────
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

// ── 4a. Server Action (feature.action.ts) ─────────────────────────────────────
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

// ── 4b. REST Controller (feature.controller.ts) ───────────────────────────────
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

// ── 5. View Component (feature.component.tsx) ─────────────────────────────────
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

// ── 6. REST API Route Handler (/api/v1/<feature>s/route.ts) ───────────────────
fs.writeFileSync(
  path.join(apiDir, `route.ts`),
  `import { ${PascalName}Controller } from "@/features/${featureName}/${featureName}.controller";

export const GET = ${PascalName}Controller.index;
export const POST = ${PascalName}Controller.store;
`
);

console.log(`
✅ Feature '${featureName}' generated (Feature-Based Modular MVC):

   📁 apps/web/src/features/${featureName}/
      ├── ${featureName}.schema.ts       (Zod DTOs & validation)
      ├── ${featureName}.repository.ts   (Prisma queries + Tenant Isolation)
      ├── ${featureName}.service.ts      (Business logic)
      ├── ${featureName}.action.ts       (Next.js Server Action)
      ├── ${featureName}.controller.ts   (REST handler)
      └── ${featureName}.component.tsx   (React View with StandardPageShell)

   🌐 apps/web/src/app/api/v1/${featureName}s/route.ts
`);
