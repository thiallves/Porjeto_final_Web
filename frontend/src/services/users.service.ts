import { api } from '@/src/lib/api';
import { cleanParams } from '@/src/data/cleanParams';
import type { ListParams, Paginated, User } from '@/src/types/api';

export type UserPayload = Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>> & { password?: string };

export async function listUsers(params: ListParams) {
  const { data } = await api.get<Paginated<User>>('/users', { params: cleanParams(params) });
  return data;
}
export async function getUser(id: number) {
  const { data } = await api.get<User>(`/users/${id}`);
  return data;
}
export async function createUser(payload: UserPayload) {
  const { data } = await api.post<User>('/users', payload);
  return data;
}
export async function updateUser(id: number, payload: UserPayload) {
  const { data } = await api.patch<User>(`/users/${id}`, payload);
  return data;
}
export async function replaceUser(id: number, payload: UserPayload) {
  const { data } = await api.put<User>(`/users/${id}`, payload);
  return data;
}
export async function deleteUser(id: number) {
  const { data } = await api.delete(`/users/${id}`);
  return data;
}
