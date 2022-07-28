import { ACCESS_TOKEN } from 'firebase/config';
import Api from 'services';
import { generateLocalId } from 'utils/helpers';
import { handleRefreshToken } from './utils';

const apiInstanse = new Api();

enum ChannelName  {
    SMS = 'SMS'
}

export const sendMessage = (text: string) => { 
    apiInstanse.setAuthHeader(ACCESS_TOKEN);
    // TODO: fix when backend is ready
    const message = {
        channelName: ChannelName.SMS,
        candidateId: 49530690,
        contextId: null,
        msg: text,
        images: [],
        localId: generateLocalId()
    }
    handleRefreshToken(() => apiInstanse.sendMessage(message))
}