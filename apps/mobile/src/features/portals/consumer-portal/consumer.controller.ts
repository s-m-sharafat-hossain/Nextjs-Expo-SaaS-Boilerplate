import { useState, useCallback, useEffect } from "react";
import { ConsumerMobileService } from "./consumer.service";
import {
  ConsumerServiceDiscoveryItem,
  ConsumerBookingTimelineItem,
  CreateBookingCheckoutInput,
  CreateBookingCheckoutSchema,
} from "./consumer.schema";

export type ConsumerPortalTab = "EXPLORE" | "TIMELINE" | "SAVED";

export const CATEGORIES = [
  "All",
  "Medical & Health",
  "Legal & Advisory",
  "Engineering & Tech",
];

export const useConsumerPortalController = () => {
  const [activeTab, setActiveTab] = useState<ConsumerPortalTab>("EXPLORE");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [services, setServices] = useState<ConsumerServiceDiscoveryItem[]>([]);
  const [timelines, setTimelines] = useState<ConsumerBookingTimelineItem[]>([]);

  // Slot Picker & Checkout Sheet State
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ConsumerServiceDiscoveryItem | null>(null);
  const [slotDate, setSlotDate] = useState("Tomorrow");
  const [slotTime, setSlotTime] = useState("10:00 AM");
  const [selectedGateway, setSelectedGateway] = useState<
    "STRIPE" | "PAYPAL" | "SSLCOMMERZ" | "BKASH" | "RAZORPAY" | "PAYSTACK" | "MANUAL_BANK"
  >("STRIPE");

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  /**
   * Load Services & Timelines
   */
  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [srvs, tls] = await Promise.all([
        ConsumerMobileService.getDiscoverServices(
          searchQuery,
          selectedCategory === "All" ? undefined : selectedCategory
        ),
        ConsumerMobileService.getBookingTimelines(),
      ]);
      setServices(srvs);
      setTimelines(tls);
    } catch (err: any) {
      setError(err?.message || "Failed to load services");
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedCategory]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  /**
   * 1-Tap Toggle Wishlist
   */
  const handleToggleWishlist = useCallback((serviceId: string) => {
    setServices((prev) =>
      prev.map((s) => (s.id === serviceId ? { ...s, isWishlisted: !s.isWishlisted } : s))
    );
  }, []);

  /**
   * Open Booking Checkout Modal
   */
  const handleOpenBooking = useCallback((service: ConsumerServiceDiscoveryItem) => {
    setSelectedService(service);
    setIsBookingModalOpen(true);
  }, []);

  /**
   * Execute Booking Checkout
   */
  const handleConfirmBooking = useCallback(async () => {
    if (!selectedService) return;
    setError(null);

    const input: CreateBookingCheckoutInput = {
      serviceId: selectedService.id,
      slotDate,
      slotTime,
      gateway: selectedGateway,
    };

    const validation = CreateBookingCheckoutSchema.safeParse(input);
    if (!validation.success) {
      setError(validation.error.issues[0]?.message || "Invalid booking slot details");
      return;
    }

    setIsSubmittingBooking(true);
    try {
      const res = await ConsumerMobileService.createBookingCheckout(validation.data);
      setIsBookingModalOpen(false);
      setSuccessMessage(`Appointment booked with ${selectedService.providerName}! Follow live status in Timeline.`);
      setActiveTab("TIMELINE");
    } catch (err: any) {
      setError(err?.message || "Failed to complete checkout");
    } finally {
      setIsSubmittingBooking(false);
    }
  }, [selectedService, slotDate, slotTime, selectedGateway]);

  // Filtered Services based on active tab
  const displayedServices =
    activeTab === "SAVED"
      ? services.filter((s) => s.isWishlisted)
      : services.filter((s) => {
          const matchCat =
            selectedCategory === "All" || s.category === selectedCategory;
          const matchQuery =
            !searchQuery ||
            s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.providerName.toLowerCase().includes(searchQuery.toLowerCase());
          return matchCat && matchQuery;
        });

  return {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    services: displayedServices,
    timelines,
    isBookingModalOpen,
    setIsBookingModalOpen,
    selectedService,
    slotDate,
    setSlotDate,
    slotTime,
    setSlotTime,
    selectedGateway,
    setSelectedGateway,
    isLoading,
    isSubmittingBooking,
    error,
    successMessage,
    loadData,
    handleToggleWishlist,
    handleOpenBooking,
    handleConfirmBooking,
  };
};
