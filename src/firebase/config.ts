
import firebase from "firebase";
import { findIndex, remove, sortBy } from "lodash";

import {
  IChatRoom,
  IMessage,
  I_id,
  ISnapshot,
  SnapshotType,
} from "services/types";
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain:process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId:process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

export const FIREBASE_TOKEN = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIxNTQzMiIsImlzcyI6ImZpcmViYXNlLWFkbWluc2RrLW5qc3k0QGxvb3AtbWVzc2VuZ2VyLWZpcmViYXNlLmlhbS5nc2VydmljZWFjY291bnQuY29tIiwic3ViIjoiZmlyZWJhc2UtYWRtaW5zZGstbmpzeTRAbG9vcC1tZXNzZW5nZXItZmlyZWJhc2UuaWFtLmdzZXJ2aWNlYWNjb3VudC5jb20iLCJhdWQiOiJodHRwczovL2lkZW50aXR5dG9vbGtpdC5nb29nbGVhcGlzLmNvbS9nb29nbGUuaWRlbnRpdHkuaWRlbnRpdHl0b29sa2l0LnYxLklkZW50aXR5VG9vbGtpdCIsImV4cCI6MTY1OTM2ODk2MSwiaWF0IjoxNjU5MzY1MzYxfQ.auxisccPXVCpO-SrxXB4j2lR-6FlfRZHqIUCWAa1pQGVKWJHFywcjEf8YVYurbwCxphoUcapaBh8Sgw4BV3gY2yB5hxMPwpjL_0vBWub4P8AbatuPgbX6f5WkCD3k9rtDrYGRgAqEnAfZ0oBZexOyjIs_sfkR4hcLAYyDhX8_dSAik0M54iDcVCpHmOE4c8GBalzcl6lCRXOp3gm7-FhN01cR7vmp-_aDhgH1TGRRNbYiNOPhlxcx0M1K0m0LXtD5W3lEoBoDBQZ68eTouVNAaXaL7PmBn84LGWeCXkrwdhQhVN4n82l6fXFZdlXickDc7PzAoPAWJA24G9jWoKdfQ';
export const ACCESS_TOKEN = "AR7ejySStMAHHXKsc6qiWifaWVOzi3Dx8_oIbKmI-bWqI3FMZd5hcjLLda8rGQ-WriDHcTAETFvtj50IYQa0eXRkpHosCQ_uCKz6Ci7oDVHAgel7d7i8mRioB3ToTDlYfdzXUuTMJ7EMpfATBhivqViWCPyBUV6xHTR-fUMoyP5quUK9jlyJ_bb5yBq_WbTuFdcl4FjlGIcXQo0GpNP_EFqJL9imeozIEfCrAPVSOogz0hWNupkH_UqMlO_1cgRJLetIBzS65S2W_lVdn89PmDwvGD_GbQ-S5t8mKp-SmK0JuyBqu3dWvYE5w9J_0xvWybKayVtdnEZQA4aqkXsiCZy-Pw37nimxrdQ7wLrzXvqpz8bbTU4TdqcKHpaT8TXKCiFOjgm5Iv4-zQp-7USY-5YqZ94O67pSItUaMA-PwTbqbiGyJdA70F3HM3G5_gcLWxRxQVLI9aveG_UXkfuPbZMOT1UIQXYEpxISWrAfdKpy94HL5Mh-Pz2r8T9jkMPGB5u3Iaf6D3mduijRooyDVxIF0xahxZb3_kw70ThC_glRjz2h9sgUqDW40mFe6I23EUKBRc-JwWegJE0bzGJ7I3BadtbDyqRqk6jgeGzFql9N45zMnmA0rTn15QlVQ_-W5uaUGtmi3NmPAOuYiLHO_seJ0NyFRT6m606WRb1epk56ADI7qAPLKEJsMvFwlF84jDOj8NFIdvQ82rWcHNINvSGjFJPYzJ5lWumIAxxkPNlG3cOOletq-EyIttQgBfRcCsz4C5ZOC_9g8omCeX9gj92eO0QP8PG64-hSiVjJ_03m5NmtPC_gjvGK3g-p0zuNYEfU7_pql1Epjuw1PW6s_6AOS8AuGXOfLHK_4KTPCRJmyQodWsUkVJ8eTl9YUU0j7Ac3JDqXcawk3Gp0jA434lGuKg8JVA6LOJxDWvjFThR2EI0zuRl5kKupe-2hyHB5QLA_bEng7aKgqpRCwRnxkxbKlQSDYAnHAsfwukajGUntq3pFao2ggDr0Xnap4ZDQ7GUVx68IsJ9dxp2apFoI2-tgmEk-8Peteqg1vvmzOXGLY29vMIQO4g3kOrdM6ed-p_q9xmVpz_hpKH1PaXgvzA2OLztXCM193aYoCGTnAqglkDhsyRZ6PS5JNCpynfXbqbWPvANAoGErY2bImQWxiWO57hgvdDrKJDY2MyY5UEIntF6vlMoVtuFe2eLmdi2KdHTni1yVxn23e-33ihBv__cujB7GcpoZ_QD7sd4jXorQaDMBBUa8CxBHd6Gju13WmqjcuxXXDs_62YZGl97Bt-5XZP4oriFROto-DIPqrdLv84ECfbenvcoDriPNfe5oQEAb2Nb9zYcLDciY-ZB4Qw";

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
console.log(initialItems)
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
    const processedSnapshots:IMessage[] = sortBy(
      getProcessedSnapshots<I_id, IMessage>(
        updatedRooms[foundRoomIndex].messages || [],
        messagesSnapshots,
        "chatItemId",
        [],
        "localId"
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
