import { ENV } from "@/shared/config/env";
import { API_ROUTES } from "@/shared/config/api-routes";
import type { ApiErrorResponse, AuthResponse } from "@/modules/auth/models/auth.types";

export class ApiError extends Error {
  public statusCode: number;
  public errorName?: string;
  public rawMessage: string | string[];

  constructor(statusCode: number, rawMessage: string | string[], errorName?: string) {
    const formattedMessage = Array.isArray(rawMessage)
      ? rawMessage.join(". ")
      : rawMessage;
    super(formattedMessage || "Ha ocurrido un error inesperado");
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.errorName = errorName;
    this.rawMessage = rawMessage;
  }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined>;
  skipAuth?: boolean;
}

const STORAGE_KEY = "adoptanet_auth";

function getStoredTokens(): { accessToken: string | null; refreshToken: string | null } {
  if (typeof window === "undefined") {
    return { accessToken: null, refreshToken: null };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { accessToken: null, refreshToken: null };
    const parsed = JSON.parse(raw);
    return {
      accessToken: parsed?.state?.accessToken || null,
      refreshToken: parsed?.state?.refreshToken || null,
    };
  } catch {
    return { accessToken: null, refreshToken: null };
  }
}

function updateStoredTokens(tokens: { accessToken: string; refreshToken: string }) {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    parsed.state = {
      ...parsed.state,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
  } catch {
    // Ignore storage parse errors
  }
}

function clearStoredAuth() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore storage clear errors
  }
}

// Queue for handling simultaneous 401 requests
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

function isPublicUrl(path: string): boolean {
  if (!path) return false;
  const cleanPath = path.split("?")[0].split("#")[0];
  if (
    cleanPath === "/" ||
    cleanPath === "/pets" ||
    (cleanPath.startsWith("/pets/") &&
      !cleanPath.endsWith("/new") &&
      !cleanPath.endsWith("/edit")) ||
    cleanPath.startsWith("/shelters/") ||
    cleanPath.startsWith("/login") ||
    cleanPath.startsWith("/register") ||
    cleanPath.startsWith("/recover") ||
    cleanPath.startsWith("/reset-password") ||
    cleanPath.startsWith("/verify-email") ||
    cleanPath.startsWith("/terms") ||
    cleanPath.startsWith("/privacy") ||
    cleanPath.startsWith("/terminos-de-servicio") ||
    cleanPath.startsWith("/condiciones-del-servicio") ||
    cleanPath.startsWith("/politica-de-privacidad")
  ) {
    return true;
  }
  return false;
}

async function executeFetch<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { body, params, skipAuth = false, headers: customHeaders, ...restOptions } = options;

  let url = endpoint.startsWith("http") ? endpoint : `${ENV.API_URL}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined) searchParams.append(key, String(val));
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes("?") ? "&" : "?") + queryString;
    }
  }

  const headers: Record<string, string> = {
    ...(customHeaders as Record<string, string>),
  };

  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
  if (!isFormData && body !== undefined && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  if (!skipAuth) {
    const { accessToken } = getStoredTokens();
    if (accessToken && !headers["Authorization"]) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }
  }

  const requestBody = isFormData
    ? (body as FormData)
    : body !== undefined
      ? JSON.stringify(body)
      : undefined;

  const response = await fetch(url, {
    ...restOptions,
    headers,
    body: requestBody,
  });

  if (response.status === 401 && !skipAuth && !endpoint.includes(API_ROUTES.AUTH.LOGIN) && !endpoint.includes(API_ROUTES.AUTH.REFRESH)) {
    // Attempt silent token refresh
    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((newToken) => {
        return executeFetch<T>(endpoint, {
          ...options,
          headers: {
            ...headers,
            Authorization: `Bearer ${newToken}`,
          },
        });
      });
    }

    isRefreshing = true;
    const { refreshToken } = getStoredTokens();

    if (!refreshToken) {
      isRefreshing = false;
      clearStoredAuth();
      if (typeof window !== "undefined" && !isPublicUrl(window.location.pathname)) {
        window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
      }
      throw new ApiError(401, "Sesión no válida o expirada", "Unauthorized");
    }

    try {
      const refreshRes = await fetch(`${ENV.API_URL}${API_ROUTES.AUTH.REFRESH}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (!refreshRes.ok) {
        throw new Error("Refresh token expired or invalid");
      }

      const data: AuthResponse = await refreshRes.json();
      updateStoredTokens({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });

      processQueue(null, data.accessToken);
      isRefreshing = false;

      // Retry original request with newly issued accessToken
      return executeFetch<T>(endpoint, {
        ...options,
        headers: {
          ...headers,
          Authorization: `Bearer ${data.accessToken}`,
        },
      });
    } catch (refreshErr) {
      processQueue(refreshErr, null);
      isRefreshing = false;
      clearStoredAuth();
      if (typeof window !== "undefined" && !isPublicUrl(window.location.pathname)) {
        window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
      }
      throw new ApiError(401, "La sesión ha expirado. Por favor, ingresa nuevamente.", "SessionExpired");
    }
  }

  if (!response.ok) {
    let errorData: ApiErrorResponse | null = null;
    try {
      errorData = await response.json();
    } catch {
      // Non-JSON response
    }
    const message = errorData?.message || response.statusText || "Error en la petición";
    const errorName = errorData?.error;
    throw new ApiError(response.status, message, errorName);
  }

  // If 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export const httpClient = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    executeFetch<T>(endpoint, { ...options, method: "GET" }),

  post: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    executeFetch<T>(endpoint, { ...options, method: "POST", body }),

  put: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    executeFetch<T>(endpoint, { ...options, method: "PUT", body }),

  patch: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    executeFetch<T>(endpoint, { ...options, method: "PATCH", body }),

  delete: <T>(endpoint: string, options?: RequestOptions) =>
    executeFetch<T>(endpoint, { ...options, method: "DELETE" }),
};
