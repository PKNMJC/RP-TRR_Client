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
