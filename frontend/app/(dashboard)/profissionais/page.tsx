'use client';
import { ProtectedPage } from '@/components/auth/ProtectedPage';
import { GenericCrudPage } from '@/components/forms/GenericCrudPage';

const config = {
  endpoint: '/professionals',
  title: 'Profissionais',
  description: 'Cadastre barbeiros e suas especialidades.',
  searchPlaceholder: 'Buscar por e-mail...',

  // 🔥 NOVO
  filters: [
    { name: 'search', type: 'text', placeholder: 'Buscar...' },
    { name: 'name', type: 'text', placeholder: 'Nome' },
    { name: 'email', type: 'text', placeholder: 'E-mail' },
    { name: 'specialty', type: 'text', placeholder: 'Especialidade' },
    {
      name: 'barbershopId',
      type: 'select',
      placeholder: 'Todas as barbearias',
      lookup: { endpoint: '/barbershops', labelKey: 'name' }
    },
    {
      name: 'status',
      type: 'select',
      placeholder: 'Todos',
      options: [
        { label: 'Ativo', value: 'true' },
        { label: 'Inativo', value: 'false' }
      ]
    }
  ],

  fields: [
    { name: 'name', label: 'Nome', required: true },
    { name: 'email', label: 'E-mail', required: true },
    { name: 'phone', label: 'Telefone', required: true },
    { name: 'specialty', label: 'Especialidade', required: true },
    {
      name: 'barbershopId',
      label: 'Barbearia',
      type: 'select',
      required: true,
      lookup: {
        endpoint: '/barbershops',
        labelKey: 'name',
        placeholder: 'Selecione a barbearia'
      }
    },
    { name: 'isActive', label: 'Status', type: 'checkbox' },
  ],

  columns: [
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'Nome' },
    { key: 'email', header: 'E-mail' },
    { key: 'specialty', header: 'Especialidade' },
    {
      key: 'barbershopId',
      header: 'Barbearia',
      lookup: { endpoint: '/barbershops', labelKey: 'name' }
    },
    { key: 'isActive', header: 'Status', type: 'boolean' },
  ],
} as const;


export default function Page() {
  return (
    <ProtectedPage href="/profissionais">
      {user => {
        const canCreate =
          user.role === 'ADMIN' || user.role === 'BARBEIRO';

        return (
          <GenericCrudPage
            config={{
              ...config,
              disableCreate: !canCreate,
            } as any}
            user={user}
          />
        );
      }}
    </ProtectedPage>
  );
}

