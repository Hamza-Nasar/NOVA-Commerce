type ApiEnvelope<T> = { success: boolean; data: T; meta: { timestamp: string } };
export class ApiClient {
  constructor(private readonly baseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1') {}
  async get<T>(path: string, init?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, { ...init, headers: { Accept: 'application/json', ...init?.headers }, credentials: 'include' });
    if (!response.ok) throw new Error(`API request failed (${response.status})`);
    return (await response.json() as ApiEnvelope<T>).data;
  }
}
export const api = new ApiClient();
