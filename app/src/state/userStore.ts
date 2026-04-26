import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface User {
  id: string;
  username: string;
  rating: number;
}

interface UserState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

interface UserActions {
  login: (user: User, token: string) => Promise<void>;
  register: (user: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
  updateRating: (rating: number) => void;
  loadSession: () => Promise<void>;
}

export const useUserStore = create<UserState & UserActions>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  login: async (user, token) => {
    await AsyncStorage.multiSet([
      ["user", JSON.stringify(user)],
      ["token", token],
    ]);
    set({ user, token, isAuthenticated: true });
  },

  register: async (user, token) => {
    await AsyncStorage.multiSet([
      ["user", JSON.stringify(user)],
      ["token", token],
    ]);
    set({ user, token, isAuthenticated: true });
  },

  logout: async () => {
    await AsyncStorage.multiRemove(["user", "token"]);
    set({ user: null, token: null, isAuthenticated: false });
  },

  updateRating: (rating) =>
    set((s) => ({ user: s.user ? { ...s.user, rating } : null })),

  loadSession: async () => {
    const [userJson, token] = await AsyncStorage.multiGet(["user", "token"]);
    if (userJson[1] && token[1]) {
      set({
        user: JSON.parse(userJson[1]),
        token: token[1],
        isAuthenticated: true,
      });
    }
  },
}));
