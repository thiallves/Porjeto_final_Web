import { AppButton } from './AppButton';

type Props = {
  open: boolean;
  title: string;
  description: string;
  onCancel: () => void;
  onConfirm: () => void;
  loading?: boolean;
};

export function ConfirmDialog({ open, title, description, onCancel, onConfirm, loading }: Props) {
  if (!open) return null;
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-card modal-card--small">
        <h2>{title}</h2>
        <p>{description}</p>
        <div className="modal-actions">
          <AppButton variant="ghost" onClick={onCancel} disabled={loading}>Cancelar</AppButton>
          <AppButton variant="danger" onClick={onConfirm} disabled={loading}>{loading ? 'Excluindo...' : 'Confirmar'}</AppButton>
        </div>
      </div>
    </div>
  );
}
