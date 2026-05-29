import { create } from 'zustand';
import { IVehicle, VehicleStatus } from '@chatowa/types';

interface FleetState {
  vehicles: IVehicle[];
  selectedVehicleId: string | null;
  searchQuery: string;
  statusFilter: VehicleStatus | 'all';
  
  setVehicles: (vehicles: IVehicle[]) => void;
  setSelectedVehicleId: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: VehicleStatus | 'all') => void;
}

export const useFleetStore = create<FleetState>((set) => ({
  vehicles: [],
  selectedVehicleId: null,
  searchQuery: '',
  statusFilter: 'all',
  
  setVehicles: (vehicles) => set({ vehicles }),
  setSelectedVehicleId: (id) => set({ selectedVehicleId: id }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setStatusFilter: (status) => set({ statusFilter: status }),
}));
