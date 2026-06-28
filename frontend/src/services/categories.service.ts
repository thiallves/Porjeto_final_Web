import { api } from '@/src/lib/api';
import { cleanParams } from '@/src/data/cleanParams';

export type Category = {
  id: number;
  name: string;
  description?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type CategoryPayload = {
  name: string;
  description?: string;
  isActive?: boolean;
};

export type CategoryListParams = {
  page?: number;
  limit?: number;
  name?: string;
  description?: string;
  isActive?: string;
};

export type Paginated<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  lastPage: number;
};

export async function listCategories(params: CategoryListParams) {
  const { data } = await api.get<Paginated<Category>>('/categories', {
    params: cleanParams(params),
  });

  return data;
}

export async function createCategory(payload: CategoryPayload) {
  const { data } = await api.post<Category>('/categories', payload);
  return data;
}

export async function updateCategory(id: number, payload: Partial<CategoryPayload>) {
  const { data } = await api.patch<Category>(`/categories/${id}`, payload);
  return data;
}

export async function deleteCategory(id: number) {
  const { data } = await api.delete(`/categories/${id}`);
  return data;
}