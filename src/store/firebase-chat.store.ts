import { create } from "zustand";
import sortBy from "lodash/sortBy";
import moment from "moment";

import { getProcessedSnapshots } from "firebase/config";
import { IMessage, ISnapshot } from "services/types";
import { IMessageID } from "utils/types";

export interface IChatState {
  messages: IMessage[];

  updateMessages: (messagesSnapshots: ISnapshot<IMessage>[]) => void;
  addLocalMessage: (message: IMessage) => void;
}

export const useFirebaseChatStore = create<IChatState>((set, get) => ({
  messages: [],

  updateMessages(messagesSnapshots: ISnapshot<IMessage>[]) {
    const processedSnapshots = sortBy(
      getProcessedSnapshots<IMessageID, IMessage>(
        get().messages,
        messagesSnapshots,
        "chatItemId",
        ["subType"],
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