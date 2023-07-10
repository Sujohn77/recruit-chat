import { ILocalMessage } from "utils/types";
import { create } from "zustand";

export interface IChatState {
  messages: ILocalMessage[];

  addNewMessages: (messagesSnapshots: ILocalMessage[]) => void;
}

export const useChatStore = create<IChatState>((set, get) => ({
  messages: [],

  addNewMessages(messages: ILocalMessage[]) {
    set(() => ({ messages: [...messages, ...get().messages] }));
  },
}));
