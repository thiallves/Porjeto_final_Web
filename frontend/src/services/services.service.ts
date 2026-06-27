import { api } from '@/src/lib/api';
import { cleanParams } from '@/src/data/cleanParams';
import type { ListParams, Paginated, Service } from '@/src/types/api';

export type ServicePayload = Partial<Omit<Service, 'id' | 'createdAt' | 'updatedAt'>>;

export async function listServices(params: ListParams) {
  const { data } = await api.get<Paginated<Service>>('/services', { params: cleanParams(params) });
  return data;
}
export async function getService(id: number) {
  const { data } = await api.get<Service>(`/services/${id}`);
  return data;
}
export async function createService(payload: ServicePayload) {
  const { data } = await api.post<Service>('/services', payload);
  return data;
}
export async function updateService(id: number, payload: ServicePayload) {
  const { data } = await api.patch<Service>(`/services/${id}`, payload);
  return data;
}
export async function deleteService(id: number) {
  const { data } = await api.delete(`/services/${id}`);
  return data;
}
