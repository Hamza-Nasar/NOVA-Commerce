export interface ApiResponse<T> {
  success: true;
  data: T;
  meta: { timestamp: string; requestId?: string };
}
