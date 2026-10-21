// src/shared/config/i18n.ts
// Multi-Language / i18n Dictionary System (English + Bengali)

export type Locale = "en" | "bn";

export const dictionaries = {
  en: {
    nav: {
      home: "Home",
      dashboard: "Dashboard",
      pricing: "Pricing",
      login: "Login",
      register: "Get Started",
      logout: "Logout",
    },
    common: {
      credits: "Credits",
      plan: "Plan",
      upgrade: "Upgrade Plan",
      save: "Save Changes",
      cancel: "Cancel",
      loading: "Loading...",
      success: "Operation successful",
      error: "Something went wrong",
    },
    dashboard: {
      welcome: "Welcome back",
      activePlan: "Current Plan",
      availableCredits: "Available AI Credits",
      recentActivity: "Recent Activity",
      quickActions: "Quick Actions",
    },
    chat: {
      title: "AI Assistant",
      placeholder: "Type your message or prompt...",
      send: "Send",
      clear: "Clear Chat",
    },
  },
  bn: {
    nav: {
      home: "হোম",
      dashboard: "ড্যাশবোর্ড",
      pricing: "মূল্যতালিকা",
      login: "লগইন",
      register: "শুরু করুন",
      logout: "লগআউট",
    },
    common: {
      credits: "ক্রেডিট",
      plan: "প্ল্যান",
      upgrade: "প্ল্যান আপগ্রেড করুন",
      save: "সংরক্ষণ করুন",
      cancel: "বাতিল",
      loading: "লোড হচ্ছে...",
      success: "সফলভাবে সম্পন্ন হয়েছে",
      error: "একটি সমস্যা হয়েছে",
    },
    dashboard: {
      welcome: "ফিরে আসার জন্য স্বাগতম",
      activePlan: "বর্তমান প্ল্যান",
      availableCredits: "অবশিষ্ট AI ক্রেডিট",
      recentActivity: "সাম্প্রতিক কার্যক্রম",
      quickActions: "দ্রুত অ্যাকশন",
    },
    chat: {
      title: "এআই সহকারী",
      placeholder: "আপনার বার্তা বা প্রম্পট লিখুন...",
      send: "পাঠান",
      clear: "চ্যাট মুছুন",
    },
  },
} as const;

export type TranslationKey = keyof typeof dictionaries.en;

export function t<Section extends TranslationKey, Key extends keyof (typeof dictionaries.en)[Section]>(
  locale: Locale,
  section: Section,
  key: Key
): string {
  const dict = dictionaries[locale] ?? dictionaries.en;
  const sectionObj = dict[section] as Record<string, string>;
  return sectionObj?.[key as string] ?? (dictionaries.en[section] as Record<string, string>)[key as string] ?? String(key);
}
