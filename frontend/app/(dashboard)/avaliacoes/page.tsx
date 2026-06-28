'use client';
import { ProtectedPage } from '@/components/auth/ProtectedPage';
import { GenericCrudPage } from '@/components/forms/GenericCrudPage';

const config = {
  endpoint: '/reviews',
  title: 'Avaliações',
  description: 'Acompanhe a opinião dos clientes.',
  searchPlaceholder: 'Buscar avaliação...',
  disableCreate: false,
  disableEdit: true,
  fields: [
    //{ name: 'userId', label: 'Cliente', type: 'select', required: true, lookup: { endpoint: '/users', labelKey: 'name', params: { role: 'CLIENTE' }, placeholder: 'Selecione o cliente' } },
    { name: 'barbershopId', label: 'Barbearia', type: 'select', required: true, lookup: { endpoint: '/barbershops', labelKey: 'name', placeholder: 'Selecione a barbearia' } },
    { name: 'appointmentId', label: 'Agendamento', type: 'select', required: true, lookup: { endpoint: '/appointments', labelKey: 'date', placeholder: 'Selecione o agendamento' } },
    { name: 'rating', label: 'Nota', type: 'select', required: true, options: [1, 2, 3, 4, 5].map(n => ({ value: n, label: `${n} estrela${n > 1 ? 's' : ''}` })) },
    { name: 'comment', label: 'Comentário', type: 'textarea' },
    { name: 'isActive', label: 'Status', type: 'checkbox' },
  ],
  columns: [
    { key: 'id', header: 'ID' },
    { key: 'userId', header: 'Cliente', lookup: { endpoint: '/users', labelKey: 'name' } },
    { key: 'barbershopId', header: 'Barbearia', lookup: { endpoint: '/barbershops', labelKey: 'name' } },
    { key: 'appointmentId', header: 'Agendamento', lookup: { endpoint: '/appointments', labelKey: 'date' } },
    { key: 'rating', header: 'Nota' },
    { key: 'comment', header: 'Comentário' },
    { key: 'isActive', header: 'Status', type: 'boolean' },
  ],
} as const;

export default function Page() {
  return (
    <ProtectedPage href="/avaliacoes">
      {user => (
        <GenericCrudPage
          config={{
            ...config,
            disableCreate: user.role !== 'CLIENTE',
          } as any}
          user={user}
        />
      )}
    </ProtectedPage>
  );
}
``
