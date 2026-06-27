import { api } from '@/src/lib/api';
import { cleanParams } from '@/src/data/cleanParams';
import type { Barbershop, ListParams, Paginated } from '@/src/types/api';

export type BarbershopPayload = Partial<Omit<Barbershop, 'id' | 'createdAt' | 'updatedAt'>>;

export async function listBarbershops(params: ListParams) {
  const { data } = await api.get<Paginated<Barbershop>>('/barbershops', { params: cleanParams(params) });
  return data;
}
export async function getBarbershop(id: number) {
  const { data } = await api.get<Barbershop>(`/barbershops/${id}`);
  return data;
}
export async function createBarbershop(payload: BarbershopPayload) {
  const { data } = await api.post<Barbershop>('/barbershops', payload);
  return data;
}
export async function updateBarbershop(id: number, payload: BarbershopPayload) {
  const { data } = await api.patch<Barbershop>(`/barbershops/${id}`, payload);
  return data;
}
export async function replaceBarbershop(id: number, payload: BarbershopPayload) {
  const { data } = await api.put<Barbershop>(`/barbershops/${id}`, payload);
  return data;
}
export async function deleteBarbershop(id: number) {
  const { data } = await api.delete(`/barbershops/${id}`);
  return data;
}
