'use client';
import { ProtectedPage } from '@/components/auth/ProtectedPage';
import { GenericCrudPage } from '@/components/forms/GenericCrudPage';

const config = {
  endpoint: '/products',
  title: 'Produtos',
  description: 'Gerencie produtos vendidos na barbearia.',
  searchPlaceholder: 'Buscar produto...',
  fields: [
    { name: 'name', label: 'Nome', required: true },
    { name: 'description', label: 'Descrição', type: 'textarea' },
    { name: 'price', label: 'Preço', type: 'number', required: true },
    { name: 'stock', label: 'Estoque', type: 'number', required: true },
    { name: 'barbershopId', label: 'Barbearia', type: 'select', required: true, lookup: { endpoint: '/barbershops', labelKey: 'name', placeholder: 'Selecione a barbearia' } },
    { name: 'isActive', label: 'Status', type: 'checkbox' },
  ],
  columns: [
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'Nome' },
    { key: 'price', header: 'Preço', type: 'money' },
    { key: 'stock', header: 'Estoque' },
    { key: 'barbershopId', header: 'Barbearia', lookup: { endpoint: '/barbershops', labelKey: 'name' } },
    { key: 'isActive', header: 'Status', type: 'boolean' },
  ],
} as const;

export default function Page() {
  return <ProtectedPage href="/produtos">{user => <GenericCrudPage config={config as any} user={user} />}</ProtectedPage>;
}
