import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useStore = create(
  persist(
    (set) => ({
      zIsLoggedIn: false,
      zEmail: "",
      zId: "",
      hasHydrated: false,
      setHasHydrated: (state) => set({ hasHydrated: state }),
      zLogin: (id, email) => set({ zIsLoggedIn: true, zEmail: email, zId: id }),
      zLogout: () => set({ zIsLoggedIn: false, zEmail: "", zId: "" }),
    }),
    {
      name: "petpal-auth-storage",
      storage: createJSONStorage(() => {
        if (typeof window !== "undefined") {
          return localStorage;
        }
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
      onRehydrateStorage: () => (state) => {
        state.setHasHydrated(true);
      },
    },
  ),
);

export default useStore;

