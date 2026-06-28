'use client';
import { FormEvent, ReactNode, useEffect, useMemo, useState } from 'react';
import { Edit, Eye, Plus, Trash2 } from 'lucide-react';
import { AppButton } from '@/components/ui/AppButton';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { EntityModal } from '@/components/forms/EntityModal';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { createGeneric, deleteGeneric, listGeneric, updateGeneric } from '@/src/services/generic-crud.service';
import { canManageEverything, isEmployee } from '@/src/lib/permissions';
import type { Paginated, User } from '@/src/types/api';

type SelectOption = { value: string | number; label: string };

type Field = {
  name: string;
  label: string;
  type?: 'text' | 'number' | 'date' | 'time' | 'textarea' | 'checkbox' | 'select';
  required?: boolean;
  options?: SelectOption[];
  lookup?: {
    endpoint: string;
    labelKey?: string;
    valueKey?: string;
    placeholder?: string;
    params?: Record<string, string | number | boolean | undefined>;
  };
  help?: string;
};

type Config = {
  endpoint: string;
  title: string;
  description: string;
  searchPlaceholder: string;
  filters?: {
    name: string;
    placeholder?: string;
    lookup?: {
      endpoint: string;
      labelKey?: string;
    };
  }[];
  fields: Field[];
  columns: {
    key: string;
    header: string;
    type?: 'money' | 'boolean' | 'date';
    lookup?: { endpoint: string; labelKey?: string; valueKey?: string };
  }[];
  disableCreate?: boolean;
  disableEdit?: boolean;
};

type Props = { config: Config; user: User };
type Mode = 'create' | 'edit' | 'view' | null;

type LookupState = Record<string, SelectOption[]>;



function optionLabel(item: any, labelKey = 'name') {
  const main = item?.[labelKey] ?? item?.name ?? item?.code ?? item?.email ?? item?.title ?? item?.id;
  if (item?.email && labelKey !== 'email') return `${main} - ${item.email}`;
  if (item?.city && labelKey !== 'city') return `${main} - ${item.city}`;
  if (item?.date) return `${main} - ${new Date(item.date).toLocaleString('pt-BR')}`;
  return String(main ?? '-');
}

function keyFor(endpoint: string, name?: string) {
  return `${endpoint}:${name || ''}`;
}

function emptyForm(fields: Field[]) {
  return fields.reduce<Record<string, any>>((acc, field) => {
    if (field.type === 'checkbox') acc[field.name] = true;
    else if (field.type === 'select' && field.options?.length) acc[field.name] = field.required ? String(field.options[0].value) : '';
    else acc[field.name] = '';
    return acc;
  }, {});
}

function normalizePayloadValue(key: string, value: any) {
  if (value === '') return null;
  if (['barbershopId', 'professionalId', 'userId', 'appointmentId', 'serviceId', 'barberId', 'stock', 'rating', 'discountPercent', 'dayOfWeek', 'duration'].includes(key)) return Number(value);
  if (key === 'price') return Number(value);
  return value;
}

