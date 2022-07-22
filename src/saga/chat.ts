import { call, put } from "redux-saga/effects";
import { ACCESS_TOKEN } from "firebase/config";
import { apiInstance } from "services";
import { ApiResponse } from "apisauce";
import { IUpdateMessagesResponse } from "services/types";
import { getLocalMessage } from "utils/helpers";
import { IMessage, ISendMessageResponse, SendMessageAction } from "./types";

import { addMessage } from "redux/slices";

export function* updateMessages({ chatId }: {chatId: string}) { 
    const accessToken: string = ACCESS_TOKEN;
    apiInstance.setAuthHeader(accessToken);
    const response: ApiResponse<IUpdateMessagesResponse> = yield call(
        // @ts-ignore
      apiInstance.markChatRead,
      chatId
    );
    apiInstance.setAuthHeaderToNull();
  
    return response;
  }
  
  export function* sendMessage({
    message,
    sender,
    chatId,
    isRepeat,
  }: SendMessageAction) {
    const localMessage: IMessage = yield call(getLocalMessage, message, sender);
    if (!isRepeat) {
      yield put(addMessage(localMessage.content.text));
    }
  
    const accessToken: string = ACCESS_TOKEN;
    apiInstance.setAuthHeader(accessToken);
    const response: ApiResponse<ISendMessageResponse> = yield call(
      apiInstance.sendMessage,
      message
    );
    apiInstance.setAuthHeaderToNull();
  
    return response;
}