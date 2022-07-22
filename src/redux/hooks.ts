import { AnyAction, Dispatch } from "@reduxjs/toolkit";
import { useCallback } from "react";

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

  // export const useUpdateChatRoomMessagesCallback = (dispatch: AppDispatch, chatId: number) =>
  // useCallback(
  //   (messagesSnapshots: ISnapshot<IMessage>[]) =>
  //     dispatch({ type: chatsActionTypes.UPDATE_CHAT_ROOM_MESSAGES, chatId, messagesSnapshots }),
  //   [dispatch, chatId],
  // );