// apps/web/src/shared/search/elasticsearch.ts
import { Client } from "@elastic/elasticsearch";

export interface SearchableEntity {
  id: string;
  type: "user" | "service" | "booking" | "article";
  title: string;
  description: string;
  category?: string;
  price?: number;
  rating?: number;
  location?: string;
  tags?: string[];
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface SearchQueryParams {
  query: string;
  type?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  location?: string;
  page?: number;
  limit?: number;
}

export interface SearchResult<T = SearchableEntity> {
  hits: Array<{
    item: T;
    score: number;
    highlight?: {
      title?: string;
      description?: string;
    };
  }>;
  total: number;
  page: number;
  limit: number;
  facets: {
    categories: Record<string, number>;
    types: Record<string, number>;
    locations: Record<string, number>;
    priceRange: { min: number; max: number };
  };
}

class ElasticsearchService {
  private client: Client | null = null;
  private isConfigured = false;

  constructor() {
    const node = process.env.ELASTICSEARCH_URL;
    const apiKey = process.env.ELASTICSEARCH_API_KEY;

    if (node) {
      try {
        this.client = new Client({
          node,
          auth: apiKey ? { apiKey } : undefined,
        });
        this.isConfigured = true;
      } catch (err) {
        console.warn("[Elasticsearch] Initialization error:", err);
      }
    }
  }

  /**
   * Health check / ping cluster
   */
  async ping(): Promise<boolean> {
    if (!this.client) return false;
    try {
      return await this.client.ping();
    } catch {
      return false;
    }
  }

  /**
   * Index single document
   */
  async indexDocument(index: string, document: SearchableEntity): Promise<boolean> {
    if (!this.client) return false;
    try {
      await this.client.index({
        index,
        id: document.id,
        document,
      });
      return true;
    } catch (err) {
      console.error("[Elasticsearch] Error indexing document:", err);
      return false;
    }
  }

  /**
   * Bulk index documents
   */
  async bulkIndex(index: string, documents: SearchableEntity[]): Promise<boolean> {
    if (!this.client || documents.length === 0) return false;
    try {
      const operations = documents.flatMap((doc) => [
        { index: { _index: index, _id: doc.id } },
        doc,
      ]);
      const res = await this.client.bulk({ refresh: true, operations });
      return !res.errors;
    } catch (err) {
      console.error("[Elasticsearch] Bulk indexing error:", err);
      return false;
    }
  }

  /**
   * Execute full-text faceted search with ranking & highlighting
   */
  async search(index: string, params: SearchQueryParams): Promise<SearchResult | null> {
    if (!this.client) return null;

    const {
      query,
      type,
      category,
      minPrice,
      maxPrice,
      minRating,
      location,
      page = 1,
      limit = 20,
    } = params;

    const must: any[] = [];
    const filter: any[] = [];

    if (query) {
      must.push({
        multi_match: {
          query,
          fields: ["title^3", "description^2", "tags^2", "category"],
          fuzziness: "AUTO",
        },
      });
    } else {
      must.push({ match_all: {} });
    }

    if (type) filter.push({ term: { type } });
    if (category) filter.push({ term: { "category.keyword": category } });
    if (location) filter.push({ match: { location } });

    if (minPrice !== undefined || maxPrice !== undefined) {
      const priceRange: any = {};
      if (minPrice !== undefined) priceRange.gte = minPrice;
      if (maxPrice !== undefined) priceRange.lte = maxPrice;
      filter.push({ range: { price: priceRange } });
    }

    if (minRating !== undefined) {
      filter.push({ range: { rating: { gte: minRating } } });
    }

    try {
      const res = await this.client.search({
        index,
        from: (page - 1) * limit,
        size: limit,
        query: {
          bool: {
            must,
            filter,
          },
        },
        highlight: {
          pre_tags: ["<mark class='bg-yellow-200 dark:bg-yellow-800 rounded px-1'>"],
          post_tags: ["</mark>"],
          fields: {
            title: {},
            description: {},
          },
        },
        aggs: {
          categories: { terms: { field: "category.keyword", size: 20 } },
          types: { terms: { field: "type.keyword", size: 10 } },
          locations: { terms: { field: "location.keyword", size: 10 } },
          min_price: { min: { field: "price" } },
          max_price: { max: { field: "price" } },
        },
      });

      const hits = (res.hits.hits || []).map((hit: any) => ({
        item: hit._source as SearchableEntity,
        score: hit._score || 1,
        highlight: {
          title: hit.highlight?.title?.[0],
          description: hit.highlight?.description?.[0],
        },
      }));

      const aggs: any = res.aggregations || {};
      const categories: Record<string, number> = {};
      aggs.categories?.buckets?.forEach((b: any) => {
        categories[b.key] = b.doc_count;
      });

      const types: Record<string, number> = {};
      aggs.types?.buckets?.forEach((b: any) => {
        types[b.key] = b.doc_count;
      });

      const locations: Record<string, number> = {};
      aggs.locations?.buckets?.forEach((b: any) => {
        locations[b.key] = b.doc_count;
      });

      return {
        hits,
        total: typeof res.hits.total === "number" ? res.hits.total : res.hits.total?.value || 0,
        page,
        limit,
        facets: {
          categories,
          types,
          locations,
          priceRange: {
            min: aggs.min_price?.value || 0,
            max: aggs.max_price?.value || 0,
          },
        },
      };
    } catch (err) {
      console.error("[Elasticsearch] Search query error:", err);
      return null;
    }
  }

  /**
   * Search suggestions / autocomplete
   */
  async suggest(index: string, prefix: string, size = 5): Promise<string[]> {
    if (!this.client || !prefix) return [];
    try {
      const res = await this.client.search({
        index,
        size,
        query: {
          match_phrase_prefix: {
            title: {
              query: prefix,
            },
          },
        },
      });

      return (res.hits.hits || [])
        .map((h: any) => h._source?.title)
        .filter(Boolean);
    } catch (err) {
      console.warn("[Elasticsearch] Autocomplete suggest error:", err);
      return [];
    }
  }
}

export const elasticsearchService = new ElasticsearchService();
