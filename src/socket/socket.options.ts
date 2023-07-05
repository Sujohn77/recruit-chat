import { collection, query, where } from "firebase/firestore";
import { db } from "../firebase/config";

export type FirebaseOrderType = "asc" | "desc" | undefined;

export enum SocketCollectionPreset {
  Chats,
  Messages,
}

export const SORT_ORDERS: FirebaseOrderType[] = ["desc", "asc"];

export interface ISocketPresetOptions {
  pageSize: number;
  sortField: string;
  onGetCollectionRef: (...args: any[]) => any;
  queueChatStatusIds?: number[];
}

export const SOCKET_PRESET_OPTIONS: Record<
  SocketCollectionPreset,
  ISocketPresetOptions
> = {
  [SocketCollectionPreset.Chats]: {
    pageSize: 10,
    sortField: "dateModified",
    onGetCollectionRef: (userId: string) => {
      return query(
        collection(db, "chats"),
        where("participantIds", "array-contains", userId)
      );
    },
  },
  [SocketCollectionPreset.Messages]: {
    pageSize: 10,
    sortField: "dateCreated",
    onGetCollectionRef: (chatId: number) => {
      return collection(db, "chats", chatId?.toString(), "messages");
    },
  },
};
