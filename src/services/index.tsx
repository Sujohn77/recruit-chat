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
    IVerifyEmailRequest,
    IJobAlertRequest,
    IJobAlertResponse,
    IVerifyEmailResponse,
} from './types';

export const FORM_URLENCODED = {
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
};

const BASE_API_URL = 'https://qa-integrations.loopworks.com/';
class Api {
    protected client: ApisauceInstance;

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
    setAuthHeader = (token: string) => {
        return this.client.setHeader('Authorization', `Bearer ${token}`);
    };

    sendMessage = (payload: IApiMessage) => this.client.post<ISendMessageResponse>('/api/messenger/chat/send', payload);
    markChatRead = (chatId?: number) =>
        this.client.post<IUpdateMessagesResponse>('/api/messenger/chat/acknowledge', { chatId });
    getUserSelf = (data: AppKeyType) => this.client.get<IUserSelf>('api/user/self', data);
    searchRequisitions = (data: ISearchJobsPayload) =>
        this.client.post<IRequisitionsResponse>('api/chatbot/searchRequisition', data);
    uploadCV = (data: IUploadCVPayload) => this.client.post<IUploadResponse>('api/candidate/resume/upload', data);
    createCandidate = (data: ICreationCandidatePayload) =>
        this.client.post<ICreateCandidateResponse>('api/candidate/create', data);
    sendTranscript = (data: ISendTranscript & IApiSignedRequest) =>
        this.client.post<ISendTranscriptResponse>('api/messenger/chat/transcript/send', data);
    createJobAlert = (data: IJobAlertRequest) => {
        return this.client.post<IJobAlertResponse>('api/chatbot/createJobAlert', data);
    };
}

class AuthAPI extends Api {
    setAuthHeader = (token: string) => {
        return this.client.setHeader('Authorization', `Bearer ${token}`);
    };

    verifyByEmail = (data: IVerifyEmailRequest) => {
        return this.client.post<Partial<IVerifyEmailResponse>>('api/candidate/verifybyemail', data);
    };

    verify = (chatBotData: string) => {
        return this.client.get<IVerifyChatBotResponse>('api/chatbot/verification?chatBotData=' + chatBotData);
    };

    loginUserCodeCheck = (data: { grantType: string }) => {
        return this.client.post<any>('api/auth/token', data.grantType, {
            headers: FORM_URLENCODED,
        });
    };

    loginUser = (data: any) => {
        return this.client.post<any>('api/auth/login', data);
    };
}

export const apiInstance = new Api();
export const authInstance = new AuthAPI();

export default Api;
