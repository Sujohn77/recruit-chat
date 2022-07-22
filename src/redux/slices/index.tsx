import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IMessage } from "saga/types";
import { CHAT_OPTIONS } from "screens/intro";
import { defaultChatHistory } from "utils/constants";
import {
  CHAT_TYPE_MESSAGES,
  IContent,
  ILocalMessage,
  IState,
  Status,
} from "./types";

const initialState: IState = {
  option: null,
  messages: [],
  serverMessages: [],
  status: Status.DONE,
};

const name = "chat";

// export const initChat = createSagaAction`${name}/initChat`);
// export const doSomeMoreAsyncStuff = createSagaAction(`${name}/doSomeMoreAsyncStuff`)

const chatSlice = createSlice({
  name,
  initialState: initialState,
  reducers: {
    initChat: (state) => {
      state.status = Status.PENDING;
    },
    addMessage: (state, action: PayloadAction<string>) => {
      const createdAt = `${new Date()}`;
      const content: IContent = {
        subType: CHAT_TYPE_MESSAGES.TEXT,
        subTypeId: 1,
        text: action.payload,
      };
      state.status = Status.PENDING;
      state.messages.push({
        createdAt,
        content,
        messageId: state.messages.length + 1,
      });
    },

    pushMessage: (state, action: PayloadAction<ILocalMessage[]>) => {
      state.messages = [...state.messages, ...action.payload];
    },

    setOption: (state, action: PayloadAction<CHAT_OPTIONS | null>) => {
      if (action.payload !== null && !state.messages.length) {
        const chat = defaultChatHistory[action.payload];
        const createdAt = `${new Date()}`;
        console.log(action.type);
        const ownerId = `${Math.random() * 500}`;
        for (const msg of chat.initialMessages) {
          if (msg.isOwner) {
            chatSlice.caseReducers.addMessage(state, {
              type: "chat/addMessage",
              payload: msg.text,
            });
          } else {
            const content: IContent = {
              subType: CHAT_TYPE_MESSAGES.TEXT,
              subTypeId: 1,
              text: msg.text,
            };
            state.messages.push({
              createdAt,
              content,
              messageId: state.messages.length + 1,
              isReceived: !msg.isOwner,
            });
          }
        }

        state.ownerId = ownerId;
        localStorage.setItem("ownerId", ownerId);
      }
      state.option = action.payload;
    },

    updateMessages: (state, action: PayloadAction<IMessage[]>) => {
      state.serverMessages = action.payload;
    },
  },
});

export const { setOption, addMessage, pushMessage, initChat, updateMessages } =
  chatSlice.actions;
export default chatSlice.reducer;
