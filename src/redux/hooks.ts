import { AnyAction, Dispatch } from "@reduxjs/toolkit";
import { useCallback } from "react";
import { sendMessage } from "saga/chat";

import { updateChatRoomMessages } from "saga/handlers";

import { IMessage } from "saga/types";
import { ISnapshot } from "utils/types";

import { updateMessages } from "./slices";


export const useUpdateChatRoomMessagesCallback = (dispatch:  Dispatch<AnyAction>, chatId: number) =>
  useCallback((messagesSnapshots: ISnapshot<IMessage>[]) => {

    const proceedMessages = updateChatRoomMessages({}, {
      messagesSnapshots,
      chatId,
    });
    console.log('proceedMessages', proceedMessages)

    return dispatch(updateMessages(proceedMessages as IMessage[]));
  },[dispatch, chatId]
  );

  export const useSendMessageCallback = (dispatch: AppDispatch) =>
  useCallback(
    (message: IApiMessage, sender: IUserSelf, chatId?: number) =>
      dispatch(sendMessage({ type: chatsActionTypes.SEND_MESSAGE, message, sender, chatId })),
    [dispatch],
  );