import apisauce, { ApisauceInstance } from 'apisauce';
import { LocalStorage } from '../utils/constants';
import { getStorageValue, isTokenExpired } from '../utils/helpers';

import {
    AppKeyType,
    IApiMessage,
    IApiSignedRequest,
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
} from './types';

export const FORM_URLENCODED = {
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
};

const BASE_API_URL = 'https://qa-integrations.loopworks.com/';
class Api {
    protected client: ApisauceInstance;
    protected jwtToken: string;
    protected lastRequest: any;

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

        this.client.axiosInstance.interceptors.request.use(this.requestInterceptor);
        this.client.axiosInstance.interceptors.response.use(
            function (response) {
                return response;
            },
            function (error) {
                console.log(error);
                window.parent.postMessage(
                    {
                        event_id: 'refresh_token',
                        callback: this.lastRequest,
                    },
                    '*'
                );
                return Promise.reject(error);
            }
        );
    }

    requestInterceptor = (request: any) => {
        const token = getStorageValue(LocalStorage.Token);
        console.log(JSON.parse(atob(token.split('.')[1])).exp);
        const isExpired = token ? isTokenExpired(token) : true;

        if (isExpired) {
            window.parent.postMessage(
                {
                    event_id: 'refresh_token',
                    callback: () => this.requestInterceptor(request),
                },
                '*'
            );
        } else {
            if (request && request.headers) request.headers.Authorization = `Bearer ${token}`;
            this.lastRequest = request;
            return request;
        }
    };

    setAuthHeader = (token: string) => {
        return this.client.setHeader('Authorization', `Bearer ${token}`);
    };

    sendMessage = (payload: IApiMessage) => this.client.post<ISendMessageResponse>('/api/messenger/chat/send', payload);
    markChatRead = (chatId?: number) =>
        this.client.post<IUpdateMessagesResponse>('/api/messenger/chat/acknowledge', { chatId });
    getUserSelf = (data: AppKeyType) => this.client.get<IUserSelf>('api/user/self', data);
    uploadCV = (data: IUploadCVPayload) => this.client.post<IUploadResponse>('api/candidate/resume/upload', data);
    searchRequisitions = (data: ISearchJobsPayload) =>
        this.client.post<IRequisitionsResponse>('api/chatbot/searchRequisition', { ...data });
    searchWithResume = () => this.client.get<IRequisitionsResponse>('api/requisition/searchbyresume/');
    createCandidate = (data: ICreationCandidatePayload) =>
        this.client.post<ICreateCandidateResponse>('api/candidate/create', data);
    sendTranscript = (data: ISendTranscript & IApiSignedRequest) =>
        this.client.post<ISendTranscriptResponse>('api/messenger/chat/transcript/send', data);
    createJobAlert = (data: IJobAlertRequest) => {
        return this.client.post<IJobAlertResponse>('api/chatbot/createJobAlert', data);
    };
    clearAxiosConfig = () => {
        localStorage.removeItem(LocalStorage.Token);
        delete this.client.headers.Authorization;
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
