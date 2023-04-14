import { CHAT_ACTIONS } from 'utils/types';

export interface IOption {
  icon: string;
  message: string;
  type: CHAT_ACTIONS;
  size: string;
}
