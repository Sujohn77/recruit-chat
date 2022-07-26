

import { updateChatRoomMessages } from "firebase/config";
import { useCallback } from "react";
import { IMessage } from "services/types";
import { ISnapshot } from "utils/types";




export const useUpdateChatRoomMessagesCallback = ( chatId: number) =>
  useCallback((messagesSnapshots: ISnapshot<IMessage>[]) => {
    const proceedMessages = updateChatRoomMessages({rooms:[{chatId}]}, {
      messagesSnapshots,
      chatId,
    });

    return proceedMessages;
  },[chatId]
  );

 