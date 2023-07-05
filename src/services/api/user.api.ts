import apisauce, { ApisauceInstance } from "apisauce";
import {
  ICreateAnonymCandidateRequest,
  ICreateCandidateResponse,
  ICreateChatResponse,
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

  createAnonymCandidate = (data: ICreateAnonymCandidateRequest) =>
    this.client.post<ICreateCandidateResponse>("api/candidate/create", data);

  createChatByAnonymUser = (candidateId: number) =>
    this.client.post<ICreateChatResponse>("api/messenger/chat/create", {
      candidateId,
    });
}

export const userAPI = new userInstance();