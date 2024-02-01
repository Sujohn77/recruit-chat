import { ITriggerActionProps } from "contexts/types";
import { DocumentChangeType } from "@firebase/firestore-types";
import { Dispatch, SetStateAction } from "react";

import { CHAT_OPTIONS } from "./constants";
import {
  IChatRoomID,
  IMessage,
  IMessageOptions,
  IMuteStatus,
  IUserSelf,
  LocationType,
} from "services/types";

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
  TEXT = "text",
  JOB_POSITIONS = "job_positions",
  NO_MATCH = "no_match",
  REFINE_SEARCH = "refine_search",
  RECOMMENDATIONS = "recommendations",
  UPLOAD_CV = "upload_cv",
  BUTTON = "button",
  FILE = "resume_uploaded",
  INITIAL_MESSAGE = "initial_message",
  TRANSCRIPT = "transcript_sent",
  VIDEO = "video_uploaded",
  CHAT_CREATED = "chat_created",
  DOCUMENT = "document_uploaded",
  UNREAD_MESSAGES = "unread_messages",
  DATE = "date",
  EMAIL_FORM = "email_form",
  TEXT_WITH_CHOICE = "text_with_choice",
  INTERESTED_IN = "interested_in",
  HIRING_PROCESS = "hiring_process",
  SALARY_FORM = "salary_form",
  QUESTION_FORM = "question_form",
  MULTIPLE_OPTIONS = "MULTIPLE_OPTIONS",
  SUBMIT_FILE = "submit_file",
  THANKS = "thanks",
  UPLOADED_CV = "uploaded_cv",
  TRY_AGAIN = "try_again",
}
export interface IState {
  option: CHAT_OPTIONS | null;
  messages: IMessage[];
  serverMessages: IMessage[];
  ownerId?: string;
  chatId?: string;
  status: Status;
}

export interface IContent {
  subType: MessageType;
  text?: string;
  locations?: string[];
}

export interface ILocalMessage {
  _id: number | string | null;
  localId: string | number;
  dateCreated?: { seconds: number };
  content: IContent;
  isOwn?: boolean;
  optionList?: null | IMessageOptions;
  chatItemId?: number;
  onClickTryAgain?: (message?: ILocalMessage) => void;
}

export enum ButtonsOptions {
  FIND_JOB = "Find a job",
  ASK_QUESTION = "Ask a question",
  UPLOAD_CV = "Upload resume",
  ANSWER_QUESTIONS = "Answer questions",
  HOW_MUCH_EXPERIENCE = "How much work experience do I need for your company?",
  HOW_SUBMIT_CV = "Can I submit my CV",
  HIRING_PROCESS = "What is the hiring process?",
  UPLOADED_CV = "uploaded_cv",
  CANCEL_JOB_SEARCH_WITH_RESUME = "cancel job search with resume",
  MAKE_REFERRAL = "Make a referral",
}

export enum CHAT_ACTIONS {
  SUCCESS_UPLOAD_CV = "success_upload_cv",
  SET_CATEGORY = "set_category",
  SET_LOCATIONS = "set_location",
  SEND_LOCATIONS = "send_locations",
  REFINE_SEARCH = "refine_search",
  NO_MATCH = "no_match",
  SEND_MESSAGE = "send_message",
  FIND_JOB = "find_job",
  ASK_QUESTION = "ask_question",
  CHANGE_LANG = "change_lang",
  SAVE_TRANSCRIPT = "save_transcript",
  SEND_TRANSCRIPT_EMAIL = "send_transcript_email",
  FETCH_JOBS = "fetch_jobs",
  SET_JOB_ALERT = "set_job_alert",
  SET_ALERT_CATEGORIES = "set_alert_category",
  SET_ALERT_PERIOD = "set_alert_period",
  SET_ALERT_EMAIL = "set_alert_email",
  INTERESTED_IN = "insterested_in",
  APPLY_POSITION = "apply_position",
  LEAVE_FEEDBACK = "leave_feedback",
  GET_USER_NAME = "get_user_name",
  GET_USER_EMAIL = "get_user_email",
  GET_USER_AGE = "get_user_age",
  SET_WORK_PERMIT = "SET_WORK_PERMIT",
  APPLY_NAME = "apply_name",
  APPLY_EMAIL = "apply_email",
  APPLY_AGE = "apply_age",
  APPLY_PERMIT = "apply_permit",
  APPLY_ETHNIC = "apply_ethnic",
  SET_SALARY = "set_salary",
  NO_PERMIT_WORK = "no_permit_work",
  HELP = "help",
  QUESTION_RESPONSE = "question_response",
  ANSWER_QUESTIONS = "answer_questions",
  HIRING_PROCESS = "hiring_process",
  UPLOAD_CV = "upload_cv",
  SEARCH_WITH_RESUME = "send_with_resume",
  RESET_FILE = "reset_file",
  UPLOADED_CV = "uploaded_cv",
  CANCEL_JOB_SEARCH_WITH_RESUME = "CANCEL_JOB_SEARCH_WITH_RESUME",
  UPDATE_OR_MERGE_CANDIDATE = "UPDATE_OR_MERGE_CANDIDATE",
  SET_ALERT_JOB_LOCATIONS = "SET_ALERT_JOB_LOCATIONS",
  SEND_ALERT_JOB_LOCATIONS = "SEND_ALERT_JOB_LOCATIONS",
  MAKE_REFERRAL = "MAKE_REFERRAL",
  SUBMIT_REFERRAL = "SUBMIT_REFERRAL",
  MAKE_REFERRAL_FRIED = "MAKE_REFERRAL_FRIED",
}

