// apps/web/src/shared/currency/converter.ts

export interface CurrencyConfig {
  code: string;
  symbol: string;
  name: string;
  flag: string;
  defaultRateToUsd: number; // Fallback baseline rate
}

export const SUPPORTED_CURRENCIES: Record<string, CurrencyConfig> = {
  USD: { code: "USD", symbol: "$", name: "US Dollar", flag: "🇺🇸", defaultRateToUsd: 1.0 },
  EUR: { code: "EUR", symbol: "€", name: "Euro", flag: "🇪🇺", defaultRateToUsd: 0.92 },
  GBP: { code: "GBP", symbol: "£", name: "British Pound", flag: "🇬🇧", defaultRateToUsd: 0.78 },
  BDT: { code: "BDT", symbol: "৳", name: "Bangladeshi Taka", flag: "🇧🇩", defaultRateToUsd: 119.5 },
  INR: { code: "INR", symbol: "₹", name: "Indian Rupee", flag: "🇮🇳", defaultRateToUsd: 83.4 },
  AED: { code: "AED", symbol: "AED", name: "UAE Dirham", flag: "🇦🇪", defaultRateToUsd: 3.67 },
  CAD: { code: "CAD", symbol: "CA$", name: "Canadian Dollar", flag: "🇨🇦", defaultRateToUsd: 1.36 },
  AUD: { code: "AUD", symbol: "AU$", name: "Australian Dollar", flag: "🇦🇺", defaultRateToUsd: 1.52 },
  JPY: { code: "JPY", symbol: "¥", name: "Japanese Yen", flag: "🇯🇵", defaultRateToUsd: 155.0 },
};

// 1-Hour in-memory & Redis cache for live FX rates
let ratesCache: { timestamp: number; rates: Record<string, number> } | null = null;
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

export class CurrencyConverter {
  /**
   * Fetch live foreign exchange rates with 1-hour caching
   */
  static async getExchangeRates(): Promise<Record<string, number>> {
    const now = Date.now();
    if (ratesCache && now - ratesCache.timestamp < CACHE_TTL_MS) {
      return ratesCache.rates;
    }

    try {
      // ExchangeRate-API free endpoint
      const res = await fetch("https://open.er-api.com/v6/latest/USD");
      if (res.ok) {
        const data = await res.json();
        if (data.rates) {
          ratesCache = { timestamp: now, rates: data.rates };
          return data.rates;
        }
      }
    } catch (err) {
      console.warn("[CurrencyConverter] Live FX API unavailable, using offline fallback rates:", err);
    }

    // Fallback baseline rates
    const fallbackRates: Record<string, number> = {};
    for (const [code, info] of Object.entries(SUPPORTED_CURRENCIES)) {
      fallbackRates[code] = info.defaultRateToUsd;
    }
    return fallbackRates;
  }

  /**
   * Convert an amount from one currency to another
   */
  static async convert(amount: number, fromCurrency = "USD", toCurrency = "USD"): Promise<number> {
    if (fromCurrency === toCurrency || amount === 0) return amount;

    const rates = await this.getExchangeRates();
    const fromRate = rates[fromCurrency.toUpperCase()] || 1.0;
    const toRate = rates[toCurrency.toUpperCase()] || 1.0;

    // Convert to USD base then to target
    const amountInUsd = amount / fromRate;
    const targetAmount = amountInUsd * toRate;

    return Math.round(targetAmount * 100) / 100;
  }

  /**
   * Format currency with localized symbol
   */
  static format(amount: number, currencyCode = "USD", locale = "en-US"): string {
    const config = SUPPORTED_CURRENCIES[currencyCode.toUpperCase()] || SUPPORTED_CURRENCIES.USD;
    try {
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: config.code,
        maximumFractionDigits: 2,
      }).format(amount);
    } catch {
      return `${config.symbol}${amount.toFixed(2)}`;
    }
  }
}
