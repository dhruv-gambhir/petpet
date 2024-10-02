import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useStore = create(
  persist(
    (set) => ({
      zIsLoggedIn: false,
      zUserId: '',
      zLogin: (userid) => set({ zIsLoggedIn: true, zUserId: userid }),
      zLogout: () => set({ zIsLoggedIn: false, zUserId: '' }),
    }),
    {
      name: 'petpal-auth-storage',
      storage:
        typeof window !== 'undefined'
          ? createJSONStorage(() => localStorage)
          : undefined,
    }
  )
);

export default useStore;

