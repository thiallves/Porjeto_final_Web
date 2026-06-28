'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import { ProtectedPage } from '@/components/auth/ProtectedPage';
import { AppButton } from '@/components/ui/AppButton';
import {
  createCategory,
  deleteCategory,
  listCategories,
  updateCategory,
  type Category,
} from '@/src/services/categories.service';

const emptyForm = {
  name: '',
  description: '',
  isActive: true,
};

export default function Page() {
  return (
    <ProtectedPage href="/categorias">
      {(user: any) => <CategoriesPage user={user} />}
    </ProtectedPage>
  );
}

function CategoriesPage({ user }: { user: any }) {
  const canManage = user?.role === 'ADMIN' || user?.role === 'BARBEIRO';

  const [items, setItems] = useState<Category[]>([]);
  const [filters, setFilters] = useState({
    name: '',
    description: '',
    isActive: '',
  });
  const [appliedFilters, setAppliedFilters] = useState(filters);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState<Category | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await listCategories({
        page,
        limit,
        ...appliedFilters,
      });

      setItems(response.data || []);
      setTotal(response.total || 0);
      setLastPage(response.lastPage || 1);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar categorias.');
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
      isActive: '',
    };

    setFilters(empty);
    setAppliedFilters(empty);
    setPage(1);
  }

  function startEdit(item: Category) {
    setEditing(item);
    setForm({
      name: item.name || '',
      description: item.description || '',
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
      setError('Informe o nome da categoria.');
      return;
    }

    setSaving(true);

    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        isActive: form.isActive,
      };

      if (editing) {
        await updateCategory(editing.id, payload);
      } else {
        await createCategory(payload);
      }

      cancelEdit();
      await load();
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar categoria.');
    } finally {
      setSaving(false);
    }
  }

  async function remove(item: Category) {
    const confirmed = window.confirm(
      `Deseja realmente excluir a categoria "${item.name}"?`,
    );

    if (!confirmed) return;

    try {
      await deleteCategory(item.id);
      await load();
    } catch (err: any) {
      setError(err.message || 'Erro ao excluir categoria.');
    }
  }

  return (
    <main className="dashboard-page">
      <section className="page-header">
        <div>
          <h1>Categorias</h1>
          <p>Organize os tipos de atendimento disponíveis.</p>
        </div>
      </section>

      <section className="card">
        <h2>Filtros</h2>

        <div className="grid-3">
          <label>
            Nome
            <input
              placeholder="Buscar por nome"
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
            Status
            <select
              value={filters.isActive}
              onChange={(e) =>
                setFilters({ ...filters, isActive: e.target.value })
              }
            >
              <option value="">Todos</option>
              <option value="true">Ativa</option>
              <option value="false">Inativa</option>
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
          <h2>{editing ? 'Editar categoria' : 'Nova categoria'}</h2>

          <form className="entity-form" onSubmit={submit}>
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
              Descrição
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </label>

            <label>
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) =>
                  setForm({ ...form, isActive: e.target.checked })
                }
              />
              Categoria ativa
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
        <h2>Lista de categorias</h2>

        {error && <p className="form-error">{error}</p>}

        {loading ? (
          <p>Carregando categorias...</p>
        ) : (
          <>
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>Descrição</th>
                  <th>Status</th>
                  {canManage && <th>Ações</th>}
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                    <td>{item.description || '-'}</td>
                    <td>{item.isActive ? 'Ativa' : 'Inativa'}</td>
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
                    <td colSpan={canManage ? 5 : 4}>
                      Nenhuma categoria encontrada.
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