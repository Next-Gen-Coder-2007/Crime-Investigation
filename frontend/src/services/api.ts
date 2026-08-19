const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

interface RequestOptions extends RequestInit {
  data?: any;
}

export async function apiClient<T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { data, headers, ...customConfig } = options;

  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const config: RequestInit = {
    method: data ? "POST" : "GET",
    credentials: "include", // Send HTTP-only cookies
    ...customConfig,
    headers: {
      ...defaultHeaders,
      ...headers,
    },
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  try {
    const response = await fetch(url, config);

    let responseData: any;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      responseData = await response.json();
    } else {
      responseData = { message: await response.text() };
    }

    if (!response.ok) {
      const errorMessage =
        responseData?.message || `Request failed with status ${response.status}`;
      throw new Error(errorMessage);
    }

    return responseData as T;
  } catch (error: any) {
    console.warn(`[API Client Warning] ${url}: ${error.message}`);
    throw error;
  }
}
