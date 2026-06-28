import { api } from '@/src/lib/api';
import { cleanParams } from '@/src/data/cleanParams';

export type Product = {
  id: number;
  name: string;
  description?: string;
  price: number | string;
  stock: number;
  barbershopId?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type ProductPayload = {
  name: string;
  description?: string;
  price: number;
  stock: number;
  barbershopId?: number;
  isActive?: boolean;
};

export type ProductListParams = {
  page?: number;
  limit?: number;
  name?: string;
  description?: string;
  barbershopId?: string;
  minPrice?: string;
  maxPrice?: string;
  minStock?: string;
  maxStock?: string;
  isActive?: string;
};

export type Paginated<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  lastPage: number;
};

export async function listProducts(params: ProductListParams) {
  const { data } = await api.get<Paginated<Product>>('/products', {
    params: cleanParams(params),
  });

  return data;
}

export async function createProduct(payload: ProductPayload) {
  const { data } = await api.post<Product>('/products', payload);
  return data;
}

export async function updateProduct(id: number, payload: Partial<ProductPayload>) {
  const { data } = await api.patch<Product>(`/products/${id}`, payload);
  return data;
}

export async function deleteProduct(id: number) {
  const { data } = await api.delete(`/products/${id}`);
  return data;
}