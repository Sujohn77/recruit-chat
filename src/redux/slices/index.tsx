import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CHAT_OPTIONS } from "screens/intro";
import { defaultChatHistory } from "utils/constants";
import {
  CHAT_TYPE_MESSAGES,
  IContent,
  IMessage,
  IState,
  USER_INPUTS,
} from "./types";

const initialState: IState = {
  option: null,
  messages: [],
};

export const getChatResponseOnMessage = (userInput: string): IMessage[] => {
  const createdAt = new Date();

  switch (userInput) {
    case USER_INPUTS.ASK_QUESTION: {
      const content = {
        text: "Output of existing most popular questions",
        subType: CHAT_TYPE_MESSAGES.TEXT,
        subTypeId: 1,
      };
      return [
        {
          createdAt,
          content,
          messageId: Math.random() * 5000,
          isReceived: true,
        },
      ];
    }
    case USER_INPUTS.FIND_JOB: {
      const content = {
        text: "There are our job propositions",
        subType: CHAT_TYPE_MESSAGES.TEXT,
        subTypeId: 1,
      };
      return [
        {
          createdAt,
          content,
          messageId: Math.random() * 5000,
          isReceived: true,
        },
      ];
    }
    default: {
      const content = {
        subType: CHAT_TYPE_MESSAGES.REFINE_SERCH,
        subTypeId: 1,
      };
      return [
        {
          createdAt,
          content,
          messageId: Math.random() * 5000,
          isReceived: true,
        },
      ];
    }
  }
};

const chatSlice = createSlice({
  name: "scenario",
  initialState: initialState,
  reducers: {
    setOption: (state, action: PayloadAction<CHAT_OPTIONS | null>) => {
      if (action.payload !== null && !state.messages.length) {
        const chat = defaultChatHistory[action.payload];
        const createdAt = new Date();
        const ownerId = `${Math.random() * 500}`;

        for (const msg of chat.initialMessages) {
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

        state.ownerId = ownerId;
        localStorage.setItem("ownerId", ownerId);
      }
      state.option = action.payload;
    },

    pushMessage: (state, action: PayloadAction<string>) => {
      const createdAt = new Date();
      const content: IContent = {
        subType: CHAT_TYPE_MESSAGES.TEXT,
        subTypeId: 1,
        text: action.payload,
      };
      state.messages.push({
        createdAt,
        content,
        messageId: state.messages.length + 1,
      });

      state.messages = [
        ...state.messages,
        ...getChatResponseOnMessage(action.payload),
      ];
    },

    updateMessage: (state, action: PayloadAction<CHAT_OPTIONS | null>) => {
      state.option = action.payload;
    },
  },
});

export const { setOption, pushMessage } = chatSlice.actions;
export default chatSlice.reducer;
