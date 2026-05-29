import { create } from 'zustand';

interface AuthState {
  userId: string | null;
  isAuthenticated: boolean;
  setUser: (id: string) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  userId: null,
  isAuthenticated: false,
  setUser:   (userId: string) => set({ userId, isAuthenticated: true }),
  clearUser: () => set({ userId: null, isAuthenticated: false }),
}));