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
  'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIxNTQzMiIsImlzcyI6ImZpcmViYXNlLWFkbWluc2RrLW5qc3k0QGxvb3AtbWVzc2VuZ2VyLWZpcmViYXNlLmlhbS5nc2VydmljZWFjY291bnQuY29tIiwic3ViIjoiZmlyZWJhc2UtYWRtaW5zZGstbmpzeTRAbG9vcC1tZXNzZW5nZXItZmlyZWJhc2UuaWFtLmdzZXJ2aWNlYWNjb3VudC5jb20iLCJhdWQiOiJodHRwczovL2lkZW50aXR5dG9vbGtpdC5nb29nbGVhcGlzLmNvbS9nb29nbGUuaWRlbnRpdHkuaWRlbnRpdHl0b29sa2l0LnYxLklkZW50aXR5VG9vbGtpdCIsImV4cCI6MTY2MDIxNDQwNCwiaWF0IjoxNjYwMjEwODA0fQ.Ltgkmbg8GebXza0oiAcsvQH_v5UjVRae7GQrkejfbHmhD0_MY9wmG4s7tobAdlwL1bvsvwb_C8euTwq30-tiq45tWOVhgZRbu6cugc26TxGF3FuuXvljJ327OFWaa3FOdce7qqnzGN7ms5hgtJ0sI7-2dSP7FTc56_XR_Jx_ek4VbWD8I5iZ77r58YuspIMhQkm9rxDsZI-jqlXdrdpM-i1rC9Z7j6NAGWhGwuFn4SjSGHoknFmSWfY8pZu3I8DjOs6gSS-5ZwOHrLrHUa6kpwjZQppYfoIPS7A72befa80beJn_3a32o4pRo2O1XTYV632R-dxnAnLD8O8u9m8Xkg';
export const ACCESS_TOKEN =
  'LTFpMY89fZDYWgxjLSGOpj8XYImH_9cAiHG7yqepy_Uaj861Ug_ijSeeRUePjLbpUHCpVSlYyWODhYF4ZlHJJpzDa1jw300S-skzy_2tNecx84aYWNU_GF81CuJC-X1Jj9WZH9kxmzaz1_iu2CSSkGGMpoukTPjaNfNVMrD4yBBoZCQClkclZ8FVgfB4sBjG9s76G41Nvga5ewjjBNE15AClv7Ta4EOiTwHrghjk68JzLyiTFCjAeppGQ7gSiuYcddKet319d8K5VYgwcmhZZufsMpyk0BOYG1ASgd2Tblta6LYJJGmx_hZsSWK0ahgAnczXDtrG52kpkMsdn_xt9Re5EMKvsHr7bil_V8AMYkIgekuCXhU2aZQPXUULL99mwTAjfOO2LHOrAhTlXO-g16SzYULtAx97SaHo_rrOu7cP_nlAXIpIJU3_tq_F_RR_sCvtMLWaKEGluTyZzfEzLrQk7XH6-BNCJMlu9zsunkWxQwdjRYMmCQondLJIyqXwe5Il0HzZttdn3YlmmzYhDQEN0RTOf_VhaUnSBPj-fzHsmzcQj7zvN_oJ_GQjX9mIiYBysPXZrt5Lv7NPJZweiGyB4T37ezRnjNkrQ-4fPGmV_7XMKfILV35ZaLTJIm4MoWbv5IhynRuCP8o1reA8F96D-cQEXeUejIiwli154VdkT8YkR5XiIVj_8CrrHhsYLvVh1Wr-2a-3LRabEYzCk3Ik7VghX9ry0OO6r6ykqDxB9wBn78FbknhcswxexOBVmb4mnejFtx3WeN1U0Kx_cVTnV4n1qFfgL-j6aQI5EHcBPwF1izpQV00somrsXO4svgTEhSpwfKiiNyjH-vC0NI3NmdVwlvzEqaI9eCct_rGrBjuQXzpjqaACI5LV98-AH71hZqg9iIWvl8tUiqMhgyV3QDHvN4geL9n7rEi8dzIX5tnc2bqbAhf7mWy9aGG6OQZDAMWAi8kCaR9E7FXz2U5IrCMOAX--sqVyfTxrGZuiEnuJ89xSgOW3qz-WQdqqyx5Fl37LJlJvBPoLQ3W77IOoy5kkM2RSn-p6K9VYRs5qFx94nIJk1ZfgxT3MPki72HZe1hAhd8R0dV1Oj5FFQiHBvg6vj--UZd5H-g0gm5SxZnfH8_xNAQL8lEIK-hL-NRk0FSdS9XqQMEUAG21oR3EumZmzRo0-eaRNgZ5qlohxp7GyH0iQoeBi0rfzy9KJWl8Vker7F5kX4B9j1KB36nOLOZ4sS1QmbAOqtKJBcjs509W__4xjaLwcXzwi8uExXSgYgZQXdWOoJbWoXzTz6LJvdV4DlKk9KFClCh0iSqnTa8KDZpVYPRGs1VWgOE_q9sq0P3FUck9jp4ukTLFFxA';

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
  console.log(initialItems);
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
