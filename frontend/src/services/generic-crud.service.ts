import { api } from '@/src/lib/api';
import { cleanParams } from '@/src/data/cleanParams';
import type { ListParams, Paginated } from '@/src/types/api';

export async function listGeneric<T>(endpoint: string, params: ListParams) {
  const { data } = await api.get<Paginated<T>>(endpoint, { params: cleanParams(params) });
  return data;
}
export async function createGeneric<T>(endpoint: string, payload: Record<string, unknown>) {
  const { data } = await api.post<T>(endpoint, payload);
  return data;
}
export async function updateGeneric<T>(endpoint: string, id: number, payload: Record<string, unknown>) {
  const { data } = await api.patch<T>(`${endpoint}/${id}`, payload);
  return data;
}
export async function deleteGeneric(endpoint: string, id: number) {
  const { data } = await api.delete(`${endpoint}/${id}`);
  return data;
}
