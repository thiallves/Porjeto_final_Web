'use client';
import { ProtectedPage } from '@/components/auth/ProtectedPage';
import { GenericCrudPage } from '@/components/forms/GenericCrudPage';

const config = { endpoint: '/categories', title: 'Categorias', description: 'Organize os tipos de atendimento disponíveis.', searchPlaceholder: 'Buscar categoria...', fields: [{ name: 'name', label: 'Nome', required: true }, { name: 'description', label: 'Descrição' }, { name: 'isActive', label: 'Status', type: 'checkbox' }], columns: [{ key: 'id', header: 'ID' }, { key: 'name', header: 'Nome' }, { key: 'description', header: 'Descrição' }, { key: 'isActive', header: 'Status', type: 'boolean' }] } as const;

export default function Page() {
  return <ProtectedPage href="/categorias">{user => <GenericCrudPage config={config as any} user={user} />}</ProtectedPage>;
}
