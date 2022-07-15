import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CHAT_OPTIONS } from "screens/intro";
import { CHAT_TYPE_MESSAGES, IChatResponse, IState } from "./types";

const initialState: IState = {
  option: null,
  messages: [],
};

const chatSlice = createSlice({
  name: "scenario",
  initialState: initialState,
  reducers: {
    setOption: (state, action: PayloadAction<CHAT_OPTIONS | null>) => {
      // if (action.payload === CHAT_OPTIONS.ASK_QUESTION) {

      // TODO: push messages for this scenario

      // }
      state.option = action.payload;
    },
    pushMessage: (state, action: PayloadAction<string>) => {
      const ownMessages =
        state.messages.length > 0
          ? state.messages[state.messages.length - 1].ownMessages
          : [];
      const message: IChatResponse = {
        ownMessages: [
          ...ownMessages,
          {
            type: CHAT_TYPE_MESSAGES.STRING,
            value: action.payload,
          },
        ],
      };
      state.messages.push(message);
    },
    updateMessage: (state, action: PayloadAction<CHAT_OPTIONS | null>) => {
      state.option = action.payload;
    },
  },
});

export const { setOption } = chatSlice.actions;
export default chatSlice.reducer;
