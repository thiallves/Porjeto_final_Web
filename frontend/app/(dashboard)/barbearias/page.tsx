'use client';
import { useEffect, useState } from 'react';
import { Eye, Pencil, Plus, Trash2 } from 'lucide-react';
import { ProtectedPage } from '@/components/auth/ProtectedPage';
import { AppButton } from '@/components/ui/AppButton';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { EntityModal } from '@/components/forms/EntityModal';
import { BarbershopForm } from '@/components/forms/BarbershopForm';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { canManageEverything } from '@/src/lib/permissions';
import type { Barbershop, Paginated, User } from '@/src/types/api';
import { createBarbershop, deleteBarbershop, listBarbershops, updateBarbershop } from '@/src/services/barbershops.service';

function BarbershopsContent({ user }: { user: User }) {
  const [neighborhood, setNeighborhood] = useState('');
  const isAdmin = canManageEverything(user);
  const [items, setItems] = useState<Paginated<Barbershop>>({ data: [], total: 0, page: 1, limit: 10, lastPage: 1 });
  const [query, setQuery] = useState(''); const [city, setCity] = useState(''); const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState<'create' | 'edit' | 'view' | null>(null); const [selected, setSelected] = useState<Barbershop | null>(null);
  const [removeId, setRemoveId] = useState<number | null>(null);
  async function load(page = items.page) { setLoading(true); try { setItems(await listBarbershops({ page, limit: 10, name: query, city, neighborhood, })); } finally { setLoading(false); } }
  useEffect(() => { const t = setTimeout(() => load(1), 300); return () => clearTimeout(t); }, [query, city, neighborhood]);
  const columns: Column<Barbershop>[] = [
    { header: 'Nome', accessor: 'name' }, { header: 'Cidade', accessor: 'city' }, { header: 'Bairro', accessor: 'neighborhood' },
    { header: 'Horário', render: r => `${r.openingTime || '-'} às ${r.closingTime || '-'}` }, { header: 'Status', render: r => <StatusBadge value={r.isActive} /> },
    { header: 'Ações', render: r => <div className="row-actions"><button onClick={() => { setSelected(r); setModal('view') }} title="Visualizar"><Eye size={16} /></button>{isAdmin && <><button onClick={() => { setSelected(r); setModal('edit') }} title="Editar"><Pencil size={16} /></button><button onClick={() => setRemoveId(r.id)} title="Excluir"><Trash2 size={16} /></button></>}</div> }
  ];
  return <>
    <DataTable title="Barbearias" description={isAdmin ? 'Cadastro de unidades com filtros por nome e cidade.' : 'Consulta de unidades disponíveis para agendamento.'} columns={columns} rows={items.data} loading={loading} total={items.total} page={items.page} lastPage={items.lastPage} onPageChange={load} searchValue={query} onSearch={setQuery} searchPlaceholder="Filtrar por nome..." filters={
      <>
        <input
          className="filter-input"
          placeholder="Cidade"
          value={city}
          onChange={e => setCity(e.target.value)}
        />

        <input
          className="filter-input"
          placeholder="Bairro"
          value={neighborhood}
          onChange={e => setNeighborhood(e.target.value)}
        />
      </>
    }
      actions={isAdmin ? <AppButton onClick={() => { setSelected(null); setModal('create') }}><Plus size={16} /> Nova barbearia</AppButton> : null} />
    <EntityModal open={modal === 'create' || modal === 'edit'} title={modal === 'edit' ? 'Editar barbearia' : 'Criar barbearia'} onClose={() => setModal(null)}><BarbershopForm initial={selected} onCancel={() => setModal(null)} onSubmit={async payload => { selected ? await updateBarbershop(selected.id, payload) : await createBarbershop(payload); setModal(null); load(1); }} /></EntityModal>
    <EntityModal open={modal === 'view'} title="Detalhes da barbearia" onClose={() => setModal(null)}>{selected && <div className="detail-grid"><span>Nome<strong>{selected.name}</strong></span><span>Endereço<strong>{selected.address}</strong></span><span>Cidade<strong>{selected.city}</strong></span><span>Bairro<strong>{selected.neighborhood}</strong></span><span>Limite diário<strong>{selected.dailyAppointmentLimit}</strong></span></div>}</EntityModal>
    <ConfirmDialog open={removeId !== null} title="Excluir barbearia" description="Essa ação está liberada apenas para ADMIN." onCancel={() => setRemoveId(null)} onConfirm={async () => { if (removeId) await deleteBarbershop(removeId); setRemoveId(null); load(1); }} />
  </>;
}

export default function BarbershopsPage() {
  return <ProtectedPage href="/barbearias">{user => <BarbershopsContent user={user} />}</ProtectedPage>;
}
