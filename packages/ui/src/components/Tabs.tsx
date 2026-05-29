import React from 'react';
import * as RadixTabs from '@radix-ui/react-tabs';
import { cn } from '../lib/utils';

export interface TabItem { value: string; label: string; icon?: React.ReactNode; badge?: string | number; }

export interface TabsProps {
  tabs: TabItem[];
  value: string;
  onValueChange: (v: string) => void;
  children: React.ReactNode;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, value, onValueChange, children, className }) => (
  <RadixTabs.Root value={value} onValueChange={onValueChange} className={className}>
    <RadixTabs.List className="flex items-center gap-1 border-b border-[#BDC3C7] mb-4">
      {tabs.map(tab => (
        <RadixTabs.Trigger
          key={tab.value}
          value={tab.value}
          className={cn(
            'flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-500 border-b-2 border-transparent -mb-px transition-colors',
            'hover:text-[#2C3E50]',
            'data-[state=active]:text-[#E67E22] data-[state=active]:border-[#E67E22]'
          )}
        >
          {tab.icon}
          {tab.label}
          {tab.badge !== undefined && (
            <span className="ml-1 rounded-full bg-[#E67E22] px-1.5 py-0.5 text-[10px] font-bold text-white">{tab.badge}</span>
          )}
        </RadixTabs.Trigger>
      ))}
    </RadixTabs.List>
    {children}
  </RadixTabs.Root>
);

export const TabContent: React.FC<{ value: string; children: React.ReactNode }> = ({ value, children }) => (
  <RadixTabs.Content value={value}>{children}</RadixTabs.Content>
);