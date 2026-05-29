import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default:  'bg-[#2C3E50] text-white',
        orange:   'bg-[#E67E22] text-white',
        success:  'bg-emerald-100 text-emerald-800',
        warning:  'bg-amber-100 text-amber-800',
        danger:   'bg-red-100 text-red-800',
        info:     'bg-blue-100 text-blue-800',
        neutral:  'bg-[#F4F6F7] text-[#2C3E50] border border-[#BDC3C7]',
      },
    },
    defaultVariants: { variant: 'default' },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export const Badge: React.FC<BadgeProps> = ({ className, variant, ...props }) => (
  <span className={cn(badgeVariants({ variant }), className)} {...props} />
);