import type { ReactNode } from 'react';
import { Search } from 'lucide-react';
import { AppButton } from './AppButton';

export type Column<T> = {
  header: string;
  accessor?: keyof T;
  render?: (row: T) => ReactNode;
};

type Props<T> = {
  title: string;
  description?: string;
  columns: Column<T>[];
  rows: T[];
  loading?: boolean;
  emptyText?: string;
  searchValue?: string;
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;
  filters?: ReactNode;
  actions?: ReactNode;
  page?: number;
  lastPage?: number;
  total?: number;
  onPageChange?: (page: number) => void;
};

export function DataTable<T extends { id: number }>({
  title,
  description,
  columns,
  rows,
  loading,
  emptyText = 'Nenhum registro encontrado.',
  searchValue = '',
  searchPlaceholder = 'Filtrar...',
  onSearch,
  filters,
  actions,
  page = 1,
  lastPage = 1,
  total = 0,
  onPageChange,
}: Props<T>) {
  return (
    <section className="data-card">
      <div className="data-card__header">
        <div>
          <p className="eyebrow">Gerenciamento</p>
          <h1>{title}</h1>
          {description && <p>{description}</p>}
        </div>
        <div className="data-card__actions">{actions}</div>
      </div>

      <div className="filter-bar">
        {onSearch && (
          <label className="search-box">
            <Search size={18} />
            <input value={searchValue} onChange={(e) => onSearch(e.target.value)} placeholder={searchPlaceholder} />
          </label>
        )}
        {filters}
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>{columns.map((column) => <th key={column.header}>{column.header}</th>)}</tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={columns.length}>Carregando dados...</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={columns.length}>{emptyText}</td></tr>
            ) : rows.map((row) => (
              <tr key={row.id}>
                {columns.map((column) => (
                  <td key={column.header}>{column.render ? column.render(row) : String(row[column.accessor!] ?? '-')}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <span>Total: {total} registro(s)</span>
        <div>
          <AppButton variant="ghost" disabled={page <= 1 || loading} onClick={() => onPageChange?.(page - 1)}>Anterior</AppButton>
          <strong>{page} / {lastPage || 1}</strong>
          <AppButton variant="ghost" disabled={page >= lastPage || loading} onClick={() => onPageChange?.(page + 1)}>Próxima</AppButton>
        </div>
      </div>
    </section>
  );
}
