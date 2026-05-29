import React from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from './Button';

export interface BreadcrumbItem { label: string; href?: string; }

export interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, description, breadcrumbs, actions, className }) => (
  <div className={cn('flex items-start justify-between mb-6', className)}>
    <div className="flex flex-col gap-1">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1 text-xs text-gray-400 mb-1">
          {breadcrumbs.map((b, i) => (
            <React.Fragment key={i}>
              {i > 0 && <ChevronRight className="h-3 w-3" />}
              {b.href ? (
                <a href={b.href} className="hover:text-[#E67E22] transition-colors">{b.label}</a>
              ) : (
                <span className={i === breadcrumbs.length - 1 ? 'text-[#2C3E50] font-medium' : ''}>{b.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}
      <h1 className="text-2xl font-bold text-[#2C3E50]">{title}</h1>
      {description && <p className="text-sm text-gray-500">{description}</p>}
    </div>
    {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
  </div>
);