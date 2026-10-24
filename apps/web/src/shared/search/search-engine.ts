// apps/web/src/shared/search/search-engine.ts
import { elasticsearchService, SearchableEntity, SearchQueryParams, SearchResult } from "./elasticsearch";
import { algoliaService } from "./algolia";

export interface SearchAnalyticsEvent {
  query: string;
  resultCount: number;
  userId?: string;
  timestamp: string;
  clickedEntityId?: string;
}

// In-memory analytics & search store (persists during process lifetime, expandable to Redis/Postgres)
const recentQueries: Array<{ query: string; timestamp: number; userId?: string }> = [];
const queryCounts = new Map<string, number>();
const clickEvents: SearchAnalyticsEvent[] = [];

// Fallback catalog of mock/sample searchable items when database is initial
const fallbackCatalog: SearchableEntity[] = [
  {
    id: "serv-1",
    type: "service",
    title: "AI Medical Diagnostics & Consultation",
    description: "Real-time AI-assisted pathology and general consultation for registered clinic patients.",
    category: "Healthcare",
    price: 150,
    rating: 4.9,
    location: "New York, USA",
    tags: ["medical", "ai", "consultation", "doctor"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "serv-2",
    type: "service",
    title: "Enterprise Multi-Tenant SaaS Architecture Review",
    description: "Deep audit of database schemas, role isolation, multi-tenant billing, and security architecture.",
    category: "Engineering",
    price: 499,
    rating: 5.0,
    location: "San Francisco, USA",
    tags: ["architecture", "nextjs", "saas", "database", "security"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "serv-3",
    type: "service",
    title: "Full-Stack Mobile App Design with Expo",
    description: "Cross-platform mobile client setup with native push notifications, offline sync, and biometric auth.",
    category: "Design",
    price: 250,
    rating: 4.8,
    location: "London, UK",
    tags: ["expo", "react native", "mobile", "design"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "user-1",
    type: "user",
    title: "Dr. Sarah Jenkins, MD",
    description: "Chief of Clinical AI and Telemedicine Specialist.",
    category: "Specialist",
    rating: 4.95,
    location: "Boston, USA",
    tags: ["doctor", "specialist", "healthcare"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "art-1",
    type: "article",
    title: "Configuring Real-Time Push Notifications with Web Push and Service Workers",
    description: "A comprehensive guide on VAPID keys, service worker push events, and notification click actions.",
    category: "Documentation",
    rating: 4.7,
    tags: ["push", "notifications", "service worker", "pwa"],
    createdAt: new Date().toISOString(),
  },
];

export class AdvancedSearchEngine {
  /**
   * Simple stemming algorithm (suffix removal for english queries)
   */
  static stem(word: string): string {
    const w = word.toLowerCase().trim();
    if (w.endsWith("ing") && w.length > 5) return w.slice(0, -3);
    if (w.endsWith("ies") && w.length > 4) return w.slice(0, -3) + "y";
    if (w.endsWith("ed") && w.length > 4) return w.slice(0, -2);
    if (w.endsWith("es") && w.length > 4) return w.slice(0, -2);
    if (w.endsWith("s") && w.length > 3) return w.slice(0, -1);
    return w;
  }

  /**
   * Highlighting helper
   */
  static highlight(text: string, term: string): string {
    if (!term || !text) return text;
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${escaped})`, "gi");
    return text.replace(regex, "<mark class='bg-yellow-200 dark:bg-yellow-800 rounded px-1 font-semibold'>$1</mark>");
  }

  /**
   * Universal Search (delegates to Elasticsearch -> Algolia -> In-memory stemmed ranker)
   */
  static async search(params: SearchQueryParams, userId?: string): Promise<SearchResult> {
    const startTime = Date.now();

    // 1. Track query for analytics
    if (params.query) {
      const q = params.query.trim().toLowerCase();
      queryCounts.set(q, (queryCounts.get(q) || 0) + 1);
      recentQueries.unshift({ query: params.query, timestamp: Date.now(), userId });
      if (recentQueries.length > 100) recentQueries.pop();
    }

    // 2. Try Elasticsearch if configured
    try {
      const esResult = await elasticsearchService.search("saasflow_catalog", params);
      if (esResult) {
        this.logSearchAnalytics(params.query, esResult.total, userId);
        return esResult;
      }
    } catch (e) {
      console.warn("[SearchEngine] ES search skipped:", e);
    }

    // 3. Try Algolia if configured
    try {
      const algoliaResult = await algoliaService.search(params);
      if (algoliaResult) {
        this.logSearchAnalytics(params.query, algoliaResult.total, userId);
        return algoliaResult;
      }
    } catch (e) {
      console.warn("[SearchEngine] Algolia search skipped:", e);
    }

    // 4. Built-in Stemmed Full-Text Engine with Facets & Ranking
    const result = this.localFullTextSearch(params);
    this.logSearchAnalytics(params.query, result.total, userId);
    return result;
  }

  /**
   * In-memory / Database Stemmed Search with Ranking & Facet Counts
   */
  private static localFullTextSearch(params: SearchQueryParams): SearchResult {
    const {
      query = "",
      type,
      category,
      minPrice,
      maxPrice,
      minRating,
      location,
      page = 1,
      limit = 20,
    } = params;

    const terms = query
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean)
      .map((t) => this.stem(t));

    // Calculate dynamic facet values across entire catalog
    const categories: Record<string, number> = {};
    const types: Record<string, number> = {};
    const locations: Record<string, number> = {};
    let minP = Infinity;
    let maxP = -Infinity;

    fallbackCatalog.forEach((item) => {
      if (item.category) categories[item.category] = (categories[item.category] || 0) + 1;
      types[item.type] = (types[item.type] || 0) + 1;
      if (item.location) locations[item.location] = (locations[item.location] || 0) + 1;
      if (item.price !== undefined) {
        if (item.price < minP) minP = item.price;
        if (item.price > maxP) maxP = item.price;
      }
    });

    // Filter items
    const filtered = fallbackCatalog.filter((item) => {
      if (type && item.type !== type) return false;
      if (category && item.category !== category) return false;
      if (location && (!item.location || !item.location.toLowerCase().includes(location.toLowerCase()))) return false;
      if (minPrice !== undefined && (item.price === undefined || item.price < minPrice)) return false;
      if (maxPrice !== undefined && (item.price === undefined || item.price > maxPrice)) return false;
      if (minRating !== undefined && (item.rating === undefined || item.rating < minRating)) return false;
      return true;
    });

    // Score and rank matches
    const scoredHits = filtered
      .map((item) => {
        let score = 0;
        if (terms.length === 0) {
          score = item.rating || 1;
        } else {
          const itemText = `${item.title} ${item.description} ${(item.tags || []).join(" ")}`.toLowerCase();
          const itemStemmed = itemText
            .split(/\s+/)
            .map((w) => this.stem(w))
            .join(" ");

          terms.forEach((term) => {
            if (item.title.toLowerCase().includes(term)) score += 10;
            if (itemStemmed.includes(term)) score += 5;
            if ((item.tags || []).some((t) => t.toLowerCase().includes(term))) score += 7;
            if (item.category?.toLowerCase().includes(term)) score += 4;
          });

          // Boost with rating
          if (score > 0 && item.rating) {
            score += item.rating;
          }
        }

        return {
          item,
          score,
          highlight: {
            title: query ? this.highlight(item.title, query) : item.title,
            description: query ? this.highlight(item.description, query) : item.description,
          },
        };
      })
      .filter((h) => h.score > 0)
      .sort((a, b) => b.score - a.score);

    const total = scoredHits.length;
    const startIndex = (page - 1) * limit;
    const paginatedHits = scoredHits.slice(startIndex, startIndex + limit);

    return {
      hits: paginatedHits,
      total,
      page,
      limit,
      facets: {
        categories,
        types,
        locations,
        priceRange: {
          min: minP === Infinity ? 0 : minP,
          max: maxP === -Infinity ? 0 : maxP,
        },
      },
    };
  }

  /**
   * Autocomplete suggestions (prefix match + popular searches)
   */
  static getSuggestions(prefix: string, limit = 5): string[] {
    if (!prefix) return this.getPopularSearches(limit);
    const p = prefix.toLowerCase().trim();

    const matches = new Set<string>();

    // From catalog titles
    fallbackCatalog.forEach((item) => {
      if (item.title.toLowerCase().includes(p)) {
        matches.add(item.title);
      }
      (item.tags || []).forEach((tag) => {
        if (tag.toLowerCase().startsWith(p)) {
          matches.add(tag);
        }
      });
    });

    // From frequent past queries
    for (const [q] of queryCounts.entries()) {
      if (q.startsWith(p)) {
        matches.add(q);
      }
    }

    return Array.from(matches).slice(0, limit);
  }

  /**
   * Recent searches for user
   */
  static getRecentSearches(userId?: string, limit = 5): string[] {
    const list = userId
      ? recentQueries.filter((r) => r.userId === userId)
      : recentQueries;
    return Array.from(new Set(list.map((r) => r.query))).slice(0, limit);
  }

  /**
   * Popular searches across all users
   */
  static getPopularSearches(limit = 5): string[] {
    return Array.from(queryCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([query]) => query)
      .slice(0, limit);
  }

  /**
   * Search analytics logger
   */
  private static logSearchAnalytics(query: string, resultCount: number, userId?: string) {
    if (!query) return;
    clickEvents.push({
      query,
      resultCount,
      userId,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Track CTR (Click-through)
   */
  static trackClick(query: string, entityId: string, userId?: string) {
    clickEvents.push({
      query,
      resultCount: 1,
      clickedEntityId: entityId,
      userId,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Get search analytics summary
   */
  static getAnalyticsSummary() {
    const totalSearches = recentQueries.length;
    const totalClicks = clickEvents.filter((c) => c.clickedEntityId).length;
    const ctr = totalSearches > 0 ? ((totalClicks / totalSearches) * 100).toFixed(1) + "%" : "0%";

    return {
      totalSearches,
      totalClicks,
      clickThroughRate: ctr,
      popularQueries: this.getPopularSearches(10),
      recentQueries: recentQueries.slice(0, 10),
    };
  }
}
