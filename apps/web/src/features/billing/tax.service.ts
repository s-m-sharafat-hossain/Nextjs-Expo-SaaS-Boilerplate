// apps/web/src/features/billing/tax.service.ts
import Stripe from "stripe";

export interface TaxCalculationParams {
  amount: number;
  currency: string;
  countryCode: string;
  stateOrProvince?: string;
  postalCode?: string;
}

export interface TaxCalculationResult {
  taxableAmount: number;
  taxRatePercent: number;
  taxAmount: number;
  totalWithTax: number;
  jurisdiction: string;
  provider: "STRIPE_TAX" | "LOCAL_TABLE";
}

// Fallback standard VAT / Sales Tax rates by ISO country code
const COUNTRY_TAX_RATES: Record<string, { rate: number; name: string }> = {
  US: { rate: 7.5, name: "US State & Local Average" },
  CA: { rate: 13.0, name: "Canada HST/GST Average" },
  GB: { rate: 20.0, name: "UK Standard VAT" },
  DE: { rate: 19.0, name: "Germany MwSt" },
  FR: { rate: 20.0, name: "France TVA" },
  NL: { rate: 21.0, name: "Netherlands BTW" },
  ES: { rate: 21.0, name: "Spain IVA" },
  IT: { rate: 22.0, name: "Italy IVA" },
  AU: { rate: 10.0, name: "Australia GST" },
  IN: { rate: 18.0, name: "India GST" },
  JP: { rate: 10.0, name: "Japan Consumption Tax" },
  SG: { rate: 9.0, name: "Singapore GST" },
};

export class TaxService {
  private static stripeClient: Stripe | null = null;

  private static getStripe(): Stripe | null {
    if (this.stripeClient) return this.stripeClient;
    const key = process.env.STRIPE_SECRET_KEY;
    if (key && !key.includes("placeholder")) {
      this.stripeClient = new Stripe(key, { apiVersion: "2024-11-20.acacia" as any });
    }
    return this.stripeClient;
  }

  /**
   * Calculate sales tax / VAT using Stripe Tax with localized fallback
   */
  static async calculateTax(params: TaxCalculationParams): Promise<TaxCalculationResult> {
    const { amount, currency, countryCode, stateOrProvince, postalCode } = params;
    const stripe = this.getStripe();

    if (stripe) {
      try {
        const calculation = await stripe.tax.calculations.create({
          currency: currency.toLowerCase(),
          line_items: [
            {
              amount: Math.round(amount * 100),
              reference: "saas_subscription",
              tax_code: "txcd_10000000", // General electronically supplied services
            },
          ],
          customer_details: {
            address: {
              country: countryCode.toUpperCase(),
              state: stateOrProvince,
              postal_code: postalCode,
            },
            address_source: "shipping",
          },
        });

        const taxAmount = (calculation.tax_amount_exclusive + calculation.tax_amount_inclusive) / 100;
        const taxRate = amount > 0 ? (taxAmount / amount) * 100 : 0;

        return {
          taxableAmount: amount,
          taxRatePercent: Math.round(taxRate * 100) / 100,
          taxAmount: Math.round(taxAmount * 100) / 100,
          totalWithTax: Math.round((amount + taxAmount) * 100) / 100,
          jurisdiction: (calculation as any).jurisdiction || countryCode,
          provider: "STRIPE_TAX",
        };
      } catch (err: any) {
        console.warn("[TaxService] Stripe Tax API failed, using fallback:", err.message);
      }
    }

    // Local fallback
    const fallback = COUNTRY_TAX_RATES[countryCode.toUpperCase()] || { rate: 0, name: "Zero Rate / Exempt" };
    const taxAmount = Math.round(((amount * fallback.rate) / 100) * 100) / 100;

    return {
      taxableAmount: amount,
      taxRatePercent: fallback.rate,
      taxAmount,
      totalWithTax: Math.round((amount + taxAmount) * 100) / 100,
      jurisdiction: `${countryCode.toUpperCase()} (${fallback.name})`,
      provider: "LOCAL_TABLE",
    };
  }
}
