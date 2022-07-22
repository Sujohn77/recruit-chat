import { createAction } from "@reduxjs/toolkit";

export const initChatAction: any = createAction("INIT_CHAT");
export const sendMessageChatAction: any = createAction(
  "SEND_MESSAGE",
  chatId,
  message
);
export enum chatsActionTypes {
  OPEN_NOTIFICATION_CHAT_ROOM = "OPEN_NOTIFICATION_CHAT_ROOM",

  CREATE_CHAT_ROOM = "CREATE_CHAT_ROOM",
  INIT_CHAT = "INIT_CHAT",
  SAVE_CHAT_ROOM = "SAVE_CHAT_ROOM",

  UPDATE_CHAT_ROOMS = "UPDATE_CHAT_ROOMS",
  UPDATE_ARCHIVED_CHAT_ROOMS = "UPDATE_ARCHIVED_CHAT_ROOMS",

  UPDATE_CHAT_ROOM_MESSAGES = "UPDATE_CHAT_ROOM_MESSAGES",

  ADD_LOCAL_MESSAGE = "ADD_LOCAL_MESSAGE",

  MUTE_CHAT = "MUTE_CHAT",
  UNMUTE_CHAT = "UNMUTE_CHAT",

  SEND_MESSAGE = "SEND_MESSAGE",

  SWITCH_CHAT_PINNED_STATUS = "SWITCH_CHAT_PINNED_STATUS",
  SWITCH_PINNED_CHAT_STATUS_SUCCESS = "SWITCH_PINNED_CHAT_STATUS_SUCCESS",

  SWITCH_CHAT_ARCHIVED_STATUS = "SWITCH_CHAT_ARCHIVED_STATUS",
  SWITCH_ARCHIVED_CHAT_STATUS_SUCCESS = "SWITCH_ARCHIVED_CHAT_STATUS_SUCCESS",

  CLEAR_CHAT_STATE = "CLEAR_CHAT_STATE",
}
export default chatsActionTypes;
