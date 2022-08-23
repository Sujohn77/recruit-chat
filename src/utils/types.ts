import { DocumentChangeType } from '@firebase/firestore-types';
import { ITriggerActionProps } from 'contexts/types';
import { CHAT_OPTIONS } from 'screens/intro';
import { IChatRoomID, IMessage, IMuteStatus, IUserSelf, LocationType } from 'services/types';

export interface IWithID {
  id: string | number;
}

export interface ILocation {
  location: LocationType;
}

export interface ISnapshot<T = Object> {
  type: DocumentChangeType;
  data: T;
}

export enum MessageType {
  TEXT = 'text',
  NO_MATCH_JOB = 'no_match_job',
  JOB_POSITIONS = 'job_positions',
  NO_MATCH = 'no_match',
  REFINE_SERCH = 'refine_search',
  RECOMMENDATIONS = 'recommendations',
  UPLOAD_CV = 'upload_cv',
  BUTTON = 'button',
  FILE = 'resume_uploaded',
  INITIAL_MESSAGE = 'initial_message',
  TRANSCRIPT = 'transcript_sent',
  VIDEO = 'video_uploaded',
  CHAT_CREATED = 'chat_created',
  DOCUMENT = 'document_uploaded',
  UNREAD_MESSAGES = 'unread_messages',
  DATE = 'date',
  EMAIL_FORM = 'email_form',
  TEXT_WITH_CHOICE = 'text_with_choice',
  INTERESTED_IN = 'interested_in',
  HIRING_PROCESS = 'hiring_process',
  SALARY_FORM = 'salary_form',
  QUESTION_FORM = 'question_form',
  THANKS = 'thankss',
}
export interface IState {
  option: CHAT_OPTIONS | null;
  messages: IMessage[];
  serverMessages: IMessage[];
  ownerId?: string;
  chatId?: string;
  status: Status;
}
// type IMessage = IMessageString | IMessageNoMatchJob | IMessageJobPositions

export interface ILocalMessage {
  _id: number | string | null;
  localId?: string | number;
  dateCreated?: { seconds: number };
  content: {
    subType: MessageType;
    text?: string;
  };
  isOwn?: boolean;
}

export interface IContent {
  subType: MessageType;
  text?: string;
}
// interface IMessageNoMatchJob {
//     type: MessageType.NO_MATCH_JOB,
// }
// interface IMessageJobPositions {
//     type: MessageType.STRING,
//     positions: string[]
// }

export enum USER_INPUTS {
  FIND_JOB = 'Find a job',
  ASK_QUESTION = 'Ask a question',
  UPLOAD_CV = 'Upload CV',
  ANSWER_QUESTIONS = 'Answer questions',
  HOW_MUCH_EXPERIENCE = 'How much work experience do I need for your company?',
  HOW_SUBMIT_CV = 'Can I submit my CV',
  HIRING_PROCESS = 'What is the hiring process?',
}

export enum CHAT_ACTIONS {
  SUCCESS_UPLOAD_CV = 'success_upload_cv',
  SET_CATEGORY = 'set_category',
  SET_LOCATIONS = 'set_location',
  SEND_LOCATIONS = 'send_locations',
  REFINE_SEARCH = 'refine_search',
  NO_MATCH = 'no_match',
  SEND_MESSAGE = 'send_message',
  FIND_JOB = 'find_job',
  ASK_QUESTION = 'ask_question',
  CHANGE_LANG = 'change_lang',
  SAVE_TRANSCRIPT = 'save_transcript',
  SEND_EMAIL = 'send_email',
  FETCH_JOBS = 'fetch_jobs',
  SET_JOB_ALERT = 'set_job_alert',
  SET_ALERT_CATEGORY = 'set_alert_category',
  SET_ALERT_PERIOD = 'set_alert_period',
  SET_ALERT_EMAIL = 'set_alert_email',
  INTERESTED_IN = 'insterested_in',
  APPLY_POSITION = 'apply_position',
  LEAVE_FEEDBACK = 'leave_feedback',
  GET_USER_NAME = 'get_user_name',
  GET_USER_EMAIL = 'get_user_email',
  GET_USER_AGE = 'get_user_age',
  SET_WORK_PERMIT = 'SET_WORK_PERMIT',
  APPLY_NAME = 'apply_name',
  APPLY_EMAIL = 'apply_email',
  APPLY_AGE = 'apply_age',
  APPLY_PERMIT = 'apply_permit',
  APPLY_ETHNIC = 'apply_ethnic',
  SET_SALARY = 'set_salary',
  NO_PERMIT_WORK = 'no_permit_work',
  HELP = 'help',
  QUESTION_RESPONSE = 'question_response',
  ANSWER_QUESTIONS = 'answer_questions',
  HIRING_PROCESS = 'hiring_process',
  UPLOAD_CV = 'upload_cv',
}

