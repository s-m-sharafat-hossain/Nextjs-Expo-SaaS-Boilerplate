// apps/web/src/shared/components/AdvancedSearchBar.tsx
"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Search,
  X,
  Clock,
  TrendingUp,
  SlidersHorizontal,
  Star,
  MapPin,
  Tag,
  ChevronRight,
} from "lucide-react";

interface SearchResult {
  id: string;
  type: string;
  title: string;
  description: string;
  category?: string;
  price?: number;
  rating?: number;
  location?: string;
  highlight?: { title?: string; description?: string };
}

interface Facets {
  categories: Record<string, number>;
  types: Record<string, number>;
  locations: Record<string, number>;
  priceRange: { min: number; max: number };
}

interface SearchResponse {
  hits: Array<{ item: SearchResult; score: number; highlight?: { title?: string; description?: string } }>;
  total: number;
  page: number;
  limit: number;
  facets: Facets;
}

interface Filters {
  type?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  location?: string;
}

export function AdvancedSearchBar({ placeholder = "Search services, providers, articles…" }: { placeholder?: string }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [popularSearches, setPopularSearches] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>({});
  const [page, setPage] = useState(1);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load initial data
  useEffect(() => {
    fetch("/api/v1/search?recent=true")
      .then((r) => r.json())
      .then((r) => setRecentSearches(r.data || []));
    fetch("/api/v1/search?popular=true")
      .then((r) => r.json())
      .then((r) => setPopularSearches(r.data || []));
  }, []);

  // Click outside to close
  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const fetchSuggestions = useCallback(async (prefix: string) => {
    if (!prefix || prefix.length < 2) {
      setSuggestions([]);
      return;
    }
    const res = await fetch(`/api/v1/search?suggestions=true&q=${encodeURIComponent(prefix)}`);
    const json = await res.json();
    setSuggestions(json.data || []);
  }, []);

  const executeSearch = useCallback(
    async (q: string, f: Filters = {}, p = 1) => {
      setIsLoading(true);
      setPage(p);
      const params = new URLSearchParams({ q, page: String(p), limit: "10" });
      if (f.type) params.set("type", f.type);
      if (f.category) params.set("category", f.category);
      if (f.minPrice !== undefined) params.set("minPrice", String(f.minPrice));
      if (f.maxPrice !== undefined) params.set("maxPrice", String(f.maxPrice));
      if (f.minRating !== undefined) params.set("minRating", String(f.minRating));
      if (f.location) params.set("location", f.location);

      try {
        const res = await fetch(`/api/v1/search?${params}`);
        const json = await res.json();
        setResults(json.data || null);
      } catch {
        setResults(null);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const handleInputChange = (value: string) => {
    setQuery(value);
    setIsOpen(true);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (value.trim().length >= 2) {
        fetchSuggestions(value);
        executeSearch(value, filters);
      } else {
        setSuggestions([]);
        setResults(null);
      }
    }, 300);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    executeSearch(suggestion, filters);
    // Track click
    fetch(`/api/v1/search?suggestions=true&q=${encodeURIComponent(suggestion)}`);
  };

  const handleResultClick = (result: SearchResult) => {
    if (query) {
      fetch("/api/v1/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, entityId: result.id }),
      });
    }
    setIsOpen(false);
  };

  const clearSearch = () => {
    setQuery("");
    setSuggestions([]);
    setResults(null);
    setFilters({});
    inputRef.current?.focus();
  };

  const typeColors: Record<string, string> = {
    service: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    user: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
    booking: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
    article: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  };

  const showDropdown = isOpen && (suggestions.length > 0 || results !== null || !query);

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto" role="search">
      {/* Search Input */}
      <div
        className={`flex items-center gap-2 rounded-xl border bg-white px-3 py-2.5 shadow-sm transition-all dark:bg-slate-900 ${
          isOpen
            ? "border-blue-500 ring-2 ring-blue-500/20"
            : "border-slate-200 hover:border-slate-300 dark:border-slate-700"
        }`}
      >
        {isLoading ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
        ) : (
          <Search className="h-4 w-4 shrink-0 text-slate-400" />
        )}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setIsOpen(false);
            if (e.key === "Enter" && query) executeSearch(query, filters);
          }}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-100"
          autoComplete="off"
          aria-label="Search"
          aria-expanded={showDropdown}
          aria-haspopup="listbox"
          role="combobox"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="rounded-md p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
            aria-label="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`rounded-md p-1 transition ${
            showFilters || Object.values(filters).some(Boolean)
              ? "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300"
              : "text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
          }`}
          aria-label="Toggle filters"
          title="Advanced Filters"
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="mt-2 rounded-xl border border-slate-200 bg-white p-3 shadow-lg dark:border-slate-700 dark:bg-slate-900">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Type
              </label>
              <select
                value={filters.type || ""}
                onChange={(e) => {
                  const f = { ...filters, type: e.target.value || undefined };
                  setFilters(f);
                  if (query) executeSearch(query, f);
                }}
                className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                <option value="">All Types</option>
                <option value="service">Services</option>
                <option value="user">Providers</option>
                <option value="article">Articles</option>
                <option value="booking">Bookings</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Min Rating
              </label>
              <select
                value={filters.minRating || ""}
                onChange={(e) => {
                  const f = { ...filters, minRating: e.target.value ? Number(e.target.value) : undefined };
                  setFilters(f);
                  if (query) executeSearch(query, f);
                }}
                className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                <option value="">Any Rating</option>
                <option value="3">3+ ⭐</option>
                <option value="4">4+ ⭐</option>
                <option value="4.5">4.5+ ⭐</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Location
              </label>
              <input
                type="text"
                value={filters.location || ""}
                onChange={(e) => {
                  const f = { ...filters, location: e.target.value || undefined };
                  setFilters(f);
                  if (query) executeSearch(query, f);
                }}
                placeholder="e.g. New York"
                className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-700 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              />
            </div>
          </div>
          {Object.values(filters).some(Boolean) && (
            <button
              onClick={() => {
                setFilters({});
                if (query) executeSearch(query, {});
              }}
              className="mt-2 text-[10px] font-medium text-blue-600 hover:underline dark:text-blue-400"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}

      {/* Dropdown Panel */}
      {showDropdown && (
        <div
          className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
          role="listbox"
        >
          {/* No query yet — show recent + popular */}
          {!query && (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentSearches.length > 0 && (
                <div className="p-3">
                  <div className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    <Clock className="h-3 w-3" />
                    Recent Searches
                  </div>
                  {recentSearches.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSuggestionClick(s)}
                      className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                      <Clock className="h-3 w-3 shrink-0 text-slate-400" />
                      {s}
                    </button>
                  ))}
                </div>
              )}
              {popularSearches.length > 0 && (
                <div className="p-3">
                  <div className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    <TrendingUp className="h-3 w-3" />
                    Popular Searches
                  </div>
                  {popularSearches.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSuggestionClick(s)}
                      className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                      <TrendingUp className="h-3 w-3 shrink-0 text-slate-400" />
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Suggestions */}
          {query && suggestions.length > 0 && !results && (
            <div className="p-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSuggestionClick(s)}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <Search className="h-3 w-3 shrink-0 text-slate-400" />
                  <span dangerouslySetInnerHTML={{ __html: s }} />
                  <ChevronRight className="ml-auto h-3 w-3 text-slate-300" />
                </button>
              ))}
            </div>
          )}

          {/* Search Results */}
          {results && results.hits.length > 0 && (
            <div>
              <div className="border-b border-slate-100 px-3 py-2 dark:border-slate-800">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  {results.total} result{results.total !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {results.hits.map(({ item, highlight }) => (
                  <button
                    key={item.id}
                    onClick={() => handleResultClick(item)}
                    className="flex w-full items-start gap-3 px-3 py-2.5 text-left transition hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase ${
                            typeColors[item.type] || "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {item.type}
                        </span>
                        <p
                          className="truncate text-sm font-medium text-slate-900 dark:text-slate-100"
                          dangerouslySetInnerHTML={{ __html: highlight?.title || item.title }}
                        />
                      </div>
                      <p
                        className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400"
                        dangerouslySetInnerHTML={{ __html: highlight?.description || item.description }}
                      />
                      <div className="mt-1 flex items-center gap-3">
                        {item.rating && (
                          <span className="flex items-center gap-0.5 text-[10px] text-amber-500">
                            <Star className="h-2.5 w-2.5 fill-amber-400" />
                            {item.rating}
                          </span>
                        )}
                        {item.location && (
                          <span className="flex items-center gap-0.5 text-[10px] text-slate-400">
                            <MapPin className="h-2.5 w-2.5" />
                            {item.location}
                          </span>
                        )}
                        {item.category && (
                          <span className="flex items-center gap-0.5 text-[10px] text-slate-400">
                            <Tag className="h-2.5 w-2.5" />
                            {item.category}
                          </span>
                        )}
                        {item.price !== undefined && (
                          <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400">
                            ${item.price}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Facets */}
              {results.facets && Object.keys(results.facets.categories).length > 0 && (
                <div className="border-t border-slate-100 p-3 dark:border-slate-800">
                  <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Categories
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(results.facets.categories).map(([cat, count]) => (
                      <button
                        key={cat}
                        onClick={() => {
                          const f = { ...filters, category: cat };
                          setFilters(f);
                          executeSearch(query, f);
                        }}
                        className={`rounded-full px-2 py-0.5 text-[10px] font-medium transition ${
                          filters.category === cat
                            ? "bg-blue-600 text-white"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                        }`}
                      >
                        {cat} ({count})
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Pagination */}
              {results.total > results.limit && (
                <div className="flex items-center justify-between border-t border-slate-100 px-3 py-2 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400">
                    Page {page} of {Math.ceil(results.total / results.limit)}
                  </span>
                  <div className="flex gap-2">
                    {page > 1 && (
                      <button
                        onClick={() => executeSearch(query, filters, page - 1)}
                        className="text-[10px] font-medium text-blue-600 hover:underline dark:text-blue-400"
                      >
                        ← Prev
                      </button>
                    )}
                    {page < Math.ceil(results.total / results.limit) && (
                      <button
                        onClick={() => executeSearch(query, filters, page + 1)}
                        className="text-[10px] font-medium text-blue-600 hover:underline dark:text-blue-400"
                      >
                        Next →
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* No results */}
          {results && results.hits.length === 0 && query && (
            <div className="flex flex-col items-center gap-2 py-8 text-slate-400">
              <Search className="h-8 w-8 opacity-30" />
              <p className="text-sm">No results for &ldquo;{query}&rdquo;</p>
              <p className="text-xs">Try different keywords or remove filters</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
