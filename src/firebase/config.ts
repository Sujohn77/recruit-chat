import firebase from 'firebase';
import { findIndex, remove, sortBy } from 'lodash';

import {
  IChatRoom,
  IMessage,
  I_id,
  ISnapshot,
  SnapshotType,
} from 'services/types';
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

export const FIREBASE_TOKEN =
  'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIxNTQzMiIsImlzcyI6ImZpcmViYXNlLWFkbWluc2RrLW5qc3k0QGxvb3AtbWVzc2VuZ2VyLWZpcmViYXNlLmlhbS5nc2VydmljZWFjY291bnQuY29tIiwic3ViIjoiZmlyZWJhc2UtYWRtaW5zZGstbmpzeTRAbG9vcC1tZXNzZW5nZXItZmlyZWJhc2UuaWFtLmdzZXJ2aWNlYWNjb3VudC5jb20iLCJhdWQiOiJodHRwczovL2lkZW50aXR5dG9vbGtpdC5nb29nbGVhcGlzLmNvbS9nb29nbGUuaWRlbnRpdHkuaWRlbnRpdHl0b29sa2l0LnYxLklkZW50aXR5VG9vbGtpdCIsImV4cCI6MTY2MDgzOTM3NCwiaWF0IjoxNjYwODM1Nzc0fQ.jFKPcaMinKBqoCr7LrDkQNPRXp3l32Bra8QEPrk2QuUAuGF8tpd1b2glBnIAnom8NHpZeVkWLJCtsu455g6b7PgprhGBVvc0RSIXSDaoUUuZh_xR_8MXyKRR2QbmYtgGtzUFCcToKu1briaqHVa1nKiPfCj8HL1vv4I5d0v2VsIRZDuqnS8A7LSUZs7bGqcuqX4n_yY44uNoQhYbKYh-pLQFQ5MrPZjIDSfr5YkzCM1BLU1ebCM5s0xzpaRHI6qDbkfoWhOUUMfYtTCqGt0t3YWOLlTTq8Uu0bSxTCdHlB7t9duodkdQrnYv47RlZiX-ksJ9AD6HX_Ct-LXV8uMBzQ';

export const ACCESS_TOKEN =
  'wJHrX4S11bv0OiQrl81niV08d2zNWo2RdeKwH_wecTzzJnbIoG4T2NUg6xsLTbAhcYKQ7_YzR3EopBjqcaUiquKbrcChpEHhQqucNGPkKdRAvv4ushqWHi8QTFj58Yzhb-J3eLwww8tL1qqX0D3RuMVcHMPdDa2TUDNTbySQlL7-ooQkpF3_CrBvLhx3DW7IqznOgcIFKcYhcnjvs1zn4Rg9_U4my2ir1_qHqcvbkThEOoefkqIrD_NkYGKhS_jKrUgtC5NuA6pSCQXcYO7r20IqnYP-BjGflAklaBw-u1RQ3IgLghUiDj1tKe4zKSRlr5pLQKM5cEmQLCwWR_05J5kLtMsV3-Oqsq2LpJEUzrUYCzB85QGSPU4JbbVE3yY3GWU5a3bt3tsNscszeMHo0PS58V4blL3QoCRxR7Ydcs5Pc0Rhy-qUw96VTmq2UsCtr1ki9ot39r__bOLkmN0XC4-RXPr2irljR80WiKEzimk0LHTp1dZVj468bR2hKoqZbZT04c7dGyett6wqnMWJne_-nlgKlesd6QkUH4-WeFpNHLbL1YX85BZ33JnKl_sTBnnuCoV0iereNWCuEQsNNhCqv-tWZVefNez0dHIKTYL-V2gtr2a8QkO6Q1uOE8Whq0xDvp5jahqFX-pOPo8G0JNDljv7lJn2Qu_2HrYEl0FfX5k_sbwMhFdGDuSJF7EZi_tK6KKCNf4_Z60fRUCydHddpmYzEfq7VAPAwrjdVePENGu65_lblOcr7Jps46cGZQqcHVm7ltITBbzYtOyDVxzEXqdUJfuC6Pmt05ZiiUaq1yPpHH7MV6j_hgVcjFqTURExVKnhGPM2PQ90aPw5m1rdw3eMicTJiYZp07jfUubtpnMCCDK5ZMq-9d-p5cmwQUyDCCVJM_BKrxw_EsKwK8P3SnIdHc-4cBuVsSg9q1sfN8zOQB8zJtMbBSUE8qSvWe-o3UPT7lzOU5Nf9hbNowL3LrbQSHXqTVaa81xo2ALOr2zLh6GlyDKWH0SG-JBjiLaQk6oB3oK4EdU3g42zxbw90SHXP6BFgkuLRMs2-x2PwEmxg5DXtjsPKgcvgxbk95KnBCCQqlDfKd_692Y7kz3B7b96IZx6nwrDOoNMtZQLR97u5GViH0tpeOGBBZOyFE5tWmsRV0LodhMc5wJKrEawsggVhHBnkE_MpLs687zqdWrOKGXhyJHNHVd5xUg3wTUNkS1QJT1bje6c98i2BCaPjJquMMPQC6epr1YKoSy-rwYqjX9vlLF6tuNMtxw1uBVsYOhTdSGE_5OLuueSF0g1tAcsBXi2P8uuahRqgpkVjAzf1SGcHCZyt9VZ2L5Q9_IdmrxXF0Bfsj1yapjPOQ';

