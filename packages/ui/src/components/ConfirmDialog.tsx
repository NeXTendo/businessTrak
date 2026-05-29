import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle } from 'lucide-react';

export interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'default';
  loading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open, onClose, onConfirm, title, description, confirmLabel = 'Confirm', cancelLabel = 'Cancel', variant = 'danger', loading,
}) => (
  <Modal open={open} onClose={onClose} size="sm">
    <div className="flex flex-col items-center text-center gap-4">
      <div className={`rounded-full p-3 ${variant === 'danger' ? 'bg-red-100' : 'bg-amber-100'}`}>
        <AlertTriangle className={`h-6 w-6 ${variant === 'danger' ? 'text-red-600' : 'text-amber-600'}`} />
      </div>
      <div>
        <h3 className="text-base font-semibold text-[#2C3E50]">{title}</h3>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </div>
      <div className="flex gap-3 w-full">
        <Button variant="outline" className="flex-1" onClick={onClose} disabled={loading}>{cancelLabel}</Button>
        <Button variant={variant === 'danger' ? 'danger' : 'default'} className="flex-1" onClick={onConfirm} loading={loading}>{confirmLabel}</Button>
      </div>
    </div>
  </Modal>
);