import React from 'react';
import * as RadixDialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '../lib/utils';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const sizeClasses = {
  sm:   'max-w-sm',
  md:   'max-w-lg',
  lg:   'max-w-2xl',
  xl:   'max-w-4xl',
  full: 'max-w-[90vw]',
};

export const Modal: React.FC<ModalProps> = ({ open, onClose, title, description, children, className, size = 'md' }) => (
  <RadixDialog.Root open={open} onOpenChange={v => !v && onClose()}>
    <RadixDialog.Portal>
      <RadixDialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
      <RadixDialog.Content
        className={cn(
          'fixed left-1/2 top-1/2 z-50 w-full -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white shadow-2xl',
          'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2',
          'data-[state=open]:slide-in-from-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-top-[48%]',
          sizeClasses[size],
          className
        )}
      >
        {(title || description) && (
          <div className="flex items-start justify-between border-b border-[#F4F6F7] px-6 py-4">
            <div>
              {title && <RadixDialog.Title className="text-lg font-semibold text-[#2C3E50]">{title}</RadixDialog.Title>}
              {description && <RadixDialog.Description className="mt-0.5 text-sm text-gray-500">{description}</RadixDialog.Description>}
            </div>
            <RadixDialog.Close
              onClick={onClose}
              className="rounded-md p-1 text-gray-400 hover:bg-[#F4F6F7] hover:text-[#2C3E50] transition-colors"
            >
              <X className="h-4 w-4" />
            </RadixDialog.Close>
          </div>
        )}
        <div className="px-6 py-4">{children}</div>
      </RadixDialog.Content>
    </RadixDialog.Portal>
  </RadixDialog.Root>
);