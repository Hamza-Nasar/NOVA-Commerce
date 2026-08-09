type ApiEnvelope<T> = { success: boolean; data: T; meta: { timestamp: string } };

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';

export function toQuery(params: Record<string, string | number | boolean | undefined>) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') search.set(key, String(value));
  });
  const query = search.toString();
  return query ? `?${query}` : '';
}

export async function catalogFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, { cache: 'no-store', ...init, headers: { 'Content-Type': 'application/json', ...(init.headers ?? {}) } });
  const payload = (await response.json().catch(() => null)) as ApiEnvelope<T> | { message?: string } | null;
  if (!response.ok) {
    throw new Error(payload && 'message' in payload && payload.message ? payload.message : `Catalog request failed (${response.status})`);
  }
  return (payload as ApiEnvelope<T>).data;
}
