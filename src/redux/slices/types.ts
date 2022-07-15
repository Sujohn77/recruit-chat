import { CHAT_OPTIONS } from "screens/intro";

export enum CHAT_TYPE_MESSAGES {
    STRING = 'STRING',
    NO_MATCH_JOB = 'NO_MATCH_JOB',
    JOB_POSITIONS = 'JOB_POSITIONS',
    REFINE_SERCH = 'REFINE_SERCH',
    RECOMMENDATIONS = 'RECOMMENDATIONS'
}
export interface IState {
  option: CHAT_OPTIONS | null;
  messages: IChatResponse[]
}
type IMessage = IMessageString | IMessageNoMatchJob | IMessageJobPositions

interface IMessageString {
    type: CHAT_TYPE_MESSAGES.STRING,
    value: string
}
interface IMessageNoMatchJob {
    type: CHAT_TYPE_MESSAGES.NO_MATCH_JOB,
}
interface IMessageJobPositions {
    type: CHAT_TYPE_MESSAGES.STRING,
    positions: string[]
}

export interface IChatResponse {
  ownMessages: IMessage[]
  chatMessages?: IMessage[]
}