import apisauce, { ApisauceInstance } from "apisauce";
import {
  ICreateAnonymCandidateRequest,
  ICreateCandidateResponse,
  ICreateChatResponse,
  ISendTranscript,
  ISendTranscriptResponse,
} from "services/types";
import { BASE_API_URL } from "utils/constants";

class userInstance {
  protected client: ApisauceInstance;
  protected jwtToken: string;
  protected lastRequest: any;

  constructor(baseURL = BASE_API_URL) {
    this.client = apisauce.create({
      baseURL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
      transformResponse: (response: any) =>
        response ? JSON.parse(response) : response,
    });
  }

  setAuthHeader = (token: string) =>
    this.client.setHeader("Authorization", `chatbot-jwt-token ${token}`);
  setAuthHeaderToNull = () => this.client.setHeader("Authorization", "");
  setAuthBearerHeader = (token: string) =>
    this.client.setHeader("Authorization", `Bearer ${token}`);

  createAnonymCandidate = (data: ICreateAnonymCandidateRequest) =>
    this.client.post<ICreateCandidateResponse>("api/candidate/create", data);

  createChatByAnonymUser = (candidateId: number) =>
    this.client.post<ICreateChatResponse>("api/messenger/chat/create", {
      candidateId,
    });

  getFirebaseAccessToken = (candidateId: number) =>
    this.client.post<string>(
      `api/chatbot/custom-access-token?candidateId=${candidateId}`
    );

  sendTranscript = (data: ISendTranscript) =>
    this.client.post<ISendTranscriptResponse>(
      "api/messenger/chat/transcript/send",
      data
    );
}

export const userAPI = new userInstance();
