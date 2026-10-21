// apps/web/src/features/auth/auth.action.ts
"use server";

import { AuthService } from "./auth.service";
import { loginSchema, registerSchema, demoLoginSchema, LoginInput, RegisterInput, DemoLoginInput } from "./auth.schema";
import { revalidatePath } from "next/cache";

export async function loginAction(input: LoginInput) {
  try {
    const validated = loginSchema.parse(input);
    const result = await AuthService.login(validated);
    return { success: true, data: result };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to log in" };
  }
}

export async function registerAction(input: RegisterInput) {
  try {
    const validated = registerSchema.parse(input);
    const result = await AuthService.register(validated);
    return { success: true, data: result };
  } catch (err: any) {
    return { success: false, error: err.message || "Registration failed" };
  }
}

export async function demoLoginAction(input: DemoLoginInput) {
  try {
    const validated = demoLoginSchema.parse(input);
    const result = await AuthService.demoLogin(validated.role);
    return { success: true, data: result };
  } catch (err: any) {
    return { success: false, error: err.message || "Demo login failed" };
  }
}
