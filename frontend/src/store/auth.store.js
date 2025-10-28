import authService from "@/services/auth.service";
import { create } from "zustand";

const useAuthStore = create((set) => ({
  token: null,
  user: null,
  isLoading: true,
  checkUserAuth: async (token) => {
    set({ isLoading: true });

    if (!token) {
      set({ token: null, user: null, isLoading: false });
      return;
    }

    try {
      const res = await authService.checkUserLogin(token);
      if (!res.success) {
        set({ token: null, user: null, isLoading: false });
        return;
      }

      set({ token: token, user: res.data, isLoading: false });
    } catch (error) {
      console.log(error);
      set({ token: null, user: null, isLoading: false });
    }
  },
  setAuthLoading: (loading) => set({ isLoading: loading }), // Add this method
  logoutUserAuth: () => {
    localStorage.removeItem("agentToken");
    localStorage.removeItem("agencyToken");
    set({ token: null, user: null, isLoading: false });
  },
}));

export const useUserIsLoggedIn = () => useAuthStore((state) => !!state.token);
export const useAuthIsLoading = () => useAuthStore((state) => state.isLoading);
export default useAuthStore;
