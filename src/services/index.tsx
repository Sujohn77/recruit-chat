import apisauce, { ApisauceInstance } from 'apisauce';

import {
  AppKeyType,
  IApiMessage,
  IApiSignedRequest,
  ICreationCandidatePayload,
  IGetAllRequisitions,
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
} from './types';

export const FORM_URLENCODED = {
  'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
};

const BASE_API_URL = 'https://qa-integrations.loopworks.com/';
class Api {
  private client: ApisauceInstance;

  constructor(baseURL = BASE_API_URL) {
    this.client = apisauce.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
      transformResponse: (response: any) => JSON.parse(response),
    });
  }

  setAuthHeader = (token: string) => this.client.setHeader('Authorization', `Bearer ${token}`);

  setAuthHeaderToNull = () => this.client.setHeader('Authorization', '');
  sendMessage = (payload: IApiMessage) => this.client.post<ISendMessageResponse>('/api/messenger/chat/send', payload);

  markChatRead = (chatId?: number) =>
    this.client.post<IUpdateMessagesResponse>('/api/messenger/chat/acknowledge', { chatId });

  getUserSelf = (data: AppKeyType) => this.client.get<IUserSelf>('api/user/self', data);
  loginUserCodeCheck = (data: { grantType: string }) =>
    this.client.post<any>('api/auth/token', data.grantType, {
      headers: FORM_URLENCODED,
    });

  loginUser = (data: any) => this.client.post<any>('api/auth/login', data);

  searchRequisitions = (data: IGetAllRequisitions & IApiSignedRequest) =>
    this.client.post<IRequisitionsResponse>('api/requisition/search', data);

  searchJobs = (data: ISearchJobsPayload) => this.client.post<IRequisitionsResponse>('api/requisition/search', data);
  uploadCV = (data: IUploadCVPayload) => this.client.post<IUploadResponse>('api/candidate/resume/upload', data);
  createCandidate = (data: ICreationCandidatePayload) =>
    this.client.post<ICreateCandidateResponse>('api/candidate/create', data);
  sendTranscript = (data: ISendTranscript & IApiSignedRequest) =>
    this.client.post<ISendTranscriptResponse>('api/messenger/chat/transcript/send', data);
  verify = (data: { chatBotId: number }) =>
    this.client.post<IVerifyChatBotResponse>('api/chatbot/verification?chatbotID=' + data.chatBotId);
}

export const apiInstance = new Api();

export default Api;