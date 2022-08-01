import { ACCESS_TOKEN } from 'firebase/config';
import Api from 'services';

import { IApiMessage } from './types';
import { handleRefreshToken } from './utils';

const apiInstanse = new Api();



export const sendMessage = (message: IApiMessage) => { 
    apiInstanse.setAuthHeader(ACCESS_TOKEN);
    handleRefreshToken(() => apiInstanse.sendMessage(message))
}