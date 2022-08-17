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
  'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIxNTQzMiIsImlzcyI6ImZpcmViYXNlLWFkbWluc2RrLW5qc3k0QGxvb3AtbWVzc2VuZ2VyLWZpcmViYXNlLmlhbS5nc2VydmljZWFjY291bnQuY29tIiwic3ViIjoiZmlyZWJhc2UtYWRtaW5zZGstbmpzeTRAbG9vcC1tZXNzZW5nZXItZmlyZWJhc2UuaWFtLmdzZXJ2aWNlYWNjb3VudC5jb20iLCJhdWQiOiJodHRwczovL2lkZW50aXR5dG9vbGtpdC5nb29nbGVhcGlzLmNvbS9nb29nbGUuaWRlbnRpdHkuaWRlbnRpdHl0b29sa2l0LnYxLklkZW50aXR5VG9vbGtpdCIsImV4cCI6MTY2MDY2MTg4NywiaWF0IjoxNjYwNjU4Mjg3fQ.NMy-AtCELs-O9epcDQ5CtbHoteAdKgMSuy-jWNbz55KAo9DbmzoWI13yjE0VD89_cDbW1_4XqPAlsIExAlz0kH8fnBzPEjh09yfONzq5dPeReCl9fTZG5Mvop1qSqyAWCJ_VslTYQH6353I6ZITg9a3untvpMmMfBVImMRAoRLU5EL5Wo8teWfkTQEymOgtvOG7K9ggfeuCoonHX58_OI1y-ZHMWPk2eARFyXeMnZ-Jn2PD_VJoVNumS1tU_OT8ouhhGVxQ-9hcxOA0LwcB3jwNQrOY2PQjtvFhz6A7JB8o7WZBOv0PciLs_VixKHq6dUrdIGBkk2K_pUu9ZcQ8PIg';

export const ACCESS_TOKEN =
  'yHQT7_E8pnUFqdnSdXf3QLdSvrj2YFSmYpvUEgmAmEtGChTcWCeKucajSVnflDWEy3ZzPeI5hFK_S4kN2xtZdYkMq-R9I6UJ6xW26fpjfwMyiBacAv14_bZatWfTtmUCXgIq4e9BHhf8vK10mAwR_Qz3CDd7GPWrTfO2Qh37hWLr9d8x-NFvVjopferVrAP9LYdOesAN6E7-QaHU15zrQo5xqmeqe_k2w4WNka2A4YqOOd4wGs76OFP0PyGqhYgsyRp4EtZB6lDdttmURAVtULScG2QL1LPqc0xz4GHpybAydI5SzEBLzYAb6HCKb_sk8oj6LYH6Q9xwWhHj_Je9EYHwMgdVCihSFL8kcAeRY8f0-PokqlMCq42-ezbIF9nfOGqAmqTI02-lWAuK5njxRht5P0eGf81Nb-mhkHMhr47WtS2AoAMn7bSXcBiU7IXoHm2brPPzXluyJxPkCkTdVDNfhqSAPZREWC_GdsR6rfIDg90uKHCOMxWyT-uYS1PiGEindhLiNtyW1n7d5z9rpH-FmeVz5WaA2MDRdbrylWai4-JWVIfMiE05TjnzefMb5QDLFLwQ3lrn2oN0dHvJCXlQFdXceQtzOuxwqJsqNrBVchcCzuFU0JW8gBKC1kETw8I5FLn7Y9sX9oErh-nMMuzLTrMw48ruzO1CGAKM_61iiYxdAWt0_UzEkmrfzIBA8yH-0lQjiQKZ_i1DKP2hF_G_5wvkWqqG8q23JPLuMF0iKXwEAihQ2ux9BUXun8X2BlbjFp8lbLj_D7iE963FymdTNlU3cvOAKBpzkPXE_TqLQdNr20Js31sadGfLlptUy561H86UpdchEK45DMMCTN9xtt1dGt020J3jnNR4nL-7sYEY-68KxuOiz6lInPp3YXnN8Ec2gW5FZWAO-nBasEvhoj6bdasPSqdp1zpdE23g9Wf--3TGPZnmS1RVBrZjCCDlAfJVplHyCUNAdwb0i6pzEZCwFeamlF3vMNe-UU4o-R6kbasoS1NJ9XAQVw1Y98_nvgcQOnkgTAX_Dm6WkNoCaDye3gdpbNcPgO52X6Wu9renbGELZDazfSqEWM2Lin4s7UIzLvSl5K0RBr9KEqxXY7-ivsdyY2DbLTf9ICf44gDxM6u-Z7yyg_Ac-0ASCpG_UVY8lwizcoGaBZF2BhAlePhlOsScVh49A2F_AbfcDO87xziBsL8nzh3x64fPq6CZK8KQwknuWUe7rwpKEvt_YCEw0PA1AkUGfRr1SbY0z8g1cYjm2qdVA3xtRQUVUM4mSzVGhTuZav8XtpZvthECSQvMXzfSi5mYoFlzAV-o4OAURvlg4oN42q3YyJVt0bywX4alTQ5TiDuOq6dkVw';

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
