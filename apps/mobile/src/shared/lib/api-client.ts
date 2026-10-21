// apps/mobile/src/shared/lib/api-client.ts
import { ENV } from "../config/env";
import { SecureStoreManager, STORAGE_KEYS } from "./secure-store";

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
  timestamp?: string;
}

export class ApiError extends Error {
  statusCode: number;
  errors?: Record<string, string[]>;

  constructor(message: string, statusCode = 500, errors?: Record<string, string[]>) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

export class ApiClient {
  private static baseUrl = `${ENV.API_BASE_URL}${ENV.API_PREFIX}`;

  /**
   * Core HTTP request handler
   */
  private static async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    const url = `${this.baseUrl}${cleanEndpoint}`;

    // Load auth token & workspace headers from SecureStore
    const [token, workspaceId] = await Promise.all([
      SecureStoreManager.getItem(STORAGE_KEYS.AUTH_TOKEN),
      SecureStoreManager.getItem(STORAGE_KEYS.ACTIVE_WORKSPACE_ID),
    ]);

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
      "x-client-platform": "expo-mobile",
      "x-app-version": ENV.APP_VERSION,
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    if (workspaceId) {
      headers["x-workspace-id"] = workspaceId;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), ENV.TIMEOUT_MS);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle 401 Unauthorized Session Expired
      if (response.status === 401) {
        await SecureStoreManager.clearSession();
      }

      let json: ApiResponse<T>;
      try {
        json = await response.json();
      } catch {
        throw new ApiError(`Invalid server response from ${endpoint}`, response.status);
      }

      if (!response.ok || !json.success) {
        const errorMsg = json.message || json.error || `HTTP ${response.status} Error`;
        throw new ApiError(errorMsg, response.status, json.errors);
      }

      return json.data as T;
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      if (err instanceof ApiError) {
        throw err;
      }
      if ((err as Error)?.name === "AbortError") {
        throw new ApiError("Network request timed out. Please check your connection.", 408);
      }
      const msg = err instanceof Error ? err.message : "Network error occurred";
      throw new ApiError(msg, 500);
    }
  }

  /**
   * GET request
   */
  static async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    let url = endpoint;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null) {
          searchParams.append(key, String(val));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += (url.includes("?") ? "&" : "?") + queryString;
      }
    }
    return this.request<T>(url, { method: "GET" });
  }

  /**
   * POST request
   */
  static async post<T>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * PUT request
   */
  static async put<T>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * PATCH request
   */
  static async patch<T>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * DELETE request
   */
  static async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}
