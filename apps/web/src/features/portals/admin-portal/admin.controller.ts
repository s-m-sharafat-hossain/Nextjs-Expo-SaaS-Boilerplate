// apps/web/src/features/portals/admin-portal/admin.controller.ts
import { NextRequest } from "next/server";
import { AdminService } from "./admin.service";
import {
  reviewKycSchema,
  processPayoutSchema,
  verifyTransactionSchema,
  updateUserStatusSchema,
  getUsersFilterSchema,
} from "./admin.schema";
import { ApiResponse } from "@/shared/utils/api-response";
import { handleApiError } from "@/shared/utils/error-handler";

export class AdminController {
  static async getStats(req: NextRequest) {
    try {
      const stats = await AdminService.getPlatformStats();
      return ApiResponse.success(stats, "Platform statistics retrieved");
    } catch (error) {
      return handleApiError(error);
    }
  }

  static async getUsers(req: NextRequest) {
    try {
      const { searchParams } = new URL(req.url);
      const filter = getUsersFilterSchema.parse({
        search: searchParams.get("search") || undefined,
        role: searchParams.get("role") || undefined,
        page: searchParams.get("page") || 1,
        limit: searchParams.get("limit") || 20,
      });

      const users = await AdminService.getUsers(filter);
      return ApiResponse.success(users);
    } catch (error) {
      return handleApiError(error);
    }
  }

  static async updateUser(req: NextRequest) {
    try {
      const body = await req.json();
      const validated = updateUserStatusSchema.parse(body);
      const user = await AdminService.updateUser(validated);
      return ApiResponse.success(user, "User updated successfully");
    } catch (error) {
      return handleApiError(error);
    }
  }

  static async getKycs(req: NextRequest) {
    try {
      const { searchParams } = new URL(req.url);
      const status = searchParams.get("status") || undefined;
      const kycs = await AdminService.getKycs(status);
      return ApiResponse.success(kycs);
    } catch (error) {
      return handleApiError(error);
    }
  }

  static async reviewKyc(req: NextRequest) {
    try {
      const body = await req.json();
      const validated = reviewKycSchema.parse(body);
      const doc = await AdminService.reviewKyc(validated);
      return ApiResponse.success(doc, "KYC status updated successfully");
    } catch (error) {
      return handleApiError(error);
    }
  }

  static async getPayouts(req: NextRequest) {
    try {
      const { searchParams } = new URL(req.url);
      const status = searchParams.get("status") || undefined;
      const payouts = await AdminService.getPayoutRequests(status);
      return ApiResponse.success(payouts);
    } catch (error) {
      return handleApiError(error);
    }
  }

  static async processPayout(req: NextRequest) {
    try {
      const body = await req.json();
      const validated = processPayoutSchema.parse(body);
      const payout = await AdminService.processPayout(validated);
      return ApiResponse.success(payout, "Payout processed successfully");
    } catch (error) {
      return handleApiError(error);
    }
  }

  static async getTransactions(req: NextRequest) {
    try {
      const { searchParams } = new URL(req.url);
      const status = searchParams.get("status") || undefined;
      const transactions = await AdminService.getTransactions(status);
      return ApiResponse.success(transactions);
    } catch (error) {
      return handleApiError(error);
    }
  }

  static async verifyTransaction(req: NextRequest) {
    try {
      const body = await req.json();
      const validated = verifyTransactionSchema.parse(body);
      const trx = await AdminService.verifyTransaction(validated);
      return ApiResponse.success(trx, "Transaction verified successfully");
    } catch (error) {
      return handleApiError(error);
    }
  }
}
