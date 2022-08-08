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
  'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIxNTQzMiIsImlzcyI6ImZpcmViYXNlLWFkbWluc2RrLW5qc3k0QGxvb3AtbWVzc2VuZ2VyLWZpcmViYXNlLmlhbS5nc2VydmljZWFjY291bnQuY29tIiwic3ViIjoiZmlyZWJhc2UtYWRtaW5zZGstbmpzeTRAbG9vcC1tZXNzZW5nZXItZmlyZWJhc2UuaWFtLmdzZXJ2aWNlYWNjb3VudC5jb20iLCJhdWQiOiJodHRwczovL2lkZW50aXR5dG9vbGtpdC5nb29nbGVhcGlzLmNvbS9nb29nbGUuaWRlbnRpdHkuaWRlbnRpdHl0b29sa2l0LnYxLklkZW50aXR5VG9vbGtpdCIsImV4cCI6MTY1OTk1MDA2MywiaWF0IjoxNjU5OTQ2NDYzfQ.Y7Fm_Z66QJ1lfVpQ21cB-zasmXixwhQGg2OU5tQgiV0QL0-sLJdjqgcKMQl0vHH-B2hNcUaK14FPviVXp2Qu3-yS2a-CNFs_nvusvNZ9v_P28ImqSvD1Cz_LQpdIaSsr08Os8Mac4HYtFd9H6Y85bxXtloJzTCPObi1vNGRLClo8Db8rcgpaPh4lvnV3jtFVzzr8pIX0E5DNaAArNfTOvzwOgE8hcowdwwbO7BUfg89LCUApftAhLPRB2IdeVabnorU6Dgy_8gbFdsxzQBEhKXUwYf-XoukK6c1PWO3_09GXXE86S7r2FzK0aWninQgMVlv8bUTWCPHBRlqXCRP7UA';
export const ACCESS_TOKEN =
  'sL09zlnC1EvvAhk0TGIRiBcfqubpuseKl5fDP2Z7cV9d_P8KGXl_P99qlCXEOUCylv7LG9qvyZmR_dtAR7ZAlgtZv5LAsMdfZdx9Zimatj5pY-PGaVNjQKTEFXKl29rzyjV78h83lKJCzXtvmFtQPN1ieUDra5LL2vTQehR8PJn69LyVsilUOx1EtoCsbQXYpapefG8v9EArMPOWUJllz2t642xnwOc8uoyv85cTMk-z5LDsoWlGrwg8d3JPjpPx4yf31QLjRujaKFQlG37c-H_blSM4hKCUta-Zs1nbXPo0WinHrah_ZaF28DPldiZpS9eVlbYKC-PdqV556zXoA4GbMGIiQBSRnhRW8gpFtEwm74v8-Sn38OXceMoHqfL6u2CAOhHPj2Kapa9MBsyD0j-IBBGUyfNdCm74hvAINOPraivDXO4lIJYrQtccaizw3zyClmBJl9SChcV0dF4PgMBk0VfVm6e79jRYbbxNjwx3WhV17OtMbyJyQOFtf5-cnCrarjmHG85LDrbMzuGSWW38WQoEGaEuN0p9QZDbrX_tomKBstUXTkXZYfS9gA1oGrywCitPrzztbbEX7u6rVrYGgZaCoeZ-mye9IDnsLztnlivc2KYl2bTsY_vCQTXW8ZcG8mgM7VM3kJrfSNuWhlV5uNZFPGaqDXqcw2hFPGjkBJFWdb_y7kQiCUVCOQpqBwFrvcZ-4KU_8W7uIuWsPb5e0r4g-y0YqtTkl6Pk8HEyqVWqalJSd4NETX1OSUmQ-pM_IvMOhc3jSCPqGYXsZHZpyVBoTi6aQL5yygzdPdXXR548b6ZYr2-P0xeI61FJlDTTx6NqhG_aTTnRJS8cFeQLV4Jcj9sc2Q0Kd68MR5X4gCbgo1zmJfy_kHoroWxjBSktpsY_UVDJMcL0Nz3kLrDXerad5ko5N7fRq_ndV5ANgOXQqfxT5-QS9wCeexaeBD1UN_inp9qfQMwSXaP0VbvclHkyT55SUoin6yOeJS9mFTOFgdBkrWigR86wfrAwUCxBp2DqeEePZWt99aoHcUjqwzAQTkJ-6XM8VcnwthHPkWMkeBavA_akZCldiBcRaUg_fRv1Y8r2rhLc3hfiKu88xSli9fY_QRQJGpLRylCUkhloP97dftoYSz6T2ETPB3yTO0w9K2IiqDXap6kbpNdHoi_yfx53FNI83uthBqDAONhAJLNGW7pZTMSoWjvAQ957LWq1ilFzcWjMCVK9ZkqnlnnfZg4eTt3ANdSYy7APuTbe_qq9OdR40PNNyYo1I82iNWps8WgJDsmR3-YysF8T1G12V5Zs43z9yc7YGm8Vo8QsPjfHbby8AZMU7FJ1kpHArwJNkc9GHQnweRvdsA';

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

// export function* handleUpdateChatMessages(
//   state: any,
//   { chatId, messages }: any
// ) {
//   // TODO: fix mocked state
//   const proceedMessages = updateChatRoomMessages(state, {
//     messagesSnapshots: messages,
//     chatId,
//   });
//   yield put(updateMessages(proceedMessages));
// }
