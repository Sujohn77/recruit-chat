import { create } from "zustand";

export enum ChatScreens {
  Default = "Default",
  QnA = "AskAQuestion",
  FindAJob = "FindAJob",
}

export interface AppStore {
  isLoading: boolean;
  chatScreen: ChatScreens;

  setIsLoading: (isLoading: boolean) => void;
  setChatScreen: (status: ChatScreens) => void;
}

export const useAppStore = create<AppStore>((set, get) => ({
  isLoading: false,
  chatScreen: ChatScreens.Default,

  setIsLoading(isLoading: boolean) {
    set(() => ({ isLoading }));
  },
  setChatScreen(status: ChatScreens) {
    set(() => ({ chatScreen: status }));
  },
}));
