import React from 'react';
import * as RadixAvatar from '@radix-ui/react-avatar';
import { cn } from '../lib/utils';

export interface AvatarProps {
  src?: string | null;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeMap = { sm: 'h-7 w-7 text-xs', md: 'h-9 w-9 text-sm', lg: 'h-12 w-12 text-base', xl: 'h-16 w-16 text-xl' };

function initials(name?: string) {
  if (!name) return '?';
  return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
}

export const Avatar: React.FC<AvatarProps> = ({ src, name, size = 'md', className }) => (
  <RadixAvatar.Root className={cn('relative flex shrink-0 overflow-hidden rounded-full', sizeMap[size], className)}>
    <RadixAvatar.Image src={src ?? undefined} alt={name} className="aspect-square h-full w-full object-cover" />
    <RadixAvatar.Fallback className="flex h-full w-full items-center justify-center bg-[#2C3E50] text-white font-semibold">
      {initials(name)}
    </RadixAvatar.Fallback>
  </RadixAvatar.Root>
);