export function GenericCrudPage({ config, user }: Props) {

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };


  {/*const [filters, setFilters] = useState({
    name: '',
    email: '',
    specialty: '',
    barbershopId: '',
    isActive: '',
  });*/}

  const [filters, setFilters] = useState<Record<string, any>>({});

  const [rows, setRows] = useState<any[]>([]);
  const [pagination, setPagination] = useState<Paginated<any> | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const [mode, setMode] = useState<Mode>(null);
  const [selected, setSelected] = useState<any | null>(null);
  const [form, setForm] = useState<Record<string, any>>(emptyForm(config.fields));
  const [error, setError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [lookups, setLookups] = useState<LookupState>({});

  const canWrite = isEmployee(user);
  const canDelete = canManageEverything(user);

  async function loadLookups() {
    const lookupConfigs = [
      ...config.fields.filter(f => f.lookup).map(f => ({ ...f.lookup!, name: f.name })),
      ...config.columns.filter(c => c.lookup).map(c => ({ ...c.lookup!, name: c.key })),
    ];

    const unique = lookupConfigs.filter((lookup, index, arr) => (
      arr.findIndex(item => keyFor(item.endpoint, item.name) === keyFor(lookup.endpoint, lookup.name)) === index
    ));

    const result: LookupState = {};
    await Promise.all(unique.map(async lookup => {
      try {
        const data = await listGeneric<any>(lookup.endpoint, { page: 1, limit: 100, ...(('params' in lookup && lookup.params) || {}) });
        result[keyFor(lookup.endpoint, lookup.name)] = (data.data || []).map((item: any) => ({
          value: item[lookup.valueKey || 'id'],
          label: optionLabel(item, lookup.labelKey),
        }));
      } catch {
        result[keyFor(lookup.endpoint, lookup.name)] = [];
      }
    }));
    setLookups(prev => ({ ...prev, ...result }));
  }

  async function load() {
    setLoading(true);

    try {
      let params: any = {
        page,
        limit: 10,
      };

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          params[key] = value;
        }
      });

      console.log('PARAMS ENVIADOS:', params);

      const data = await listGeneric<any>(config.endpoint, params);

      setRows(data.data || []);
      setPagination(data);

    } finally {
      setLoading(false);
    }
  }


  useEffect(() => { loadLookups(); }, [config.endpoint]);
  useEffect(() => { load(); }, [page, filters]);

  function lookupLabel(endpoint: string, fieldName: string, value: unknown) {
    const options = lookups[keyFor(endpoint, fieldName)] || [];
    return options.find(option => String(option.value) === String(value))?.label || String(value ?? '-');
  }

  function formatValue(value: unknown, type?: string, column?: Config['columns'][number]): ReactNode {
    if (value === undefined || value === null || value === '') return '-';
    if (column?.lookup) return lookupLabel(column.lookup.endpoint, column.key, value);
    if (type === 'money') return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    if (type === 'boolean') return <StatusBadge value={Boolean(value)} />;
    if (type === 'date') return new Date(String(value)).toLocaleDateString('pt-BR');
    return String(value);
  }

  const columns = useMemo<Column<any>[]>(() => [
    ...config.columns.map(column => ({
      header: column.header,
      render: (row: any) => formatValue(row[column.key], column.type, column),
    })),
    {
      header: 'Ações',
      render: (row: any) => <div className="row-actions">
        <button title="Visualizar" onClick={() => { setSelected(row); setMode('view'); }}><Eye size={16} /></button>
        {config.endpoint !== '/reviews' && canWrite && <button title="Editar" onClick={() => {
          setSelected(row);

          const cleanRow = Object.fromEntries(
            Object.entries(row).filter(([key]) =>
              config.fields.some(f => f.name === key)
            )
          );

          setForm({ ...emptyForm(config.fields), ...cleanRow });

          setMode('edit');
        }}>
          <Edit size={16} /></button>}
        {canDelete && <button title="Excluir" onClick={() => setDeleteTarget(row)}><Trash2 size={16} /></button>}
      </div>,
    },
  ], [config, canWrite, canDelete, lookups]);

  function openCreate() {
    setError('');
    const base = emptyForm(config.fields);
    config.fields.forEach(field => {
      if (field.lookup && field.required) {
        const opts = lookups[keyFor(field.lookup.endpoint, field.name)] || [];
        if (opts.length) base[field.name] = String(opts[0].value);
      }
    });
    setForm(base);
    setSelected(null);
    setMode('create');
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError('');
    try {



      const allowedKeys = config.fields.map(f => f.name);

      const payload: any = {};


      config.fields.forEach(field => {
        const key = field.name;
        const value = normalizePayloadValue(key, form[key]);

        if (value === '' || value === null || value === undefined) return;
        payload[key] = value;
      });

      console.log('FORM:', form);
      console.log('PAYLOAD FINAL:', payload);



      if (mode === 'edit' && selected) await updateGeneric(config.endpoint, selected.id, payload);
      else await createGeneric(config.endpoint, payload);
      setMode(null);
      await load();
      await loadLookups();
    } catch (err: any) {
      setError(err?.message || 'Não foi possível salvar.');

    }


  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    await deleteGeneric(config.endpoint, deleteTarget.id);
    setDeleteTarget(null);
    await load();
    await loadLookups();
  }

  function renderField(field: Field) {
    const value = form[field.name] ?? '';
    if (field.type === 'checkbox') {
      return <label key={field.name}>{field.label}
        <select value={String(Boolean(value))} onChange={e => setForm(prev => ({ ...prev, [field.name]: e.target.value === 'true' }))}>
          <option value="true">Ativo</option>
          <option value="false">Inativo</option>
        </select>
        {field.help && <small>{field.help}</small>}
      </label>;
    }

    if (field.type === 'select' || field.lookup) {
      const options = field.lookup ? (lookups[keyFor(field.lookup.endpoint, field.name)] || []) : (field.options || []);
      return <label key={field.name}>{field.label}
        <select required={field.required} value={value} onChange={e => setForm(prev => ({ ...prev, [field.name]: e.target.value }))}>
          {!field.required && <option value="">Nenhum</option>}
          {field.lookup?.placeholder && <option value="" disabled={field.required}>{field.lookup.placeholder}</option>}
          {options.map(option => <option key={String(option.value)} value={String(option.value)}>{option.label}</option>)}
        </select>
        {field.help && <small>{field.help}</small>}
      </label>;
    }

    if (field.type === 'textarea') {
      return <label key={field.name}>{field.label}
        <textarea required={field.required} value={value} onChange={e => setForm(prev => ({ ...prev, [field.name]: e.target.value }))} />
        {field.help && <small>{field.help}</small>}
      </label>;
    }

    return <label key={field.name}>{field.label}
      <input required={field.required} type={field.type || 'text'} value={value} onChange={e => setForm(prev => ({ ...prev, [field.name]: e.target.value }))} />
      {field.help && <small>{field.help}</small>}
    </label>;
  }

  return <div className="page-stack">
    <DataTable
      title={config.title}
      description={config.description}
      rows={rows}
      columns={columns}
      loading={loading}
      searchValue={search}
      /*searchPlaceholder={config.searchPlaceholder}
      onSearch={(value) => { setSearch(value); setPage(1); }}*/
      page={page}
      total={pagination?.total || 0}
      lastPage={pagination?.lastPage || 1}
      onPageChange={setPage}
      actions={
        !config.disableCreate && (
          <AppButton onClick={openCreate}>
            <Plus size={18} /> Novo
          </AppButton>
        )
      }


    filters={
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>

        {config.filters?.map((filter) => {

          if (!filter.lookup) {
            return (
              <input
                key={filter.name}
                className="filter-input"
                placeholder={filter.placeholder}
                value={(filters as any)[filter.name] || ''}
                onChange={(e) =>
                  handleFilterChange(filter.name, e.target.value)
                }
              />
            );
          }


          const options =
            lookups[keyFor(filter.lookup.endpoint, filter.name)] || [];

          return (
            <select
              key={filter.name}
              className="filter-input"
              value={(filters as any)[filter.name] || ''}
              onChange={(e) =>
                handleFilterChange(filter.name, e.target.value)
              }
            >
              <option value="">{filter.placeholder}</option>

              {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          );
        })}

      </div>
    }

    />

    <EntityModal open={mode === 'create' || mode === 'edit'} title={mode === 'edit' ? `Editar ${config.title}` : `Novo registro`} onClose={() => setMode(null)}>
      <form onSubmit={submit} className="entity-form">
        <div className="grid-2">{config.fields.map(renderField)}</div>
        {error && <p className="form-error">{error}</p>}
        <div className="modal-actions"><AppButton type="button" variant="ghost" onClick={() => setMode(null)}>Cancelar</AppButton><AppButton>Salvar</AppButton></div>
      </form>
    </EntityModal>

    <EntityModal open={mode === 'view'} title="Detalhes" onClose={() => setMode(null)}>
      {selected && <div className="detail-grid">
        {config.columns.map(column => <span key={column.key}>{column.header}<strong>{formatValue(selected[column.key], column.type, column)}</strong></span>)}
      </div>}
    </EntityModal>

    <ConfirmDialog open={!!deleteTarget} title="Excluir registro" description="Essa ação não poderá ser desfeita." onCancel={() => setDeleteTarget(null)} onConfirm={confirmDelete} />
  </div>;
}
