import { create } from "zustand";

export enum ChatStatuses {
  Default = "Default",
  QnA = "AskAQuestion",
  FindAJob = "FindAJob",
}

export interface AppStore {
  isLoading: boolean;
  chatStatus: ChatStatuses;

  setIsLoading: (isLoading: boolean) => void;
  setChatStatus: (status: ChatStatuses) => void;
}

export const useAppStore = create<AppStore>((set, get) => ({
  isLoading: false,
  chatStatus: ChatStatuses.Default,

  setIsLoading(isLoading: boolean) {
    set(() => ({ isLoading }));
  },
  setChatStatus(status: ChatStatuses) {
    set(() => ({ chatStatus: status }));
  },
}));
