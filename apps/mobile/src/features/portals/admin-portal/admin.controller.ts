import { useState, useCallback, useEffect } from "react";
import { AdminMobileService } from "./admin.service";
import {
  AdminMetrics,
  KycVerificationItem,
  AdminPayoutItem,
  AdminManualTrxItem,
  DisputeItem,
} from "./admin.schema";

export type AdminPortalTab = "OVERVIEW" | "KYC" | "PAYOUTS" | "MANUAL_TRX" | "DISPUTES";

export const useAdminPortalController = () => {
  const [activeTab, setActiveTab] = useState<AdminPortalTab>("OVERVIEW");
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [kycList, setKycList] = useState<KycVerificationItem[]>([]);
  const [payoutList, setPayoutList] = useState<AdminPayoutItem[]>([]);
  const [manualTrxList, setManualTrxList] = useState<AdminManualTrxItem[]>([]);
  const [disputesList, setDisputesList] = useState<DisputeItem[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  /**
   * Load Admin Portal Data
   */
  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [m, kyc, payouts, manual, dsp] = await Promise.all([
        AdminMobileService.getMetrics(),
        AdminMobileService.getPendingKyc(),
        AdminMobileService.getPendingPayouts(),
        AdminMobileService.getManualTrx(),
        AdminMobileService.getDisputes(),
      ]);
      setMetrics(m);
      setKycList(kyc);
      setPayoutList(payouts);
      setManualTrxList(manual);
      setDisputesList(dsp);
    } catch (err: any) {
      setError(err?.message || "Failed to load admin portal metrics");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  /**
   * 1-Tap KYC Review Action
   */
  const handleReviewKyc = useCallback(
    async (id: string, status: "VERIFIED" | "REJECTED") => {
      setActionLoadingId(id);
      setError(null);
      try {
        await AdminMobileService.reviewKyc(id, status);
        setKycList((prev) => prev.filter((item) => item.id !== id));
        setSuccessMessage(`KYC status updated to ${status}`);
      } catch (err: any) {
        setError(err?.message || "Failed to update KYC status");
      } finally {
        setActionLoadingId(null);
      }
    },
    []
  );

  /**
   * 1-Tap Payout Action
   */
  const handleReviewPayout = useCallback(
    async (id: string, status: "APPROVED" | "REJECTED") => {
      setActionLoadingId(id);
      setError(null);
      try {
        await AdminMobileService.reviewPayout(id, status);
        setPayoutList((prev) => prev.filter((item) => item.id !== id));
        setSuccessMessage(`Payout request ${status.toLowerCase()} successfully`);
      } catch (err: any) {
        setError(err?.message || "Failed to process payout");
      } finally {
        setActionLoadingId(null);
      }
    },
    []
  );

  /**
   * 1-Tap Manual Trx Review
   */
  const handleReviewManualTrx = useCallback(
    async (id: string, status: "APPROVED" | "REJECTED") => {
      setActionLoadingId(id);
      setError(null);
      try {
        await AdminMobileService.reviewManualTrx(id, status);
        setManualTrxList((prev) => prev.filter((item) => item.id !== id));
        setSuccessMessage(`Manual transaction ${status.toLowerCase()}!`);
      } catch (err: any) {
        setError(err?.message || "Failed to process transaction reference");
      } finally {
        setActionLoadingId(null);
      }
    },
    []
  );

  /**
   * Resolve Dispute
   */
  const handleResolveDispute = useCallback(
    async (id: string, resolution: "RESOLVED_REFUNDED" | "RESOLVED_DISMISSED") => {
      setActionLoadingId(id);
      setError(null);
      try {
        await AdminMobileService.resolveDispute(id, resolution);
        setDisputesList((prev) => prev.filter((item) => item.id !== id));
        setSuccessMessage(
          resolution === "RESOLVED_REFUNDED"
            ? "Dispute resolved with full refund issued to consumer."
            : "Dispute dismissed."
        );
      } catch (err: any) {
        setError(err?.message || "Failed to resolve dispute");
      } finally {
        setActionLoadingId(null);
      }
    },
    []
  );

  return {
    activeTab,
    setActiveTab,
    metrics,
    kycList,
    payoutList,
    manualTrxList,
    disputesList,
    isLoading,
    actionLoadingId,
    error,
    successMessage,
    loadData,
    handleReviewKyc,
    handleReviewPayout,
    handleReviewManualTrx,
    handleResolveDispute,
  };
};
