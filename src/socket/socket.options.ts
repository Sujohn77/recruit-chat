import { collection, doc, limit, query, where } from 'firebase/firestore';

// import { Query } from '@firebase/firestore-types';
// import { isArray } from 'lodash';
import { db } from '../firebase/config';

export type FirebaseOrderType = 'asc' | 'desc' | undefined;
export enum SocketCollectionPreset {
    Chats,
    Messages,
    // ArchivedChats,
    // Users,
    // QueueChats,
    // QueuesChatMessages,
}

export const SORT_ORDERS: FirebaseOrderType[] = ['desc', 'asc'];

export interface ISocketPresetOptions {
    pageSize: number;
    sortField: string;
    onGetCollectionRef: (...args: any[]) => any;
    queueChatStatusIds?: number[];
}

export const SOCKET_PRESET_OPTIONS: Record<SocketCollectionPreset, ISocketPresetOptions> = {
    [SocketCollectionPreset.Chats]: {
        pageSize: 10,
        sortField: 'dateModified',
        onGetCollectionRef: (userId: string) => {
            return query(collection(db, 'chats'), where('participantIds', 'array-contains', userId));
        },
    },
    [SocketCollectionPreset.Messages]: {
        pageSize: 10,
        sortField: 'dateCreated',
        onGetCollectionRef: (chatId: number) => {
            return collection(db, 'chats', chatId.toString(), 'messages');
        },
    },
    // [SocketCollectionPreset.ArchivedChats]: {
    //   pageSize: 20,
    //   sortField: 'dateModified',
    //   onGetCollectionRef: (userId: string) =>
    //     firebaseApp.firestore().collection('chats').where('archived', 'array-contains', userId),
    // },
    // [SocketCollectionPreset.Users]: {
    //   pageSize: 20,
    //   sortField: 'dateModified',
    //   onGetCollectionRef: (userId: number) =>
    //     firebaseApp.firestore().collection('users').where('id', '==', userId),
    // },
    // [SocketCollectionPreset.QueuesChatMessages]: {
    //   pageSize: 10,
    //   sortField: 'dateModified',
    //   onGetCollectionRef: (queueId: string | number, chatId: string | number) =>
    //     firebaseApp
    //       .firestore()
    //       .collection('queues')
    //       .doc(queueId?.toString())
    //       .collection('chats')
    //       .doc(chatId?.toString())
    //       .collection('messages'),
    // },
    // [SocketCollectionPreset.QueueChats]: {
    //   pageSize: 10,
    //   sortField: 'dateModified',
    //   onGetCollectionRef: (queueId: string, queueChatStatusIds?: number[]) =>
    //     isArray(queueChatStatusIds) && queueChatStatusIds?.length
    //       ? firebaseApp
    //           .firestore()
    //           .collection('queues')
    //           .doc(queueId?.toString())
    //           .collection('chats')
    //           .where('statusId', 'in', queueChatStatusIds)
    //       : firebaseApp.firestore().collection('queues').doc(queueId?.toString()).collection('chats'),
    // },
};
