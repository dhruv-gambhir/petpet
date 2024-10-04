import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useStore = create(
  persist(
    (set) => ({
      zIsLoggedIn: false,
      zEmail: "",
      zLogin: (email) => set({ zIsLoggedIn: true, zEmail: email }),
      zLogout: () => set({ zIsLoggedIn: false, zEmail: "" }),
    }),
    {
      name: "petpal-auth-storage",
      storage:
        typeof window !== "undefined"
          ? createJSONStorage(() => localStorage)
          : undefined,
    },
  ),
);

export default useStore;
