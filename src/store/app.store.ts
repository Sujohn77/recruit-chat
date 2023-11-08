import { create } from "zustand";

export interface AppStore {
  isLoading: boolean;

  setIsLoading: (isLoading: boolean) => void;
}

export const useAppStore = create<AppStore>((set, get) => ({
  isLoading: false,
  chatScreen: null,

  setIsLoading(isLoading: boolean) {
    set(() => ({ isLoading }));
  },
}));