export const app = firebase.initializeApp(firebaseConfig);
export const db = app.firestore();

const auth = firebase.auth();

export const handleSignInWithCustomToken = async (accessToken: string) => {
  try {
    const userCredential = await auth.signInWithCustomToken(accessToken);
    return userCredential.user;
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error(errorCode, errorMessage);
  }
};

export const getProcessedSnapshots = <TId, TItem extends TId>(
  initialItems: TItem[],
  snapshots: ISnapshot<TItem>[],
  idField: keyof TId,
  fieldsToSave: (keyof TItem)[] = [],
  localIdField: keyof TItem | null = null
): TItem[] => {
  let newItemsArray: TItem[] = initialItems.slice();
  snapshots.forEach((snapshot) => {
    const { type: snapshotType, data: snapshotData } = snapshot;

    /* Skipping objects without id field */
    if (!snapshotData[idField]) {
      return;
    }
    const updateItem = () => {
      let foundItemIndex: number = findIndex(
        newItemsArray,
        (item) => item[idField] === snapshotData[idField]
      );

      // // Try to find object with localId
      if (foundItemIndex === -1 && localIdField && snapshotData[localIdField]) {
        foundItemIndex = findIndex(
          newItemsArray,
          (item) => item[localIdField] === snapshotData[localIdField]
        );
      }

      if (foundItemIndex !== -1) {
        fieldsToSave.forEach((field) => {
          snapshotData[field] = newItemsArray[foundItemIndex][field];
        });

        newItemsArray = [
          ...newItemsArray.slice(0, foundItemIndex),
          snapshotData,
          ...newItemsArray.slice(foundItemIndex + 1),
        ];
      } else {
        fieldsToSave.forEach((field) => {
          if (!snapshotData[field]) {
            // @ts-ignore
            snapshotData[field] = [];
          }
        });

        newItemsArray = [snapshotData, ...newItemsArray];
      }
    };

    const removeItem = () => {
      remove(
        newItemsArray,
        (item: any) => item[idField] === snapshotData[idField]
      );
    };

    switch (snapshotType) {
      case SnapshotType.Added:
      case SnapshotType.Modified:
        updateItem();
        break;
      case SnapshotType.Removed:
        removeItem();
        break;
      default:
        break;
    }
  });

  return newItemsArray;
};

export const updateChatRoomMessages = (
  state: any,
  { messagesSnapshots, chatId }: any
) => {
  const updatedRooms: IChatRoom[] = [...state.rooms];

  // Find room
  const foundRoomIndex = findIndex(
    state.rooms,
    (room: any) => room.chatId === chatId
  );
  if (foundRoomIndex !== -1) {
    // Update whole room (link) with new messages
    const processedSnapshots: IMessage[] = sortBy(
      getProcessedSnapshots<I_id, IMessage>(
        updatedRooms[foundRoomIndex].messages || [],
        messagesSnapshots,
        'chatItemId',
        [],
        'localId'
      ),
      (message: any) => -message.dateCreated.seconds
    );

    return processedSnapshots;
  }
  return [];
};
