import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  tenantId: string | null;
  setAuth: (token: string, user: User) => void;
  setTenantId: (tenantId: string) => void;
  logout: () => void;
  isAdmin: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      tenantId: null,
      setAuth: (token, user) => set({ token, user }),
      setTenantId: (tenantId) => set({ tenantId }),
      logout: () => set({ token: null, user: null }),
      isAdmin: () => {
        const { user } = get();
        return user?.role === 'ADMIN' || user?.role === 'STAFF';
      },
    }),
    { name: 'auth-storage' },
  ),
);
