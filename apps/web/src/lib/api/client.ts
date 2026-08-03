type ApiEnvelope<T> = { success: boolean; data: T; meta: { timestamp: string } };

let accessToken: string | null = null;

export const tokenStore = {
  get: () => accessToken,
  set: (token: string | null) => {
    accessToken = token;
  },
};

export class ApiClient {
  constructor(private readonly baseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1') {}

  async request<T>(path: string, init: RequestInit = {}, retry = true): Promise<T> {
    const headers = new Headers(init.headers);
    headers.set('Accept', 'application/json');
    if (!(init.body instanceof FormData)) headers.set('Content-Type', 'application/json');
    if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`);
    const response = await fetch(`${this.baseUrl}${path}`, { ...init, headers, credentials: 'include' });
    if (response.status === 401 && retry && path !== '/auth/refresh' && !path.startsWith('/auth/login') && !path.startsWith('/auth/register')) {
      try {
        const refreshed = await this.request<{ accessToken: string }>('/auth/refresh', { method: 'POST', body: JSON.stringify({}) }, false);
        accessToken = refreshed.accessToken;
        return this.request<T>(path, init, false);
      } catch {
        accessToken = null;
      }
    }
    const payload = await response.json().catch(() => null) as ApiEnvelope<T> | { message?: string } | null;
    if (!response.ok) {
      const message = response.status === 401 && path.startsWith('/auth/login')
        ? 'Email ya password ghalat hai. Please apni login details dobara check karein.'
        : response.status === 403
          ? 'Aap ko is action ki permission nahi hai.'
          : payload && 'message' in payload
            ? payload.message
            : `Request complete nahi ho saki. Dobara try karein.`;
      throw new Error(message ?? `API request failed (${response.status})`);
    }
    return (payload as ApiEnvelope<T>).data;
  }

  get<T>(path: string, init?: RequestInit): Promise<T> {
    return this.request<T>(path, { ...init, method: 'GET' });
  }

  post<T>(path: string, body?: unknown, init?: RequestInit): Promise<T> {
    return this.request<T>(path, { ...init, method: 'POST', body: JSON.stringify(body ?? {}) });
  }

  patch<T>(path: string, body?: unknown, init?: RequestInit): Promise<T> {
    return this.request<T>(path, { ...init, method: 'PATCH', body: JSON.stringify(body ?? {}) });
  }

  delete<T>(path: string, init?: RequestInit): Promise<T> {
    return this.request<T>(path, { ...init, method: 'DELETE' });
  }
}

export const api = new ApiClient();
