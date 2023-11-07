import { create } from "zustand";

export enum ChatScreens {
  Default = "Default",
  QnA = "AskAQuestion",
  FindAJob = "FindAJob",
}

export interface AppStore {
  isLoading: boolean;
  chatScreen: ChatScreens | null;

  setIsLoading: (isLoading: boolean) => void;
  setChatScreen: (status: ChatScreens | null) => void;
}

export const useAppStore = create<AppStore>((set, get) => ({
  isLoading: false,
  chatScreen: null,

  setIsLoading(isLoading: boolean) {
    set(() => ({ isLoading }));
  },
  setChatScreen(status: ChatScreens | null) {
    set(() => ({ chatScreen: status }));
  },
}));
