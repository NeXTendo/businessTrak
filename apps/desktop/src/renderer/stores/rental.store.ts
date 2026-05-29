import { create } from 'zustand';
import { IRental, RentalStatus } from '@chatowa/types';

interface RentalState {
  rentals: IRental[];
  selectedRentalId: string | null;
  searchQuery: string;
  statusFilter: RentalStatus | 'all';
  
  setRentals: (rentals: IRental[]) => void;
  setSelectedRentalId: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: RentalStatus | 'all') => void;
}

export const useRentalStore = create<RentalState>((set) => ({
  rentals: [],
  selectedRentalId: null,
  searchQuery: '',
  statusFilter: 'all',
  
  setRentals: (rentals) => set({ rentals }),
  setSelectedRentalId: (id) => set({ selectedRentalId: id }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setStatusFilter: (status) => set({ statusFilter: status }),
}));