export enum Status {
  PENDING = 'PENDING',
  DONE = 'DONE',
}

export interface IChatRoom extends IChatRoomID {
  canChat: {
    canChat: boolean;
    errorCode: null;
    isImageEnabled: boolean;
    unavailableMessage: null;
  };
  countOfUnread: number;
  dateCreated: { seconds: string };
  dateModified: { seconds: string } | string | false;
  imageUrl: null;
  imageUrlSasToken: string;
  isOptedOut: boolean;
  isViewed: boolean;
  lastMessage: IMessage;
  participantIds: string[];
  participants: (IUserSelf & { countOfUnread: number; uniqueId?: string })[];
  subscriber: IUserSelf;
  subscriberId: number;
  messages: IMessage[];
  pinned: string[];
  archived: string[];
  muted: IMuteStatus[];
  ownerId: number;
}

export interface IQueue {
  name: string;
  queueId: number | string;
  rooms: IChatRoom[];
}

export interface IQueuesRooms {
  [key: string]: IQueueChatRoom[];
}

export interface QueuesState {
  queues: IQueueItem[];
  queueIds: string[];
  rooms: IQueuesRooms;
  archivedRooms: IQueueChatRoom[];
  totalUnread: number;
  chatStatusFilter: number[];
  changeStatusError: boolean | null;
}

export interface UpdateQueueChatRoomMessagesAction {
  type: QueuesActionTypes['UPDATE_CHAT_ROOM_MESSAGES'];
  messagesSnapshots: ISnapshot<IMessage>[];
  chatId: string;
  queueId: string;
}

export interface IQueueChatRoom extends IChatRoom {
  statusId?: number;
}

interface QueuesActionTypes {
  SET_CURRENT_QUEUES: 'SET_CURRENT_QUEUES';
  SET_QUEUE: 'SET_QUEUE';
  REMOVE_QUEUE: 'REMOVE_QUEUE';
  UPDATE_CHAT_ROOM_MESSAGES: 'UPDATE_CHAT_ROOM_MESSAGES';
  UPDATE_QUEUE_CHATS_LIST: 'UPDATE_QUEUE_CHATS_LIST';

  SEND_MESSAGE: 'SEND_MESSAGE';

  SET_QUEUE_CHAT_STATUS: 'SET_QUEUE_CHAT_STATUS';

  SET_CHAT_STATUS_FILTER: 'SET_CHAT_STATUS_FILTER';

  CLEAR_QUEUES_STATE: 'CLEAR_QUEUES_STATE';
}

export interface IMessageID {
  chatItemId: number;
}

export interface IQueueItem {
  queueId: string;
  name: string;
}

export enum HTTPStatusCodes {
  UNAUTHORIZED_401 = 'UNAUTHORIZED_401',
  NOT_FOUND_404 = 'NOT_FOUND_404',
  FORBIDDEN_403 = 'FORBIDDEN_403',
}

export interface IGetUpdatedMessages {
  action: ITriggerActionProps;
  messages: ILocalMessage[];
  responseAction: any;
  sendMessage: (message: ILocalMessage) => void;
  additionalCondition: boolean | null;
}

export interface IFilterItemsWithType {
  type: MessageType;
  messages: ILocalMessage[];
  excludeItem: string;
}

export interface IReplaceLocalMessages {
  messages: ILocalMessage[];
  parsedMessages: ILocalMessage[];
}

export interface IRequisition extends IWithID, ILocation {
  jobRef: string;
  title: string;
  description: string;
  positionID: null | string;
  externalID: string | null;
  datePosted: string | null;
  categories: string[] | null;
  company: string | null;
  status: string | null;
  hiringType: string | null;
  jobURL: string | null;
  applyURL: string | null;
}
