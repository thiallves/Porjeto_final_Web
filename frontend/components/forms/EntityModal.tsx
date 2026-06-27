import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import { AppButton } from '@/components/ui/AppButton';

type Props = {
  open: boolean;
  title: string;
  subtitle?: string;
  children: ReactNode;
  onClose: () => void;
};

export function EntityModal({ open, title, subtitle, children, onClose }: Props) {
  if (!open) return null;
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-card">
        <div className="modal-header">
          <div>
            <p className="eyebrow">Formulário</p>
            <h2>{title}</h2>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <AppButton variant="ghost" onClick={onClose} aria-label="Fechar"><X size={18} /></AppButton>
        </div>
        {children}
      </div>
    </div>
  );
}
