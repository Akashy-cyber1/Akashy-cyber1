import { ApiError, ApiResponse } from "./types";

function getBaseUrl(): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!baseUrl) {
    throw new Error("Missing NEXT_PUBLIC_API_BASE_URL in environment variables.");
  }
  return baseUrl;
}

async function parseResponse<T>(response: Response): Promise<ApiResponse<T>> {
  if (response.status === 204) {
    return { data: {} as T, status: response.status };
  }

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw payload as ApiError;
  }

  return { data: payload as T, status: response.status };
}

function getHeaders(token?: string): HeadersInit {
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function request<T, B = Record<string, unknown>>(
  endpoint: string,
  method: "GET" | "POST" | "PATCH" | "DELETE",
  token?: string,
  body?: B,
): Promise<ApiResponse<T>> {
  const response = await fetch(`${getBaseUrl()}${endpoint}`, {
    method,
    headers: getHeaders(token),
    ...(body ? { body: JSON.stringify(body) } : {}),
    cache: method === "GET" ? "no-store" : "default",
  });

  return parseResponse<T>(response);
}

export async function apiGet<T>(endpoint: string, token?: string): Promise<ApiResponse<T>> {
  return request<T>(endpoint, "GET", token);
}

export async function apiPost<T, B = Record<string, unknown>>(
  endpoint: string,
  body: B,
  token?: string,
): Promise<ApiResponse<T>> {
  return request<T, B>(endpoint, "POST", token, body);
}

export async function apiPatch<T, B = Record<string, unknown>>(
  endpoint: string,
  body: B,
  token?: string,
): Promise<ApiResponse<T>> {
  return request<T, B>(endpoint, "PATCH", token, body);
}

export async function apiDelete(endpoint: string, token?: string): Promise<ApiResponse<Record<string, never>>> {
  return request<Record<string, never>>(endpoint, "DELETE", token);
}
