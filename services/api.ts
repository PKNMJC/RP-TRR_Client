const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const API_BASE_URL = API_URL;

interface FetchOptions extends RequestInit {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
}

export async function apiFetch(url: string, options?: string | FetchOptions | "GET" | "POST" | "PUT" | "DELETE", body?: any) {
  const token = localStorage.getItem("token");

  // Support both old style: apiFetch(url, method, body) and new style: apiFetch(url, options)
  let method = "GET";
  let requestBody: any = undefined;
  let headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  if (typeof options === "string") {
    // Old style: apiFetch(url, method, body)
    method = options;
    requestBody = body ? JSON.stringify(body) : undefined;
  } else if (typeof options === "object" && options !== null) {
    // New style: apiFetch(url, { method, body, headers, ... })
    method = options.method || "GET";
    headers = {
      ...headers,
      ...options.headers,
    };
    // Handle body - can be string or object
    if (options.body) {
      requestBody = typeof options.body === "string" ? options.body : JSON.stringify(options.body);
    }
  }

  const res = await fetch(API_URL + url, {
    method,
    headers,
    body: requestBody,
  });

  console.log(`[apiFetch] ${method} ${url} → Status: ${res.status}`);

  // Handle error responses
  if (!res.ok) {
    let errorMessage = `API Error: ${res.status} ${res.statusText}`;
    
    try {
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const error = await res.json();
        console.error(`[apiFetch] Error response:`, error);
        
        // NestJS exception format: { message: string | string[], error: string, statusCode: number }
        if (error.message) {
          if (Array.isArray(error.message)) {
            errorMessage = error.message.join(', ');
          } else {
            errorMessage = error.message;
          }
        } else if (error.error) {
          errorMessage = error.error;
        }
      } else {
        const text = await res.text();
        if (text) {
          errorMessage = text;
        }
      }
    } catch (parseError) {
      console.error(`[apiFetch] Parse error:`, parseError);
    }
    
    console.error(`[apiFetch] Throwing error: ${errorMessage}`);
    throw new Error(errorMessage);
  }

  // Handle successful responses
  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    const data = await res.json();
    console.log(`[apiFetch] Success response:`, data);
    return data;
  }

  // If no content-type or not JSON, return null (for 204 No Content, etc.)
  const text = await res.text();
  const result = text ? JSON.parse(text) : null;
  console.log(`[apiFetch] Text response:`, result);
  return result;
}

// API Client class for making requests
interface RequestConfig {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  data?: any;
  params?: Record<string, any>;
}

class APIClient {
  private baseURL: string;

  constructor(baseURL: string = API_URL) {
    this.baseURL = baseURL;
  }

  private getAuthToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  }

  private getHeaders(config?: RequestConfig): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...config?.headers,
    };

    const token = this.getAuthToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  }

  private buildURL(url: string, params?: Record<string, any>): string {
    let fullURL = this.baseURL + url;

    if (params) {
      const queryString = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          queryString.append(key, String(value));
        }
      });

      const queryStr = queryString.toString();
      if (queryStr) {
        fullURL += `?${queryStr}`;
      }
    }

    return fullURL;
  }

  async request<T = any>(
    url: string,
    config?: RequestConfig
  ): Promise<T> {
    const method = config?.method || "GET";
    const fullURL = this.buildURL(url, config?.params);
    const headers = this.getHeaders(config);

    const options: RequestInit = {
      method,
      headers,
    };

    if (config?.data && (method === "POST" || method === "PUT" || method === "PATCH")) {
      // Handle FormData (for file uploads)
      if (config.data instanceof FormData) {
        delete headers["Content-Type"];
        options.body = config.data;
      } else {
        options.body = JSON.stringify(config.data);
      }
    }

    try {
      const response = await fetch(fullURL, options);

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        let errorData: any = null;

        try {
          errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // Response is not JSON
        }

        const error: any = new Error(errorMessage);
        error.status = response.status;
        error.data = errorData;
        throw error;
      }

      // Handle empty responses
      const contentLength = response.headers.get("content-length");
      if (contentLength === "0" || response.status === 204) {
        return {} as T;
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      console.error(`[API Error] ${method} ${url}:`, error);
      throw error;
    }
  }

  async get<T = any>(url: string, config?: Omit<RequestConfig, "data" | "method">): Promise<T> {
    return this.request<T>(url, {
      ...config,
      method: "GET",
    });
  }

  async post<T = any>(
    url: string,
    data?: any,
    config?: Omit<RequestConfig, "data" | "method">
  ): Promise<T> {
    return this.request<T>(url, {
      ...config,
      method: "POST",
      data,
    });
  }

  async put<T = any>(
    url: string,
    data?: any,
    config?: Omit<RequestConfig, "data" | "method">
  ): Promise<T> {
    return this.request<T>(url, {
      ...config,
      method: "PUT",
      data,
    });
  }

  async patch<T = any>(
    url: string,
    data?: any,
    config?: Omit<RequestConfig, "data" | "method">
  ): Promise<T> {
    return this.request<T>(url, {
      ...config,
      method: "PATCH",
      data,
    });
  }

  async delete<T = any>(url: string, config?: Omit<RequestConfig, "data" | "method">): Promise<T> {
    return this.request<T>(url, {
      ...config,
      method: "DELETE",
    });
  }
}

export const apiClient = new APIClient(API_URL);
