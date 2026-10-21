// apps/web/src/features/credits/credits.service.ts
import { CreditsRepository } from "./credits.repository";
import { DeductCreditsInput } from "./credits.schema";
import { AppError } from "@/shared/utils/error-handler";

export class CreditsService {
  static async getBalance(userId: string) {
    const credits = await CreditsRepository.getBalance(userId);
    const history = await CreditsRepository.getUsageHistory(userId);
    return { credits, history };
  }

  static async assertAndDeduct(userId: string, input: DeductCreditsInput) {
    const current = await CreditsRepository.getBalance(userId);
    if (current < input.cost) {
      throw new AppError(
        `Action requires ${input.cost} credits, but your balance is ${current}. Please top up your wallet.`,
        402
      );
    }

    try {
      return await CreditsRepository.deductCredits(userId, input.action, input.cost, input.metadata);
    } catch {
      throw new AppError("Failed to deduct credits. Insufficient balance.", 402);
    }
  }

  static async topUp(userId: string, amount: number) {
    return CreditsRepository.addCredits(userId, amount);
  }
}
