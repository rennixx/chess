import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Language = "en" | "sorani" | "kurmanji";

interface SettingsState {
  language: Language;
  boardTheme: string;
}

interface SettingsActions {
  setLanguage: (lang: Language) => Promise<void>;
  setBoardTheme: (theme: string) => void;
  loadSettings: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState & SettingsActions>(
  (set) => ({
    language: "en",
    boardTheme: "default",

    setLanguage: async (lang) => {
      await AsyncStorage.setItem("language", lang);
      set({ language: lang });
    },

    setBoardTheme: (theme) => set({ boardTheme: theme }),

    loadSettings: async () => {
      const saved = await AsyncStorage.getItem("language");
      set({ language: saved ? (saved as Language) : "en" });
    },
  })
);
