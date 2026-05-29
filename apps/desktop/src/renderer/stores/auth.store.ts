import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserRole } from '@chatowa/types';

interface AuthState {
  userId: string | null;
  userRole: UserRole | null;
  userName: string | null;
  isAuthenticated: boolean;
  accessToken: string | null;
  setUser: (id: string, role: UserRole, name: string, token: string) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      userId: null,
      userRole: null,
      userName: null,
      accessToken: null,
      isAuthenticated: false,
      setUser: (userId, userRole, userName, accessToken) => 
        set({ userId, userRole, userName, accessToken, isAuthenticated: true }),
      clearUser: () => 
        set({ userId: null, userRole: null, userName: null, accessToken: null, isAuthenticated: false }),
    }),
    {
      name: 'chatowa-auth-storage',
    }
  )
);