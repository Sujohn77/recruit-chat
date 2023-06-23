import apisauce, { ApiResponse, ApisauceInstance } from "apisauce";
import axios, { AxiosRequestConfig } from "axios";
import {
  IApplyJobResponse,
  IFollowingRequest,
  IFollowingResponse,
  ISuccessResponse,
} from "services/types";

import { SessionStorage, isDevMode } from "../../utils/constants";
import { getStorageValue } from "../../utils/helpers";
import {
  AppKeyType,
  IApiMessage,
  ICreationCandidatePayload,
  IRequisitionsResponse,
  ISearchJobsPayload,
  ISendMessageResponse,
  IUpdateMessagesResponse,
  IUploadCVPayload,
  IUserSelf,
  IUploadResponse,
  ICreateCandidateResponse,
  ISendTranscriptResponse,
  ISendTranscript,
  IVerifyChatBotResponse,
  IVerifyEmailRequest,
  IJobAlertRequest,
  IJobAlertResponse,
  IVerifyEmailResponse,
  IResumeDataPayload,
  IAskAQuestionRequest,
  IAskAQuestionResponse,
} from "../types";

export const FORM_URLENCODED = {
  "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
};
const BASE_API_URL = "https://qa-integrations.loopworks.com/";

// const GUID = "FE10595F-12C4-4C59-8FAA-055BB0FCB1A6"; // James's guid
const GUID = "f466faec-ea83-4122-8c23-458ab21e96be"; // Test guid
export const CANDIDATE_ID = 49530690; // hardcoded for now
// export const CANDIDATE_ID = 55457050; // hardcoded for now
export const CHAT_ID = 2433044; // the current chatID - this is hardcoded for now
export const LOCALE = "en_US"; // the chatbot UI language, use en_US for now

class Api {
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

