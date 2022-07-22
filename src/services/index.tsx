import apisauce, { ApisauceInstance } from "apisauce";
import { IApiMessage, ISendMessageResponse } from "saga/types";
import { IUpdateMessagesResponse } from "./types";
const BASE_API_URL = "https://qa-integrations.loopworks.com/";
class Api {
  private client: ApisauceInstance;

  constructor(baseURL = BASE_API_URL) {
    this.client = apisauce.create({
      baseURL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
      transformResponse: (response: any) => JSON.parse(response),
    });
  }

  setAuthHeader = (token: string) =>
    this.client.setHeader("Authorization", `Bearer ${token}`);

  setAuthHeaderToNull = () => this.client.setHeader("Authorization", "");
  sendMessage = (payload: IApiMessage) =>
    this.client.post<ISendMessageResponse>("/api/messenger/chat/send", payload);

  markChatRead = (chatId?: number) =>
    this.client.post<IUpdateMessagesResponse>(
      "/api/messenger/chat/acknowledge",
      { chatId }
    );
}

export const apiInstance = new Api();

export default Api;
