'use client';
import { ProtectedPage } from '@/components/auth/ProtectedPage';
import { GenericCrudPage } from '@/components/forms/GenericCrudPage';

const config = { endpoint: '/coupons', title: 'Cupons', description: 'Crie descontos para campanhas e clientes.', searchPlaceholder: 'Buscar cupom...', fields: [{ name: 'code', label: 'Código', required: true }, { name: 'description', label: 'Descrição' }, { name: 'discountPercent', label: 'Desconto %', type: 'number', required: true }, { name: 'expiresAt', label: 'Validade', type: 'date' }, { name: 'isActive', label: 'Status', type: 'checkbox' }], columns: [{ key: 'id', header: 'ID' }, { key: 'code', header: 'Código' }, { key: 'discountPercent', header: 'Desconto %' }, { key: 'expiresAt', header: 'Validade', type: 'date' }, { key: 'isActive', header: 'Status', type: 'boolean' }] } as const;

export default function Page() {
  return (
    <ProtectedPage href="/cupons">
      {user => (
        <GenericCrudPage
          config={{
            ...config,
            disableCreate:
              user.role !== 'ADMIN' && user.role !== 'BARBEIRO',
          } as any}
          user={user}
        />
      )}
    </ProtectedPage>
  );
}
