import clsx from 'clsx';
import { label } from '@/src/lib/format';

export function StatusBadge({ value }: { value?: string | boolean }) {
  const text = typeof value === 'boolean' ? (value ? 'Ativo' : 'Inativo') : label(value);
  const kind = String(value).toLowerCase();
  return <span className={clsx('status-badge', `status-badge--${kind}`)}>{text}</span>;
}
