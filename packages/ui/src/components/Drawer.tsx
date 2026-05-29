import React from 'react';
import * as RadixDialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '../lib/utils';

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  side?: 'left' | 'right' | 'top' | 'bottom';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const sideClasses = {
  left:   'inset-y-0 left-0 h-full data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left',
  right:  'inset-y-0 right-0 h-full data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right border-l border-[#BDC3C7]',
  top:    'inset-x-0 top-0 data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top border-b border-[#BDC3C7]',
  bottom: 'inset-x-0 bottom-0 data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom border-t border-[#BDC3C7]',
};

const sizeClasses = {
  sm:   'w-80',
  md:   'w-96',
  lg:   'w-[32rem]',
  xl:   'w-[48rem]',
  full: 'w-screen',
};

const sizeClassesVertical = {
  sm:   'h-48',
  md:   'h-80',
  lg:   'h-96',
  xl:   'h-[32rem]',
  full: 'h-screen',
};

export const Drawer: React.FC<DrawerProps> = ({
  open, onClose, title, description, children, className, side = 'right', size = 'md'
}) => (
  <RadixDialog.Root open={open} onOpenChange={v => !v && onClose()}>
    <RadixDialog.Portal>
      <RadixDialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
      <RadixDialog.Content
        className={cn(
          'fixed z-50 gap-4 bg-white shadow-2xl transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500',
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          sideClasses[side],
          side === 'left' || side === 'right' ? sizeClasses[size] : sizeClassesVertical[size],
          className
        )}
      >
        <div className="flex h-full flex-col">
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
          <div className="flex-1 overflow-y-auto p-6">{children}</div>
        </div>
      </RadixDialog.Content>
    </RadixDialog.Portal>
  </RadixDialog.Root>
);