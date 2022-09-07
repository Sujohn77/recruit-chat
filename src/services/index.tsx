import apisauce, { ApiResponse, ApisauceInstance } from 'apisauce';
import { handleSignInWithCustomToken } from '../firebase/config';

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
  GenerateGrantType,
  ISendTranscriptResponse,
  ISendTranscript,
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
}

export const APP_VERSION = '1.0.3';
export const getSignedRequest = <T,>(data: T): T & any => ({
  ...data,
  // @ts-ignore
  appKey: process.env.REACT_APP_API_ACCESS_KEY || '117BD5BC-857D-428B-97BE-A5EC7256E281',
  codeVersion: APP_VERSION,
});

export const loginUser = async ({ data, isFirst = true }: any) => {
  const payload = getSignedRequest<any>(data);

  const response: ApiResponse<any> = await apiInstance.loginUser(payload);

  if (!response.data?.errors?.length && response.data?.authcode) {
    // Without 2FA flow
    const info: any = {
      grant_type: 'password',
      username: payload!.username,
      password: payload!.password,
      twofactorauthcode: response.data?.authcode!.toString(),
      appKey: payload!.appKey,
      codeVersion: payload!.codeVersion,
    };
    const loginResponse = await confirmLoginUserWithoutTwoFA(info);
    return loginResponse;
  }
};

export const confirmLoginUserWithoutTwoFA = async (info: any) => {
  const grantType: string = await generateGrantType({ ...info });
  let tokenResponse: ApiResponse<any> = await apiInstance.loginUserCodeCheck({
    grantType,
  });

  try {
    await setUserDataAfterVerify({
      ...tokenResponse.data!,
    });
  } catch (err) {
    const newToken: ApiResponse<any> = await apiInstance.loginUserCodeCheck({
      grantType,
    });
    await setUserDataAfterVerify({
      ...newToken.data!,
    });
    return newToken.data;
  }

  return tokenResponse.data;
};

export const apiInstance = new Api();

export default Api;

export const setUserDataAfterVerify = async (data: any) => {
  const account = parseResponseWithToken(data);

  await handleSignInWithCustomToken(data.firebase_access_token);

  apiInstance.setAuthHeader(account.accessToken);
};

export const parseResponseWithToken: any = (data: any) => ({
  accessToken: data.access_token,
  tokenType: data.token_type,
  expiresIn: data.expires_in,
  refreshToken: data.refresh_token,
  sasSubscriberAttachment: data.sas_subscriber_attachment,
  sasSubscriberResume: data.sas_subscriber_resume,
  sasSubscriberAvatar: data.sas_subscriber_avatar,
  issuedTokenDate: data['.issued'],
  expiresTokenDate: data['.expires'],
  firebase_access_token: data.firebase_access_token,
});

export enum IUserLoginDataKeys {
  GrantType = 'grant_type',
  Username = 'username',
  Password = 'password',
  TwoFactorAuthCode = 'twofactorauthcode',
  AppKey = 'appKey',
  CodeVersion = 'codeVersion',
}

export const generateGrantType: GenerateGrantType = (userData: any) => {
  const form = [];
  for (const property in userData) {
    const encodedKey = encodeURIComponent(property);
    const encodedValue = encodeURIComponent(userData[property]);
    form.push(encodedKey + '=' + encodedValue);
  }
  return form.join('&');
};
