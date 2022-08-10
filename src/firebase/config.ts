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
  'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIxNTQzMiIsImlzcyI6ImZpcmViYXNlLWFkbWluc2RrLW5qc3k0QGxvb3AtbWVzc2VuZ2VyLWZpcmViYXNlLmlhbS5nc2VydmljZWFjY291bnQuY29tIiwic3ViIjoiZmlyZWJhc2UtYWRtaW5zZGstbmpzeTRAbG9vcC1tZXNzZW5nZXItZmlyZWJhc2UuaWFtLmdzZXJ2aWNlYWNjb3VudC5jb20iLCJhdWQiOiJodHRwczovL2lkZW50aXR5dG9vbGtpdC5nb29nbGVhcGlzLmNvbS9nb29nbGUuaWRlbnRpdHkuaWRlbnRpdHl0b29sa2l0LnYxLklkZW50aXR5VG9vbGtpdCIsImV4cCI6MTY2MDAzODIyNSwiaWF0IjoxNjYwMDM0NjI1fQ.oUvj4jWCQ6Mfgu3tWNvBOW_29hvVI1Iths3gsbn9xXBG7ZlO0EnLRMBTWXIEiI9z9E3rxInIznb66ej-hfA-BmujHT0smBOAR3KBv6aT1kjxziqWpVw98BfzDMvUQCAJOUjyk1XcdzLDygusPoB36pnOtAfhRMCObtBLz9w1UpLLewxbqzvrKz_CeH0AI80oWrKpAO4SsQloU_cslTAR0V29VybY036bsc93X6qkwy_iumqbvYdw-lAKAXz__VQj6h3RxMdlY8zQ1bITUdeDl9RufTCSSv_ugHGF0ec8y-aMUqYpikR5daW6hnOmJUAEe_SCcX77KWWaLZuKBBLzoQ';
export const ACCESS_TOKEN =
  'qQPyUH-cGW2jP-2qQzYN3Uoc2_MnIRxr0Q85PGKd-9c6qQfmw13uI7wUfzby7pQZpDa5B_xJ8NTw5WgaKjpYDJ5Mlno9Pfc-W_NuUGqTI2z1bhdwtw4EIbbycq2q4EXZ3z1bmpd2_37thKsVfAEDs8tb15pV-i2xwz-q_UPKT6-ZCuWNEfBr25bT7H7xndQBqSHmCLYsAdTk5MpTPcGRKACBYkw3RpMm1UOGZZLhUfUrqVRsLrD6WEJv8JNg3IKvoQr-VeXaawPNEGMyEO5IcGbzQ9_ngGNrRK1XieoZshjuaqB8YGH5K2uyTL8MdFOpqnozX2I-wznD1Gx7hf-7J3D68ySUi4VycLxGzKWKlBuVh5bfA0zeGV2i5upWy6Fi8TypGrO4G4h8oi9RI6g5QkgCV9vErGj0wkZ363X7ACFdZr_SZMja82WKPVchXf_HyjnbPw9wCrzrrHjE2rE_76LR6u3CjFoAqo_wLv5k1fiUZvU2Np45xn7klaJzlnfcihu4_CnanQl_mfFSdHbOAVcKdXnlhJ-pk139IFkZZwX_s0llL2PgRMgnYPuQALZ6xRF_9JAz66zbrw1Jt5sQF5VKh9EokHQIyB9c53hNbAioKhAoOG1MzZvJPKHLY2o2XXC2_H6e6c_SARQp40QtPpJtq7VFooT8-RRaLpjtKiXnMzfy4OVGQ4PsnR2En2HfSqKPmZvWU8xaHDBYgKBBOrqHv7hHdJocmbM6YH2PPCE5V10MyTXVrlX7VqRGk1_3XSQ4uNWT59W65xhg9_pw3tDiFYlhkjIiEiLhfhs_xQCxKUFc8zXtT4-M0orHaUYIee7tnzdNyoqNwlcufD1vp_DyqkrvKkerEryLWca9v04gxSAKUiZ3sxfs-4l4Xn-kTsWE5xeVOqQYNKeiMeqceCEq2Wm9v0YTVl3O9_ETq7d4qPEsLqW5yX2LysoVYjG4xubL-RTyfSMGps0NUmZ_6Zz109ArRV8w5KDo2esIxNm2aDPmwwwrnBCJGELaTnKwbIMZoezS0F-OwmEpqPpUI2pAu3JN1aAy42zthJkIZKTqK5eB31Ii2xkxKUtJHyQBEFX1Yxt-qxqXCio41KITVLwFNq-T_wdQWASRkeTY1vCtKkPRF3fLlvaEd2w18ZpxpSxPrZS4cVpyIn7M5COsZdiFoC4EaVmDvhl00AiGMcVHSQ-xnrFOEuPFz9OT3eArzepR9EseaMNZrcVLfSw9NLGDNfyF32b2U1mEfC8NY2-49hiie4DI4ODPUErvSD5boaH5vXtYw1Io-UhctEuUDsesTBqw3_onYZxn3N1d04mgpPKVBZMMe63epK-INuDH0__Q-UOjvK2MnCgVCnTDAA';

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
