import type { AuthResponse } from '@yerlab/types';

const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

let sessionToken = '';
export function setToken(token: string) {
  sessionToken = token;
}

export class ApiError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  if (!(options.body instanceof FormData) && options.body) {
    headers.set('Content-Type', 'application/json');
  }
  if (sessionToken) headers.set('Authorization', `Bearer ${sessionToken}`);

  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, { ...options, headers });
  } catch {
    throw new ApiError('NETWORK', 'Network error. Check your connection and try again.');
  }

  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  if (!res.ok) {
    const err = data?.error ?? { code: 'ERROR', message: 'Request failed.' };
    throw new ApiError(err.code, err.message);
  }
  return data as T;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: 'POST',
      body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
    }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};

export function authTelegram(initData: string): Promise<AuthResponse> {
  return api.post<AuthResponse>('/auth/telegram', { initData });
}
