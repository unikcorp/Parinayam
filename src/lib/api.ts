import axios from "axios";

// Kept in memory only, never localStorage — an XSS payload that can read
// localStorage can't reach a plain module variable. Lost on full page
// reload by design; the 401 handler below transparently re-mints it from
// the httpOnly refresh-token cookie.
let accessToken: string | null = null;

export function getAccessToken(): string | null {
  return accessToken;
}

export function setAccessToken(token: string) {
  accessToken = token;
}

export function clearAccessToken() {
  accessToken = null;
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000",
  withCredentials: true,
});

// Separate instance (no interceptors) so the refresh call itself can't trigger another refresh.
const refreshClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000",
  withCredentials: true,
});

client.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Same pattern as admin/src/lib/api.ts: on a 401 (and only once per request),
// try the refresh-token cookie to get a new access token and retry.
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isAuthRoute =
      originalRequest?.url?.includes("/api/auth/login") ||
      originalRequest?.url?.includes("/api/members/register") ||
      originalRequest?.url?.includes("/api/members/login");

    if (error.response?.status !== 401 || isAuthRoute || originalRequest?._retried) {
      return Promise.reject(error);
    }
    originalRequest._retried = true;

    try {
      const { data } = await refreshClient.post("/api/auth/refresh");
      setAccessToken(data.data.accessToken);
      originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
      return client(originalRequest);
    } catch (refreshError) {
      clearAccessToken();
      return Promise.reject(refreshError);
    }
  },
);

function errorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.error ?? "Something went wrong. Please try again.";
  }
  return "Something went wrong. Please try again.";
}

type RequestOptions = {
  /** Kept for call-site compatibility — axios detects FormData automatically, no special handling needed. */
  isFormData?: boolean;
};

export const api = {
  async get<T>(path: string): Promise<T> {
    try {
      const { data } = await client.get(path);
      return data.data as T;
    } catch (error) {
      throw new ApiError(axios.isAxiosError(error) ? (error.response?.status ?? 500) : 500, errorMessage(error));
    }
  },
  async post<T>(path: string, body?: unknown, _opts?: RequestOptions): Promise<T> {
    try {
      const { data } = await client.post(path, body);
      return data.data as T;
    } catch (error) {
      throw new ApiError(axios.isAxiosError(error) ? (error.response?.status ?? 500) : 500, errorMessage(error));
    }
  },
  async put<T>(path: string, body?: unknown): Promise<T> {
    try {
      const { data } = await client.put(path, body);
      return data.data as T;
    } catch (error) {
      throw new ApiError(axios.isAxiosError(error) ? (error.response?.status ?? 500) : 500, errorMessage(error));
    }
  },
  async delete<T>(path: string): Promise<T> {
    try {
      const { data } = await client.delete(path);
      return data.data as T;
    } catch (error) {
      throw new ApiError(axios.isAxiosError(error) ? (error.response?.status ?? 500) : 500, errorMessage(error));
    }
  },
  async patch<T>(path: string, body?: unknown): Promise<T> {
    try {
      const { data } = await client.patch(path, body);
      return data.data as T;
    } catch (error) {
      throw new ApiError(axios.isAxiosError(error) ? (error.response?.status ?? 500) : 500, errorMessage(error));
    }
  },
  // Same as get, but keeps the `pagination` envelope instead of unwrapping
  // to just `data` — for paginated list endpoints.
  async getPaginated<T>(
    path: string,
  ): Promise<{ data: T; pagination: { page: number; limit: number; total: number; totalPages: number } }> {
    try {
      const { data } = await client.get(path);
      return { data: data.data as T, pagination: data.pagination };
    } catch (error) {
      throw new ApiError(axios.isAxiosError(error) ? (error.response?.status ?? 500) : 500, errorMessage(error));
    }
  },
};
