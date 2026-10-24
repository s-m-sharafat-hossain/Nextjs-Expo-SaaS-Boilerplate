// packages/shared/types/index.ts

export type RoleType = "SUPER_ADMIN" | "ADMIN" | "PROVIDER" | "CONSUMER";

export type PaymentGatewayType =
  | "STRIPE"       // USA, UK, Europe, Global
  | "PAYPAL"       // Global
  | "SSLCOMMERZ"   // Bangladesh (Cards + Mobile Banking)
  | "BKASH"        // Bangladesh (Direct Mobile Wallet)
  | "RAZORPAY"     // India
  | "PAYSTACK"     // Africa (Nigeria, Ghana, South Africa)
  | "MANUAL_BANK"; // Universal (Bank Transfer / Crypto USDT / Manual TrxID)

export type MarketplaceNiche =
  | "generic-saas"
  | "telemedicine-doctor"
  | "multi-vendor-ecommerce"
  | "property-rental"
  | "online-tutoring";

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  credits: number;
  period: "monthly" | "yearly" | "one-time";
  popular?: boolean;
  features: string[];
}

export interface DemoAccount {
  role: RoleType;
  email: string;
  label: string;
  description: string;
  path: string;
}

export interface SupportedGateway {
  id: PaymentGatewayType;
  name: string;
  icon: string;
  isDirect: boolean;
}

export type ThemeMode = "light" | "dark" | "system";
export type TabBarStyle = "floating" | "standard";

export interface RoleDetail {
  singular: string;
  plural: string;
  badge?: string;
  badgeColor?: string;
  portalTitle: string;
  portalPath: string;
  description?: string;
  serviceUnitName?: string;
  earningsUnitName?: string;
  bookingUnitName?: string;
}

export interface BrandConfig {
  name: string;
  shortName: string;
  description: string;
  niche: MarketplaceNiche;
  url: string;
  ogImage: string;
  favicon?: string;
  logo: {
    dark: string;
    light: string;
    square: string;
  };
}

export interface CurrencyConfig {
  code: string;
  symbol: string;
  taxPercentage: number;
}

export interface BillingConfig {
  currency: {
    code: string;
    symbol: string;
  };
  taxPercentage: number;
  platformCommissionPercent: number;
}

export interface GatewayMetadata {
  id: PaymentGatewayType;
  name: string;
  category: "card" | "wallet" | "bank" | "crypto";
  countries: string[];
  currencies: string[];
  isInstant: boolean;
  requiresTrxId: boolean;
  instructions?: string;
}
