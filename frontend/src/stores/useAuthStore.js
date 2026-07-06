import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,         // email string
      fullName: null,     // display name
      isAuthenticated: false,
      isAdmin: false,
      
      login: (user, fullName, isAdmin = false) =>
        set({ user, fullName, isAuthenticated: true, isAdmin }),
      
      logout: () =>
        set({ user: null, fullName: null, isAuthenticated: false, isAdmin: false }),
    }),
    { name: 'auth-storage' }
  )
);
