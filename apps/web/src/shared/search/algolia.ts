// apps/web/src/shared/search/algolia.ts
import { algoliasearch } from "algoliasearch";
import type { SearchableEntity, SearchQueryParams, SearchResult } from "./elasticsearch";

class AlgoliaSearchService {
  private client: ReturnType<typeof algoliasearch> | null = null;
  private isConfigured = false;
  private defaultIndexName: string;

  constructor() {
    const appId = process.env.ALGOLIA_APP_ID;
    const apiKey = process.env.ALGOLIA_API_KEY;
    this.defaultIndexName = process.env.ALGOLIA_INDEX_NAME || "saasflow_master";

    if (appId && apiKey) {
      try {
        this.client = algoliasearch(appId, apiKey);
        this.isConfigured = true;
      } catch (err) {
        console.warn("[Algolia] Initialization error:", err);
      }
    }
  }

  /**
   * Save or update an entity in Algolia
   */
  async saveObject(entity: SearchableEntity, indexName?: string): Promise<boolean> {
    if (!this.client) return false;
    const index = indexName || this.defaultIndexName;

    try {
      await this.client.saveObject({
        indexName: index,
        body: {
          objectID: entity.id,
          ...entity,
        },
      });
      return true;
    } catch (err) {
      console.error("[Algolia] saveObject error:", err);
      return false;
    }
  }

  /**
   * Bulk save entities
   */
  async saveObjects(entities: SearchableEntity[], indexName?: string): Promise<boolean> {
    if (!this.client || entities.length === 0) return false;
    const index = indexName || this.defaultIndexName;

    try {
      const records = entities.map((e) => ({
        objectID: e.id,
        ...e,
      }));
      await this.client.saveObjects({
        indexName: index,
        objects: records,
      });
      return true;
    } catch (err) {
      console.error("[Algolia] saveObjects error:", err);
      return false;
    }
  }

  /**
   * Search index using Algolia v5 client
   */
  async search(params: SearchQueryParams, indexName?: string): Promise<SearchResult | null> {
    if (!this.client) return null;
    const index = indexName || this.defaultIndexName;

    const facetFilters: string[] = [];
    const numericFilters: string[] = [];

    if (params.type) facetFilters.push(`type:${params.type}`);
    if (params.category) facetFilters.push(`category:${params.category}`);
    if (params.location) facetFilters.push(`location:${params.location}`);
    if (params.minPrice !== undefined) numericFilters.push(`price >= ${params.minPrice}`);
    if (params.maxPrice !== undefined) numericFilters.push(`price <= ${params.maxPrice}`);
    if (params.minRating !== undefined) numericFilters.push(`rating >= ${params.minRating}`);

    try {
      const response: any = await this.client.searchSingleIndex({
        indexName: index,
        searchParams: {
          query: params.query || "",
          page: (params.page || 1) - 1,
          hitsPerPage: params.limit || 20,
          facetFilters: facetFilters.length > 0 ? facetFilters : undefined,
          numericFilters: numericFilters.length > 0 ? numericFilters : undefined,
          facets: ["category", "type", "location"],
        },
      });

      const hits = (response.hits || []).map((hit: any) => ({
        item: {
          id: hit.objectID || hit.id,
          type: hit.type || "service",
          title: hit.title || "",
          description: hit.description || "",
          category: hit.category,
          price: hit.price,
          rating: hit.rating,
          location: hit.location,
          tags: hit.tags,
          createdAt: hit.createdAt || new Date().toISOString(),
        } as SearchableEntity,
        score: 1,
        highlight: {
          title: hit._highlightResult?.title?.value,
          description: hit._highlightResult?.description?.value,
        },
      }));

      const categories: Record<string, number> = response.facets?.category || {};
      const types: Record<string, number> = response.facets?.type || {};
      const locations: Record<string, number> = response.facets?.location || {};

      return {
        hits,
        total: response.nbHits || 0,
        page: (response.page || 0) + 1,
        limit: response.hitsPerPage || 20,
        facets: {
          categories,
          types,
          locations,
          priceRange: { min: 0, max: 10000 },
        },
      };
    } catch (err) {
      console.error("[Algolia] Search error:", err);
      return null;
    }
  }

  /**
   * Delete object from index
   */
  async deleteObject(objectID: string, indexName?: string): Promise<boolean> {
    if (!this.client) return false;
    const index = indexName || this.defaultIndexName;
    try {
      await this.client.deleteObject({
        indexName: index,
        objectID,
      });
      return true;
    } catch (err) {
      console.error("[Algolia] deleteObject error:", err);
      return false;
    }
  }
}

export const algoliaService = new AlgoliaSearchService();
