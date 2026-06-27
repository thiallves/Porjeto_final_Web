'use client';
import { useEffect, useMemo, useState } from 'react';
import { Eye, Pencil, Plus, Trash2 } from 'lucide-react';
import { ProtectedPage } from '@/components/auth/ProtectedPage';
import { AppButton } from '@/components/ui/AppButton';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { EntityModal } from '@/components/forms/EntityModal';
import { UserForm } from '@/components/forms/UserForm';
import { StatusBadge } from '@/components/ui/StatusBadge';
import type { Barbershop, Paginated, User } from '@/src/types/api';
import { createUser, deleteUser, listUsers, updateUser } from '@/src/services/users.service';
import { listBarbershops } from '@/src/services/barbershops.service';

function UsersContent() {
  const [email, setEmail] = useState('');
  const [items, setItems] = useState<Paginated<User>>({ data: [], total: 0, page: 1, limit: 10, lastPage: 1 });
  const [barbershops, setBarbershops] = useState<Barbershop[]>([]);
  const [query, setQuery] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState<'create' | 'edit' | 'view' | null>(null);
  const [selected, setSelected] = useState<User | null>(null);
  const [removeId, setRemoveId] = useState<number | null>(null);

  const unitsById = useMemo(() => Object.fromEntries(barbershops.map(item => [item.id, item])), [barbershops]);

  useEffect(() => {
    listBarbershops({ page: 1, limit: 100 }).then(data => setBarbershops(data.data || [])).catch(() => undefined);
  }, []);

  async function load(page = items.page) {
    setLoading(true);
    try { setItems(await listUsers({ page, limit: 10, name: query, role, email, })); }
    finally { setLoading(false); }
  }

  useEffect(() => { const t = setTimeout(() => load(1), 300); return () => clearTimeout(t); }, [query, role, email]);

  const columns: Column<User>[] = [
    { header: 'Nome', accessor: 'name' },
    { header: 'E-mail', accessor: 'email' },
    { header: 'Telefone', accessor: 'phone' },
    { header: 'Perfil', render: r => <StatusBadge value={r.role} /> },
    { header: 'Barbearia', render: r => r.barbershopId ? unitsById[r.barbershopId]?.name || `Barbearia ${r.barbershopId}` : '-' },
    { header: 'Ações', render: r => <div className="row-actions"><button onClick={() => { setSelected(r); setModal('view') }} title="Visualizar"><Eye size={16} /></button><button onClick={() => { setSelected(r); setModal('edit') }} title="Editar"><Pencil size={16} /></button><button onClick={() => setRemoveId(r.id)} title="Excluir"><Trash2 size={16} /></button></div> }
  ];

  return <>
    <DataTable title="Usuários" description="Gerencie clientes, funcionários e administradores." columns={columns} rows={items.data} loading={loading} total={items.total} page={items.page} lastPage={items.lastPage} onPageChange={load} searchValue={query} onSearch={setQuery} searchPlaceholder="Filtrar por nome..." filters={
      <>
        <input
          className="filter-input"
          placeholder="Filtrar por e-mail..."
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <select
          className="filter-input"
          value={role}
          onChange={e => setRole(e.target.value)}
        >
          <option value="">Todos os perfis</option>
          <option>ADMIN</option>
          <option>BARBEIRO</option>
          <option>CLIENTE</option>
        </select>
      </>
    } actions={<AppButton onClick={() => { setSelected(null); setModal('create') }}><Plus size={16} /> Novo usuário</AppButton>} />
    <EntityModal open={modal === 'create' || modal === 'edit'} title={modal === 'edit' ? 'Editar usuário' : 'Criar usuário'} onClose={() => setModal(null)}><UserForm initial={selected} barbershops={barbershops} onCancel={() => setModal(null)} onSubmit={async payload => { selected ? await updateUser(selected.id, payload) : await createUser(payload); setModal(null); load(1); }} /></EntityModal>
    <EntityModal open={modal === 'view'} title="Detalhes do usuário" onClose={() => setModal(null)}>{selected && <div className="detail-grid"><span>Nome<strong>{selected.name}</strong></span><span>E-mail<strong>{selected.email}</strong></span><span>Telefone<strong>{selected.phone}</strong></span><span>Perfil<strong>{selected.role}</strong></span><span>Barbearia<strong>{selected.barbershopId ? unitsById[selected.barbershopId]?.name || selected.barbershopId : '-'}</strong></span></div>}</EntityModal>
    <ConfirmDialog open={removeId !== null} title="Excluir usuário" description="Essa ação não poderá ser desfeita." onCancel={() => setRemoveId(null)} onConfirm={async () => { if (removeId) await deleteUser(removeId); setRemoveId(null); load(1); }} />
  </>;
}

export default function UsersPage() {
  return <ProtectedPage href="/usuarios">{() => <UsersContent />}</ProtectedPage>;
}
