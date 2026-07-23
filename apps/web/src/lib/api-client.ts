type ApiEnvelope<T> = { success: boolean; data: T };
const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';
export async function apiClient<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, { ...options, headers: { 'Content-Type': 'application/json', ...options.headers }, credentials: 'include' });
  const payload = (await response.json()) as ApiEnvelope<T>;
  if (!response.ok || !payload.success) throw new Error('API request failed');
  return payload.data;
}
