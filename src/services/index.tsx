import apisauce, { ApiResponse, ApisauceInstance } from "apisauce";
import { handleSignInWithCustomToken } from "firebase/config";

import {
  AppKeyType,
  IApiMessage,
  IApiSignedRequest,
  IGetAllRequisitions,
  IRequisitionsResponse,
  ISendMessageResponse,
  IUpdateMessagesResponse,
  IUserSelf,
} from "./types";

export const FORM_URLENCODED = {
  "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
};

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

  getUserSelf = (data: AppKeyType) =>
    this.client.get<IUserSelf>("api/user/self", data);
  loginUserCodeCheck = (data: { grantType: string }) =>
    this.client.post<any>("api/auth/token", data.grantType, {
      headers: FORM_URLENCODED,
    });

  loginUser = (data: any) => this.client.post<any>("api/auth/login", data);

  searchRequisitions = (data: IGetAllRequisitions & IApiSignedRequest) =>
    this.client.post<IRequisitionsResponse>("api/requisition/search", data);
}

export const APP_VERSION = "1.0.3";
export const getSignedRequest = <T,>(data: T): T & any => ({
  ...data,
  // @ts-ignore
  appKey: process.env.REACT_APP_API_ACCESS_KEY || CONFIG.API_ACCESS_KEY,
  codeVersion: APP_VERSION,
});

export const loginUser = async ({ data, isFirst = true }: any) => {
  const payload = getSignedRequest<any>(data);

  const response: ApiResponse<any> = await apiInstance.loginUser(payload);

  if (response.data?.requires2fa && response.data.success) {
    // 2FA flow
    // const phoneNumber = response.data.msisdnAnonymised;
    // const navigationPayload = {
    //   userData: { phoneNumber, ...payload },
    // };
    // yield call(goTo, LoginPage, { navigationPayload });
  } else if (!response.data?.errors?.length && response.data?.authcode) {
    // Without 2FA flow
    const info: any = {
      grant_type: "password",
      username: payload!.username,
      password: payload!.password,
      twofactorauthcode: response.data?.authcode!.toString(),
      appKey: payload!.appKey,
      codeVersion: payload!.codeVersion,
    };
    await confirmLoginUserWithoutTwoFA(info);
  }
};

export const loginUserVerify = async ({ info }: any) => {
  const grantType: string = generateGrantType(info);

  const response: ApiResponse<any> = await apiInstance.loginUserCodeCheck({
    grantType,
  });

  if (response.data?.error_description || response.data?.error) {
  } else {
    setUserDataAfterVerify(response.data);
  }
};

export const confirmLoginUserWithoutTwoFA = async (info: any) => {
  const grantType: string = await generateGrantType({ ...info });

  const tokenResponse: ApiResponse<any> = await apiInstance.loginUserCodeCheck({
    grantType,
  });
  if (tokenResponse.data?.error_description || tokenResponse.data?.error) {
  } else {
    await setUserDataAfterVerify({
      ...tokenResponse.data!,
    });
  }
};

export const apiInstance = new Api();

export default Api;

export const generateGrantType: any = (userData: any) => {
  const form = [];
  for (const property in userData) {
    const encodedKey = encodeURIComponent(property);
    const encodedValue = encodeURIComponent(userData[property]);
    form.push(encodedKey + "=" + encodedValue);
  }
  return form.join("&");
};

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
  issuedTokenDate: data[".issued"],
  expiresTokenDate: data[".expires"],
  firebase_access_token: data.firebase_access_token,
});
