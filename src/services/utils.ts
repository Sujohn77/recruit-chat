import { getProcessedSnapshots } from '../firebase/config';
import { sortBy } from 'lodash';
import { IMessage, I_id } from './types';

export const handleRefreshToken = async (action: () => any, isFirst = true) => {
  const response = await action();
  // if request was canceled
  if (response?.status === null && isFirst) {
    handleRefreshToken(action, false);
  } else {
    // updateState && updateState(response.data.chatItems.map((msg:any)=>msg.chatItemId))
  }
};

export const getParsedSnapshots = ({ serverMessages, nextMessages }: any) => {
  const processedSnapshots: IMessage[] = sortBy(
    getProcessedSnapshots<I_id, IMessage>(serverMessages || [], nextMessages, 'chatItemId', []),
    (message: any) => -message.dateCreated.seconds
  );
  return processedSnapshots;
};
