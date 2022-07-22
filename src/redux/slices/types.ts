import { IMessage } from "saga/types";
import { CHAT_OPTIONS } from "screens/intro";

export enum CHAT_TYPE_MESSAGES {
    TEXT = 'text',
    NO_MATCH_JOB = 'no_match_job',
    JOB_POSITIONS = 'job_positions',
    REFINE_SERCH = 'refine_search',
    RECOMMENDATIONS = 'recommendations',
    BROWSE = 'BROWSE'
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
  createdAt: string,
  content: IContent
  messageId: number | string;
  isReceived?: boolean
}

export interface IContent {
    subType: CHAT_TYPE_MESSAGES;
    subTypeId: number | null;
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
  UNKNOWN = "",
}

export enum Status  {
  PENDING = 'PENDING',
  DONE = 'DONE'
}