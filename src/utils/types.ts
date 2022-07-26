import { DocumentChangeType } from '@firebase/firestore-types';
import { CHAT_OPTIONS } from 'screens/intro';
import { IMessage } from 'services/types';
export interface ISnapshot<T = Object> {
    type: DocumentChangeType;
    data: T;
}

export enum CHAT_TYPE_MESSAGES {
    TEXT = 'text',
    NO_MATCH_JOB = 'no_match_job',
    JOB_POSITIONS = 'job_positions',
    REFINE_SERCH = 'refine_search',
    RECOMMENDATIONS = 'recommendations',
    UPLOAD_CV = 'upload_cv',
    BUTTON = 'button',
    FILE = 'file'
}
export interface IState {
  option: CHAT_OPTIONS | null;
  messages: ILocalMessage[];
  serverMessages: IMessage[];
  ownerId?: string;
  chatId?: string;
  status: Status
}
// type IMessage = IMessageString | IMessageNoMatchJob | IMessageJobPositions

export interface ILocalMessage {
  _id: string | number;
  createdAt: string,
  content: IContent
  isReceived?: boolean
}

export interface IContent {
    subType: CHAT_TYPE_MESSAGES;
    // subTypeId: number | null;
    text?: string;
}
// interface IMessageNoMatchJob {
//     type: CHAT_TYPE_MESSAGES.NO_MATCH_JOB,
// }
// interface IMessageJobPositions {
//     type: CHAT_TYPE_MESSAGES.STRING,
//     positions: string[]
// }


export enum USER_INPUTS {
  FIND_JOB = "find a job",
  ASK_QUESTION = "ask a question",
  UPLOAD_CV = 'upload cv',
  ANSWER_QUESTIONS = 'answer questions',
  UNKNOWN = "",
}

export enum USER_CHAT_ACTIONS {
  SUCCESS_UPLOAD_CV = 'SUCCESS_UPLOAD_CV',
  JOB_POSITION = 'JOB_POSITION',
}

export enum Status  {
  PENDING = 'PENDING',
  DONE = 'DONE'
}