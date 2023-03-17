import { ApiResponse } from 'apisauce';
import { authInstance } from 'services';
import { handleSignInWithCustomToken } from '../../firebase/config';

import { GenerateGrantType } from '../types';

export const APP_VERSION = '1.0.3';

export enum IUserLoginDataKeys {
    GrantType = 'grant_type',
    Username = 'username',
    Password = 'password',
    TwoFactorAuthCode = 'twofactorauthcode',
    AppKey = 'appKey',
    CodeVersion = 'codeVersion',
}

export const getSignedRequest = <T>(data: T): T & any => ({
    ...data,
    // @ts-ignore
    appKey: process.env.REACT_APP_API_ACCESS_KEY || '117BD5BC-857D-428B-97BE-A5EC7256E281',
    codeVersion: APP_VERSION,
});

export const loginUser = async ({ data, isFirst = true }: any) => {
    const payload = getSignedRequest<any>(data);

    const response: ApiResponse<any> = await authInstance.loginUser(payload);

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
    let tokenResponse: ApiResponse<any> = await authInstance.loginUserCodeCheck({
        grantType,
    });

    try {
        await setUserDataAfterVerify({
            ...tokenResponse.data!,
        });
    } catch (err) {
        const newToken: ApiResponse<any> = await authInstance.loginUserCodeCheck({
            grantType,
        });
        await setUserDataAfterVerify({
            ...newToken.data!,
        });
        return newToken.data;
    }

    return tokenResponse.data;
};

export const setUserDataAfterVerify = async (data: any) => {
    const account = parseResponseWithToken(data);

    await handleSignInWithCustomToken(data.firebase_access_token);
};

export const generateGrantType: GenerateGrantType = (userData: any) => {
    const form = [];
    for (const property in userData) {
        const encodedKey = encodeURIComponent(property);
        const encodedValue = encodeURIComponent(userData[property]);
        form.push(encodedKey + '=' + encodedValue);
    }
    return form.join('&');
};

export const parseResponseWithToken: any = (data: any) => ({
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