    this.client.axiosInstance.interceptors.request.use(this.requestInterceptor);
    this.client.axiosInstance.interceptors.response.use(
      function (response) {
        return response;
      },
      async function (error) {
        if (isDevMode) {
          console.log("ApiError", error?.message);
          console.log("error?.response?.status", error?.response?.status);
        }

        const status = error?.response?.status;

        if (status !== 401 && status !== 403) {
          // TODO: add logic to display errors
        }

        const originalRequest = error.config;
        if (status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          // sessionStorage.removeItem(SessionStorage.Token);
          // const message = {
          //   event_id: "refresh_token",
          //   callback: (token: string) => {
          //     console.log("====================================");
          //     console.log("NEW token", token);
          //     console.log("====================================");
          //     return this.client.setHeader(
          //       "Authorization",
          //       "chatbot-jwt-token " + token
          //     );
          //   },
          // };
          // console.log("====================================");
          // console.log("error?.response", error?.response);
          // console.log("originalRequest", originalRequest);
          // console.log("message", message);
          // console.log("====================================");
          // window.parent.postMessage(message, "*");
          const res: ApiResponse<string> = await apiInstance.refreshToken();
          if (res.data) {
            apiInstance.setAuthHeader(res.data);
            return axios(originalRequest);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  requestInterceptor = (request: AxiosRequestConfig) => {
    const token = getStorageValue(SessionStorage.Token);
    // const basicAuthToken = Buffer.from(`${info.username}:${info.password}`).toString('base64');
    // const isExpired = token ? isTokenExpired(token) : true;
    // console.log("====================================");
    // console.log("T O K E N", token);
    // console.log("====================================");

    if (token) {
      if (isDevMode) {
        console.log("requestInterceptor - request.headers", request.headers);
      }

      if (request && request.headers) {
        request.headers["Authorization"] = "chatbot-jwt-token " + token;
      }

      this.lastRequest = request;
    } else {
      isDevMode && console.log("no token");
    }
    return request;
    // if (isExpired) {
    //     window.parent.postMessage(
    //         {
    //             event_id: 'refresh_token',
    //             // callback: this.requestInterceptor.bind(request),
    //         },
    //         '*'
    //     );
    // } else {
    //     if (request && request.headers) request.headers.post['chatbot-jwt-token'] = token;
    //     this.lastRequest = request;
    //     return request;
    // }
  };

  setHeader = (key: string, value: string) => this.client.setHeader(key, value);
  removeHeader = (key: string) => this.client.deleteHeader(key);
  setAuthHeader = (token: string) => {
    return this.client.setHeader("Authorization", "chatbot-jwt-token " + token);
  };

  refreshToken = (guid = GUID) => {
    return this.client.post<string>("api/chatbot/token", {
      ChatbotGuid: guid,
    });
  };

  askAQuestion = (data: IAskAQuestionRequest) =>
    this.client.post<IAskAQuestionResponse>(
      "api/questionAnswering/answers",
      data
    );

  sendMessage = (payload: IApiMessage) =>
    this.client.post<ISendMessageResponse>("/api/messenger/chat/send", payload);
  markChatRead = (chatId?: number) =>
    this.client.post<IUpdateMessagesResponse>(
      "/api/messenger/chat/acknowledge",
      { chatId }
    );
  getUserSelf = (data: AppKeyType) =>
    this.client.get<IUserSelf>("api/user/self", data);
  uploadCV = (data: IUploadCVPayload) =>
    this.client.post<IUploadResponse>("api/candidate/resume/upload", data);
  searchRequisitions = (data: ISearchJobsPayload) =>
    this.client.post<IRequisitionsResponse>("api/requisition/search", data);
  searchWithResume = (data: IResumeDataPayload) =>
    this.client.post<IRequisitionsResponse>(
      "api/requisition/searchbyresume/",
      data
    );
  createCandidate = (data: ICreationCandidatePayload) =>
    this.client.post<ICreateCandidateResponse>("api/candidate/create", data);
  sendTranscript = (data: ISendTranscript) =>
    this.client.post<ISendTranscriptResponse>(
      "api/messenger/chat/transcript/send",
      data
    );
  createJobAlert = (data: IJobAlertRequest) => {
    return this.client.post<IJobAlertResponse>(
      "api/chatbot/create-job-alert",
      data
    );
  };
  addCandidateByJobId = (jobId: number) =>
    this.client.post<ISuccessResponse>("api/pool/addcandidatebyjobid", {
      candidateId: CANDIDATE_ID,
      jobId,
    });

  // ---------------------------- Apply Job ---------------------------- //
  applyJob = (jobId: number) =>
    this.client.post<IApplyJobResponse>("/api/chatbot/startprescreen", {
      jobId,
      candidateId: CANDIDATE_ID,
      chatID: CHAT_ID,
      locale: LOCALE,
    });
  sendFollowing = (data: IFollowingRequest) =>
    this.client.post<IFollowingResponse>(
      "/api/chatbot/sendprescreenmessage",
      data
    );
  // -------------------------------------------------------------------- //

  clearAxiosConfig = () => {
    sessionStorage.removeItem(SessionStorage.Token);
    delete this.client.headers.Authorization;
  };
}

class AuthAPI extends Api {
  setAuthHeader = (token: string) => {
    return this.client.setHeader("Authorization", `Bearer ${token}`);
  };

  verifyByEmail = (data: IVerifyEmailRequest) => {
    return this.client.post<Partial<IVerifyEmailResponse>>(
      "api/candidate/verifybyemail",
      data
    );
  };

  verify = (chatBotData: string) => {
    return this.client.get<IVerifyChatBotResponse>(
      "api/chatbot/verification?chatBotData=" + chatBotData
    );
  };

  loginUserCodeCheck = (data: { grantType: string }) => {
    return this.client.post<any>("api/auth/token", data.grantType, {
      headers: FORM_URLENCODED,
    });
  };

  loginUser = (data: any) => {
    return this.client.post<any>("api/auth/login", data);
  };
}

export const apiInstance = new Api();
export const authInstance = new AuthAPI();

export default Api;