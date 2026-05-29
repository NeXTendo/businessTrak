import React from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '../lib/utils';

export interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, placeholder = 'Search…', className }) => (
  <div className={cn('relative flex items-center', className)}>
    <Search className="absolute left-3 h-4 w-4 text-[#BDC3C7] pointer-events-none" />
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="h-9 w-full rounded-md border border-[#BDC3C7] bg-white pl-9 pr-8 text-sm text-[#2C3E50] placeholder:text-[#BDC3C7] focus:outline-none focus:ring-2 focus:ring-[#E67E22] focus:border-transparent transition-colors"
    />
    {value && (
      <button onClick={() => onChange('')} className="absolute right-3 text-[#BDC3C7] hover:text-[#2C3E50] transition-colors">
        <X className="h-4 w-4" />
      </button>
    )}
  </div>
);