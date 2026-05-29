import React from 'react';
import { cn } from '../lib/utils';
import { ChevronRight } from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  badge?: number | string;
  active?: boolean;
}

export interface SidebarNavProps {
  items: NavItem[];
  title?: string;
  className?: string;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({ items, title, className }) => (
  <nav className={cn('flex flex-col gap-1', className)}>
    {title && (
      <h4 className="mb-2 px-4 text-xs font-semibold tracking-wider text-[#BDC3C7] uppercase">
        {title}
      </h4>
    )}
    {items.map((item, index) => (
      <a
        key={index}
        href={item.href}
        className={cn(
          'group flex items-center justify-between rounded-md px-4 py-2.5 text-sm font-medium transition-colors',
          item.active
            ? 'bg-[#E67E22]/10 text-[#E67E22]'
            : 'text-[#BDC3C7] hover:bg-[#1a252f] hover:text-white'
        )}
      >
        <div className="flex items-center gap-3">
          {item.icon && (
            <div className={cn('h-5 w-5', item.active ? 'text-[#E67E22]' : 'text-[#BDC3C7] group-hover:text-white')}>
              {item.icon}
            </div>
          )}
          <span>{item.label}</span>
        </div>
        <div className="flex items-center gap-2">
          {item.badge !== undefined && (
            <span className={cn(
              'flex h-5 items-center justify-center rounded-full px-2 text-[10px] font-bold',
              item.active ? 'bg-[#E67E22] text-white' : 'bg-[#1a252f] text-[#BDC3C7]'
            )}>
              {item.badge}
            </span>
          )}
          {item.active && <ChevronRight className="h-4 w-4 text-[#E67E22]" />}
        </div>
      </a>
    ))}
  </nav>
);