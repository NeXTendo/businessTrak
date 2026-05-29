import { create } from 'zustand';
import { ISale, SaleStatus } from '@chatowa/types';

interface SaleState {
  sales: ISale[];
  selectedSaleId: string | null;
  searchQuery: string;
  statusFilter: SaleStatus | 'all';
  
  setSales: (sales: ISale[]) => void;
  setSelectedSaleId: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: SaleStatus | 'all') => void;
}

export const useSaleStore = create<SaleState>((set) => ({
  sales: [],
  selectedSaleId: null,
  searchQuery: '',
  statusFilter: 'all',
  
  setSales: (sales) => set({ sales }),
  setSelectedSaleId: (id) => set({ selectedSaleId: id }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setStatusFilter: (status) => set({ statusFilter: status }),
}));
