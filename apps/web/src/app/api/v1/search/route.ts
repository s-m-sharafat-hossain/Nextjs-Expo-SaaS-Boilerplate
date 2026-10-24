// apps/web/src/app/api/v1/search/route.ts
import { NextRequest } from "next/server";
import { ApiResponse } from "@/shared/utils/api-response";
import { AdvancedSearchEngine } from "@/shared/search/search-engine";
import { auth } from "@/shared/lib/auth";
import type { SearchQueryParams } from "@/shared/search/elasticsearch";

/**
 * GET /api/v1/search
 * Query params: q, type, category, minPrice, maxPrice, minRating, location, page, limit
 * GET /api/v1/search?suggestions=true&q=<prefix>  → autocomplete suggestions
 * GET /api/v1/search?recent=true                   → recent searches for user
 * GET /api/v1/search?popular=true                  → popular searches
 * GET /api/v1/search?analytics=true                → analytics summary (admin)
 */
export async function GET(req: NextRequest) {
  const session = await auth();
  const { searchParams } = req.nextUrl;

  // — Autocomplete suggestions —
  if (searchParams.get("suggestions") === "true") {
    const prefix = searchParams.get("q") || "";
    const suggestions = AdvancedSearchEngine.getSuggestions(prefix, 8);
    return ApiResponse.success(suggestions, "Search suggestions");
  }

  // — Recent searches —
  if (searchParams.get("recent") === "true") {
    const userId = session?.user?.id;
    const recent = AdvancedSearchEngine.getRecentSearches(userId, 10);
    return ApiResponse.success(recent, "Recent searches");
  }

  // — Popular searches —
  if (searchParams.get("popular") === "true") {
    const popular = AdvancedSearchEngine.getPopularSearches(10);
    return ApiResponse.success(popular, "Popular searches");
  }

  // — Analytics (admin only) —
  if (searchParams.get("analytics") === "true") {
    const role = (session?.user as any)?.role;
    if (role !== "SUPER_ADMIN") {
      return ApiResponse.error("Forbidden", 403);
    }
    const summary = AdvancedSearchEngine.getAnalyticsSummary();
    return ApiResponse.success(summary, "Search analytics");
  }

  // — Main search —
  const params: SearchQueryParams = {
    query: searchParams.get("q") || "",
    type: searchParams.get("type") || undefined,
    category: searchParams.get("category") || undefined,
    minPrice: searchParams.has("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
    maxPrice: searchParams.has("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
    minRating: searchParams.has("minRating") ? Number(searchParams.get("minRating")) : undefined,
    location: searchParams.get("location") || undefined,
    page: searchParams.has("page") ? Math.max(1, Number(searchParams.get("page"))) : 1,
    limit: searchParams.has("limit") ? Math.min(50, Math.max(1, Number(searchParams.get("limit")))) : 20,
  };

  try {
    const userId = session?.user?.id;
    const result = await AdvancedSearchEngine.search(params, userId);
    return ApiResponse.success(result, "Search results", 200, {
      query: params.query,
      total: result.total,
      page: result.page,
    });
  } catch (err) {
    console.error("[SearchAPI] Error:", err);
    return ApiResponse.error("Search failed", 500);
  }
}

/**
 * POST /api/v1/search/click
 * Track click-through for a search result
 */
export async function POST(req: NextRequest) {
  const session = await auth();
  try {
    const body = await req.json();
    const { query, entityId } = body;
    if (!query || !entityId) {
      return ApiResponse.error("query and entityId are required", 400);
    }
    AdvancedSearchEngine.trackClick(query, entityId, session?.user?.id);
    return ApiResponse.success(null, "Click tracked");
  } catch {
    return ApiResponse.error("Invalid request body", 400);
  }
}
