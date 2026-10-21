import { useState, useCallback, useEffect } from "react";
import { ProviderMobileService } from "./provider.service";
import {
  ProviderServiceListing,
  ProviderBookingQueueItem,
  ProviderScheduleSlot,
  ProviderKycUploadSchema,
  BookingStatusType,
} from "./provider.schema";

export type ProviderPortalTab = "QUEUE" | "SERVICES" | "SCHEDULE" | "KYC";

export const useProviderPortalController = () => {
  const [activeTab, setActiveTab] = useState<ProviderPortalTab>("QUEUE");
  const [listings, setListings] = useState<ProviderServiceListing[]>([]);
  const [bookings, setBookings] = useState<ProviderBookingQueueItem[]>([]);
  const [slots, setSlots] = useState<ProviderScheduleSlot[]>([]);

  // QR Verification State
  const [isQrScannerOpen, setIsQrScannerOpen] = useState(false);
  const [qrTokenInput, setQrTokenInput] = useState("");

  // KYC Upload State
  const [kycDocType, setKycDocType] = useState<"PASSPORT" | "NATIONAL_ID" | "MEDICAL_LICENSE">("MEDICAL_LICENSE");
  const [kycDocNumber, setKycDocNumber] = useState("");
  const [kycSubmitted, setKycSubmitted] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  /**
   * Load Provider Portal Data
   */
  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [l, b, s] = await Promise.all([
        ProviderMobileService.getListings(),
        ProviderMobileService.getBookingsQueue(),
        ProviderMobileService.getScheduleSlots(),
      ]);
      setListings(l);
      setBookings(b);
      setSlots(s);
    } catch (err: any) {
      setError(err?.message || "Failed to load provider workspace");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  /**
   * Toggle Listing Active State
   */
  const handleToggleListing = useCallback(async (id: string, currentActive: boolean) => {
    const newActive = !currentActive;
    setListings((prev) =>
      prev.map((item) => (item.id === id ? { ...item, active: newActive } : item))
    );
    try {
      await ProviderMobileService.toggleListingStatus(id, newActive);
      setSuccessMessage(`Listing ${newActive ? "activated" : "paused"} on marketplace.`);
    } catch {
      // Revert on failure
      setListings((prev) =>
        prev.map((item) => (item.id === id ? { ...item, active: currentActive } : item))
      );
    }
  }, []);

  /**
   * Update Booking Status (Accept / Complete / Reject)
   */
  const handleUpdateBookingStatus = useCallback(
    async (id: string, newStatus: BookingStatusType) => {
      setActionLoadingId(id);
      setError(null);
      try {
        await ProviderMobileService.updateBookingStatus(id, newStatus);
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
        );
        setSuccessMessage(`Booking marked as ${newStatus}!`);
      } catch (err: any) {
        setError(err?.message || "Failed to update booking status");
      } finally {
        setActionLoadingId(null);
      }
    },
    []
  );

  /**
   * Toggle Availability Slot
   */
  const handleToggleSlot = useCallback(async (slotId: string, currentActive: boolean) => {
    const newActive = !currentActive;
    setSlots((prev) =>
      prev.map((s) => (s.id === slotId ? { ...s, isActive: newActive } : s))
    );
    try {
      await ProviderMobileService.toggleScheduleSlot(slotId, newActive);
    } catch {
      setSlots((prev) =>
        prev.map((s) => (s.id === slotId ? { ...s, isActive: currentActive } : s))
      );
    }
  }, []);

  /**
   * Simulate QR Ticket Verification
   */
  const handleVerifyQr = useCallback(async (token: string) => {
    setError(null);
    try {
      const res = await ProviderMobileService.verifyQrTicket(token);
      if (res.valid) {
        setSuccessMessage("QR Ticket Verified! Patient/Client check-in confirmed.");
        setIsQrScannerOpen(false);
        setQrTokenInput("");
      } else {
        setError("Invalid or expired QR ticket token.");
      }
    } catch (err: any) {
      setError(err?.message || "QR verification failed");
    }
  }, []);

  /**
   * Upload KYC Verification
   */
  const handleUploadKyc = useCallback(async () => {
    setError(null);
    const validation = ProviderKycUploadSchema.safeParse({
      documentType: kycDocType,
      documentNumber: kycDocNumber,
      documentImageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400",
    });

    if (!validation.success) {
      setError(validation.error.issues[0]?.message || "Invalid document number");
      return;
    }

    setIsLoading(true);
    try {
      await ProviderMobileService.uploadKyc(validation.data);
      setKycSubmitted(true);
      setSuccessMessage("KYC documents uploaded successfully! Admin will review within 24 hours.");
    } catch (err: any) {
      setError(err?.message || "Failed to upload KYC documents");
    } finally {
      setIsLoading(false);
    }
  }, [kycDocType, kycDocNumber]);

  return {
    activeTab,
    setActiveTab,
    listings,
    bookings,
    slots,
    isQrScannerOpen,
    setIsQrScannerOpen,
    qrTokenInput,
    setQrTokenInput,
    kycDocType,
    setKycDocType,
    kycDocNumber,
    setKycDocNumber,
    kycSubmitted,
    isLoading,
    actionLoadingId,
    error,
    successMessage,
    loadData,
    handleToggleListing,
    handleUpdateBookingStatus,
    handleToggleSlot,
    handleVerifyQr,
    handleUploadKyc,
  };
};
