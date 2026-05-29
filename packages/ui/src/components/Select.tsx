import React from 'react';
import * as RadixSelect from '@radix-ui/react-select';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '../lib/utils';

export interface SelectOption { value: string; label: string; disabled?: boolean; }

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  hint?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  id?: string;
}

export const Select: React.FC<SelectProps> = ({
  options, value, onValueChange, placeholder = 'Select…', label, error, hint, disabled, required, className, id,
}) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-[#2C3E50]">
          {label}{required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <RadixSelect.Root value={value} onValueChange={onValueChange} disabled={disabled}>
        <RadixSelect.Trigger
          id={inputId}
          className={cn(
            'flex h-9 w-full items-center justify-between rounded-md border border-[#BDC3C7] bg-white px-3 py-1 text-sm text-[#2C3E50] transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-[#E67E22] focus:border-transparent',
            'disabled:cursor-not-allowed disabled:bg-[#F4F6F7] disabled:opacity-60',
            !value && 'text-[#BDC3C7]',
            error && 'border-red-500',
            className
          )}
        >
          <RadixSelect.Value placeholder={placeholder} />
          <RadixSelect.Icon><ChevronDown className="h-4 w-4 opacity-60" /></RadixSelect.Icon>
        </RadixSelect.Trigger>
        <RadixSelect.Portal>
          <RadixSelect.Content className="z-50 min-w-[8rem] overflow-hidden rounded-md border border-[#BDC3C7] bg-white shadow-lg animate-in fade-in-0 zoom-in-95">
            <RadixSelect.Viewport className="p-1">
              {options.map(opt => (
                <RadixSelect.Item
                  key={opt.value}
                  value={opt.value}
                  disabled={opt.disabled}
                  className="relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm text-[#2C3E50] outline-none hover:bg-[#F4F6F7] focus:bg-[#F4F6F7] data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                >
                  <RadixSelect.ItemIndicator className="absolute left-2 flex items-center justify-center">
                    <Check className="h-4 w-4 text-[#E67E22]" />
                  </RadixSelect.ItemIndicator>
                  <RadixSelect.ItemText>{opt.label}</RadixSelect.ItemText>
                </RadixSelect.Item>
              ))}
            </RadixSelect.Viewport>
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>
      {error && <p className="text-xs text-red-500">{error}</p>}
      {hint && !error && <p className="text-xs text-gray-500">{hint}</p>}
    </div>
  );
};