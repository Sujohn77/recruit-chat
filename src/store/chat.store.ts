import { getProcessedSnapshots } from "firebase/config";
import sortBy from "lodash/sortBy";
import moment from "moment";
import { IMessage, ISnapshot } from "services/types";
import { IMessageID } from "utils/types";
import { create } from "zustand";

export interface IChatState {
  messages: IMessage[];

  updateMessages: (messagesSnapshots: ISnapshot<IMessage>[]) => void;
  addLocalMessage: (message: IMessage) => void;
}

export const useChatStore = create<IChatState>((set, get) => ({
  messages: [],

  updateMessages(messagesSnapshots: ISnapshot<IMessage>[]) {
    const processedSnapshots = sortBy(
      getProcessedSnapshots<IMessageID, IMessage>(
        get().messages,
        messagesSnapshots,
        "chatItemId",
        [],
        "localId"
      ),
      (message) => {
        if (typeof message.dateCreated === "string") {
          return -moment(message.dateCreated).unix();
        } else if (message.dateCreated.seconds) {
          return -message.dateCreated.seconds;
        }
      }
    );

    set(() => ({ messages: processedSnapshots }));
  },
  addLocalMessage(message: IMessage) {
    set(() => ({ messages: [...get().messages, message] }));
  },
}));
