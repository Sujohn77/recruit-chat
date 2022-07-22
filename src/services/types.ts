import { IMessage } from "saga/types";

export interface IUpdateMessagesResponse {
    errorOccurrenceId: null;
    errors: [];
    message: null;
    redirectUri: null;
    status: null;
    statusCode: null;
    success: boolean;
    unreadMsgCount: number;
  }

  export interface ISendMessageResponse {
    chatId: number;
    chatItems: IMessage[];
    errorOccurrenceId: null;
    errors: [];
    limits: { limits: [] };
    message: null;
    redirectUri: null;
    status: null;
    statusCode: null;
    success: boolean;
  }
  
  export interface IUpdateMessagesResponse {
    errorOccurrenceId: null;
    errors: [];
    message: null;
    redirectUri: null;
    status: null;
    statusCode: null;
    success: boolean;
    unreadMsgCount: number;
  }