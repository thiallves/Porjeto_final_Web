'use client';
import { useEffect, useMemo, useState } from 'react';
import { Eye, Pencil, Plus, Trash2 } from 'lucide-react';
import { ProtectedPage } from '@/components/auth/ProtectedPage';
import { AppButton } from '@/components/ui/AppButton';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { EntityModal } from '@/components/forms/EntityModal';
import { ServiceForm } from '@/components/forms/ServiceForm';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { label, money } from '@/src/lib/format';
import { isEmployee } from '@/src/lib/permissions';
import type { Barbershop, Paginated, Service, User } from '@/src/types/api';
import { createService, deleteService, listServices, updateService } from '@/src/services/services.service';
import { listBarbershops } from '@/src/services/barbershops.service';

function ServicesContent({ user }: { user: User }) {
  const [barbershopId, setBarbershopId] = useState('');
  const canWrite = isEmployee(user);
  const [items, setItems] = useState<Paginated<Service>>({ data: [], total: 0, page: 1, limit: 10, lastPage: 1 });
  const [barbershops, setBarbershops] = useState<Barbershop[]>([]);
  const [name, setName] = useState('');
  const [isActive, setIsActive] = useState('');
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState<'create' | 'edit' | 'view' | null>(null);
  const [selected, setSelected] = useState<Service | null>(null);
  const [removeId, setRemoveId] = useState<number | null>(null);

  const unitsById = useMemo(() => Object.fromEntries(barbershops.map(item => [item.id, item])), [barbershops]);

  useEffect(() => {
    listBarbershops({ page: 1, limit: 100 }).then(data => setBarbershops(data.data || [])).catch(() => undefined);
  }, []);

  async function load(page = items.page) {
    setLoading(true);
    try { setItems(await listServices({ page, limit: 10, name, isActive, barbershopId: barbershopId || undefined, })); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(1); }, [name, isActive, barbershopId]);

  const columns: Column<Service>[] = [
    { header: 'Serviço', render: r => label(r.name) },
    { header: 'Preço', render: r => money(r.price) },
    { header: 'Duração', render: r => `${r.duration} min` },
    { header: 'Barbearia', render: r => unitsById[r.barbershopId]?.name || `Barbearia ${r.barbershopId}` },
    { header: 'Status', render: r => <StatusBadge value={r.isActive} /> },
    { header: 'Ações', render: r => <div className="row-actions"><button onClick={() => { setSelected(r); setModal('view') }} title="Visualizar"><Eye size={16} /></button>{canWrite && <><button onClick={() => { setSelected(r); setModal('edit') }} title="Editar"><Pencil size={16} /></button><button onClick={() => setRemoveId(r.id)} title="Excluir"><Trash2 size={16} /></button></>}</div> }
  ];

  return <>
    <DataTable title="Serviços" description={canWrite ? 'Gerencie os serviços disponíveis.' : 'Consulte serviços disponíveis antes de agendar.'} columns={columns} rows={items.data} loading={loading} total={items.total} page={items.page} lastPage={items.lastPage} onPageChange={load} filters={
      <>
        <select
          className="filter-input"
          value={name}
          onChange={e => setName(e.target.value)}
        >
          <option value="">Todos os serviços</option>
          <option value="CORTE_MAQUINA">Corte Máquina</option>
          <option value="CORTE_TESOURA">Corte Tesoura</option>
          <option value="BARBA">Barba</option>
        </select>

        <select
          className="filter-input"
          value={isActive}
          onChange={e => setIsActive(e.target.value)}
        >
          <option value="">Todos os status</option>
          <option value="true">Ativos</option>
          <option value="false">Inativos</option>
        </select>

        <select
          className="filter-input"
          value={barbershopId}
          onChange={e => setBarbershopId(e.target.value)}
        >
          <option value="">Todas as barbearias</option>
          {barbershops.map(item => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </>
    } actions={canWrite ? <AppButton onClick={() => { setSelected(null); setModal('create') }}><Plus size={16} /> Novo serviço</AppButton> : null} />
    <EntityModal open={modal === 'create' || modal === 'edit'} title={modal === 'edit' ? 'Editar serviço' : 'Criar serviço'} onClose={() => setModal(null)}><ServiceForm initial={selected} onCancel={() => setModal(null)} onSubmit={async payload => { selected ? await updateService(selected.id, payload) : await createService(payload); setModal(null); load(1); }} /></EntityModal>
    <EntityModal open={modal === 'view'} title="Detalhes do serviço" onClose={() => setModal(null)}>{selected && <div className="detail-grid"><span>Serviço<strong>{label(selected.name)}</strong></span><span>Preço<strong>{money(selected.price)}</strong></span><span>Duração<strong>{selected.duration} min</strong></span><span>Barbearia<strong>{unitsById[selected.barbershopId]?.name || selected.barbershopId}</strong></span><span>Status<strong>{selected.isActive ? 'Ativo' : 'Inativo'}</strong></span></div>}</EntityModal>
    <ConfirmDialog open={removeId !== null} title="Excluir serviço" description="Essa ação não poderá ser desfeita." onCancel={() => setRemoveId(null)} onConfirm={async () => { if (removeId) await deleteService(removeId); setRemoveId(null); load(1); }} />
  </>;
}

export default function ServicesPage() {
  return <ProtectedPage href="/servicos">{user => <ServicesContent user={user} />}</ProtectedPage>;
}