export enum Status {
  PENDING = "PENDING",
  DONE = "DONE",
}

export enum ButtonsTheme {
  Purple = "PURPLE",
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

export interface IMessageID {
  chatItemId: number;
}
export interface IQueueItem {
  queueId: string;
  name: string;
}

export enum HTTPStatusCodes {
  UNAUTHORIZED_401 = "UNAUTHORIZED_401",
  NOT_FOUND_404 = "NOT_FOUND_404",
  FORBIDDEN_403 = "FORBIDDEN_403",
}

export interface IGetUpdatedMessages {
  action: ITriggerActionProps;
  messages: ILocalMessage[];
  responseMessages: ILocalMessage[];
}

export interface IPushMessage {
  action: ITriggerActionProps;
  messages: ILocalMessage[];
  setMessages: Dispatch<SetStateAction<ILocalMessage[]>>;
}

export interface IGetChatResponseProps {
  type: CHAT_ACTIONS;
  withReferralFlow: boolean;
  referralCompanyName: string | null;
  additionalCondition?: boolean | null;
  param?: string | undefined;
  isQuestion?: boolean;
  employeeId?: number;
}

export interface IFilterItemsWithType {
  type: MessageType;
  messages: ILocalMessage[];
  excludeItem: string;
  withoutFiltering?: boolean; // for ask questions
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
  expiryDate?: string | number | null;
  jobCode?: number | null;
  jobCustomData?: { name: string; value: string }[];
  poolData?: {
    pools?: { candidateCount: number; poolId: number }[];
    totalCandidateCount?: number;
  };
}

export interface IMenuItem {
  type: CHAT_ACTIONS;
  text: string;
  isDropdown?: boolean;
  options?: string[];
}

export interface IJobAlertData {
  email: string;
  type: CHAT_ACTIONS;
}

export interface IApiThemeResponse {
  client_primary_colour: string;
  client_secondary_color: string;
  chatbot_border_color: string;
  chatbot_border_thickness: string;
  chatbot_border_style: string;
  chatbot_logo_URL: string;
  chatbot_header_color: string;
  chatbot_bubble_color: string;
  chat_button_secondary_color: string;
  chat_search_results_color: string;
  chatbot_name: string;
  chatbot_header_text_colour: string;
  chatbot_bubble_text_color?: string;
}

export interface IParsedTheme {
  primaryColor?: string;
  secondaryColor?: string;
  imageUrl?: string;
  borderStyle?: string;
  borderWidth?: string;
  borderColor?: string;
  headerColor?: string;
  messageButtonColor?: string;
  buttonSecondaryColor?: string;
  searchResultsColor?: string;
  chatbotName?: string;
  chatbotHeaderTextColor?: string;
  messageTextColor?: string;
}

export interface IReferralData {
  employeeId: number;
  lastName: string;
  yeanOrBirth: string;
}

export interface IPopMessage {
  type: MessageType | null;
  messages: ILocalMessage[];
}
