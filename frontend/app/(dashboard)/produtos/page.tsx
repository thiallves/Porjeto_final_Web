'use client';

import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { ProtectedPage } from '@/components/auth/ProtectedPage';
import { AppButton } from '@/components/ui/AppButton';
import { listBarbershops } from '@/src/services/barbershops.service';
import {
  createProduct,
  deleteProduct,
  listProducts,
  updateProduct,
  type Product,
} from '@/src/services/products.service';
import type { Barbershop } from '@/src/types/api';

const emptyForm = {
  name: '',
  description: '',
  price: '',
  stock: '',
  barbershopId: '',
  isActive: true,
};

export default function Page() {
  return (
    <ProtectedPage href="/produtos">
      {(user: any) => <ProductsPage user={user} />}
    </ProtectedPage>
  );
}

function ProductsPage({ user }: { user: any }) {
  const canManage = user?.role === 'ADMIN' || user?.role === 'BARBEIRO';

  const [items, setItems] = useState<Product[]>([]);
  const [barbershops, setBarbershops] = useState<Barbershop[]>([]);
  const [filters, setFilters] = useState({
    name: '',
    description: '',
    barbershopId: '',
    minPrice: '',
    maxPrice: '',
    minStock: '',
    maxStock: '',
    isActive: '',
  });
  const [appliedFilters, setAppliedFilters] = useState(filters);
  const [form, setForm] = useState<any>(emptyForm);
  const [editing, setEditing] = useState<Product | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const barbershopNameById = useMemo(() => {
    const map = new Map<number, string>();

    barbershops.forEach((item) => {
      map.set(item.id, item.name);
    });

    return map;
  }, [barbershops]);

  useEffect(() => {
    listBarbershops({ page: 1, limit: 100 })
      .then((data) => setBarbershops(data.data || []))
      .catch(() => setBarbershops([]));
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await listProducts({
        page,
        limit,
        ...appliedFilters,
      });

      setItems(response.data || []);
      setTotal(response.total || 0);
      setLastPage(response.lastPage || 1);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar produtos.');
    } finally {
      setLoading(false);
    }
  }, [page, limit, appliedFilters]);

  useEffect(() => {
    load();
  }, [load]);

  function applyFilters() {
    setPage(1);
    setAppliedFilters(filters);
  }

  function clearFilters() {
    const empty = {
      name: '',
      description: '',
      barbershopId: '',
      minPrice: '',
      maxPrice: '',
      minStock: '',
      maxStock: '',
      isActive: '',
    };

    setFilters(empty);
    setAppliedFilters(empty);
    setPage(1);
  }

  function startEdit(item: Product) {
    setEditing(item);
    setForm({
      name: item.name || '',
      description: item.description || '',
      price: String(item.price ?? ''),
      stock: String(item.stock ?? ''),
      barbershopId: item.barbershopId ? String(item.barbershopId) : '',
      isActive: item.isActive ?? true,
    });
  }

  function cancelEdit() {
    setEditing(null);
    setForm(emptyForm);
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError('');

    if (!form.name.trim()) {
      setError('Informe o nome do produto.');
      return;
    }

    if (Number(form.price) <= 0) {
      setError('O preço deve ser maior que zero.');
      return;
    }

    if (Number(form.stock) < 0) {
      setError('O estoque não pode ser negativo.');
      return;
    }

    setSaving(true);

    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        stock: Number(form.stock),
        barbershopId: form.barbershopId ? Number(form.barbershopId) : undefined,
        isActive: form.isActive,
      };

      if (editing) {
        await updateProduct(editing.id, payload);
      } else {
        await createProduct(payload);
      }

      cancelEdit();
      await load();
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar produto.');
    } finally {
      setSaving(false);
    }
  }

  async function remove(item: Product) {
    const confirmed = window.confirm(
      `Deseja realmente excluir o produto "${item.name}"?`,
    );

    if (!confirmed) return;

    try {
      await deleteProduct(item.id);
      await load();
    } catch (err: any) {
      setError(err.message || 'Erro ao excluir produto.');
    }
  }

  return (
    <main className="dashboard-page">
      <section className="page-header">
        <div>
          <h1>Produtos</h1>
          <p>Gerencie produtos vendidos na barbearia.</p>
        </div>
      </section>

      <section className="card">
        <h2>Filtros</h2>

        <div className="grid-3">
          <label>
            Nome
            <input
              placeholder="Buscar produto"
              value={filters.name}
              onChange={(e) =>
                setFilters({ ...filters, name: e.target.value })
              }
            />
          </label>

          <label>
            Descrição
            <input
              placeholder="Buscar por descrição"
              value={filters.description}
              onChange={(e) =>
                setFilters({ ...filters, description: e.target.value })
              }
            />
          </label>

          <label>
            Barbearia
            <select
              value={filters.barbershopId}
              onChange={(e) =>
                setFilters({ ...filters, barbershopId: e.target.value })
              }
            >
              <option value="">Todas</option>
              {barbershops.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Preço mínimo
            <input
              type="number"
              value={filters.minPrice}
              onChange={(e) =>
                setFilters({ ...filters, minPrice: e.target.value })
              }
            />
          </label>

          <label>
            Preço máximo
            <input
              type="number"
              value={filters.maxPrice}
              onChange={(e) =>
                setFilters({ ...filters, maxPrice: e.target.value })
              }
            />
          </label>

          <label>
            Status
            <select
              value={filters.isActive}
              onChange={(e) =>
                setFilters({ ...filters, isActive: e.target.value })
              }
            >
              <option value="">Todos</option>
              <option value="true">Ativo</option>
              <option value="false">Inativo</option>
            </select>
          </label>
        </div>

        <div className="modal-actions">
          <AppButton type="button" onClick={applyFilters}>
            Filtrar
          </AppButton>
          <AppButton type="button" variant="ghost" onClick={clearFilters}>
            Limpar
          </AppButton>
        </div>
      </section>

      {canManage && (
        <section className="card">
          <h2>{editing ? 'Editar produto' : 'Novo produto'}</h2>

          <form className="entity-form" onSubmit={submit}>
            <div className="grid-2">
              <label>
                Nome
                <input
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                />
              </label>

              <label>
                Barbearia
                <select
                  value={form.barbershopId}
                  onChange={(e) =>
                    setForm({ ...form, barbershopId: e.target.value })
                  }
                >
                  <option value="">Selecione a barbearia</option>
                  {barbershops.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label>
              Descrição
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </label>

            <div className="grid-2">
              <label>
                Preço
                <input
                  type="number"
                  step="0.01"
                  required
                  value={form.price}
                  onChange={(e) =>
                    setForm({ ...form, price: e.target.value })
                  }
                />
              </label>

              <label>
                Estoque
                <input
                  type="number"
                  required
                  value={form.stock}
                  onChange={(e) =>
                    setForm({ ...form, stock: e.target.value })
                  }
                />
              </label>
            </div>

            <label>
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) =>
                  setForm({ ...form, isActive: e.target.checked })
                }
              />
              Produto ativo
            </label>

            <div className="modal-actions">
              {editing && (
                <AppButton type="button" variant="ghost" onClick={cancelEdit}>
                  Cancelar edição
                </AppButton>
              )}
              <AppButton disabled={saving}>
                {saving ? 'Salvando...' : editing ? 'Salvar alterações' : 'Cadastrar'}
              </AppButton>
            </div>
          </form>
        </section>
      )}

      <section className="card">
        <h2>Lista de produtos</h2>

        {error && <p className="form-error">{error}</p>}

        {loading ? (
          <p>Carregando produtos...</p>
        ) : (
          <>
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>Preço</th>
                  <th>Estoque</th>
                  <th>Barbearia</th>
                  <th>Status</th>
                  {canManage && <th>Ações</th>}
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                    <td>
                      {Number(item.price).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </td>
                    <td>{item.stock}</td>
                    <td>
                      {item.barbershopId
                        ? barbershopNameById.get(item.barbershopId) ||
                          `ID ${item.barbershopId}`
                        : '-'}
                    </td>
                    <td>{item.isActive ? 'Ativo' : 'Inativo'}</td>
                    {canManage && (
                      <td>
                        <div className="modal-actions">
                          <AppButton
                            type="button"
                            variant="ghost"
                            onClick={() => startEdit(item)}
                          >
                            Editar
                          </AppButton>
                          <AppButton
                            type="button"
                            variant="ghost"
                            onClick={() => remove(item)}
                          >
                            Excluir
                          </AppButton>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}

                {items.length === 0 && (
                  <tr>
                    <td colSpan={canManage ? 7 : 6}>
                      Nenhum produto encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="modal-actions">
              <AppButton
                type="button"
                variant="ghost"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
              >
                Anterior
              </AppButton>

              <span>
                Página {page} de {lastPage} — Total: {total}
              </span>

              <AppButton
                type="button"
                variant="ghost"
                disabled={page >= lastPage}
                onClick={() => setPage(page + 1)}
              >
                Próxima
              </AppButton>
            </div>
          </>
        )}
      </section>
    </main>
  );
}