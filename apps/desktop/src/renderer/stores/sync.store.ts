import { create } from 'zustand';

type SyncStatus = 'online' | 'offline' | 'syncing' | 'error';

interface SyncState {
  status: SyncStatus;
  pendingItemsCount: number;
  lastSyncTime: string | null;
  syncError: string | null;
  
  setStatus: (status: SyncStatus) => void;
  setPendingCount: (count: number) => void;
  setLastSyncTime: (time: string) => void;
  setSyncError: (error: string | null) => void;
  incrementPending: () => void;
  decrementPending: () => void;
}

export const useSyncStore = create<SyncState>((set) => ({
  status: 'online',
  pendingItemsCount: 0,
  lastSyncTime: null,
  syncError: null,
  
  setStatus: (status) => set({ status }),
  setPendingCount: (count) => set({ pendingItemsCount: count }),
  setLastSyncTime: (time) => set({ lastSyncTime: time }),
  setSyncError: (error) => set({ syncError: error }),
  incrementPending: () => set((state) => ({ pendingItemsCount: state.pendingItemsCount + 1 })),
  decrementPending: () => set((state) => ({ pendingItemsCount: Math.max(0, state.pendingItemsCount - 1) })),
}));