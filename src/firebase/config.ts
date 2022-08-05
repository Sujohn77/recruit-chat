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
  'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIxNTQzMiIsImlzcyI6ImZpcmViYXNlLWFkbWluc2RrLW5qc3k0QGxvb3AtbWVzc2VuZ2VyLWZpcmViYXNlLmlhbS5nc2VydmljZWFjY291bnQuY29tIiwic3ViIjoiZmlyZWJhc2UtYWRtaW5zZGstbmpzeTRAbG9vcC1tZXNzZW5nZXItZmlyZWJhc2UuaWFtLmdzZXJ2aWNlYWNjb3VudC5jb20iLCJhdWQiOiJodHRwczovL2lkZW50aXR5dG9vbGtpdC5nb29nbGVhcGlzLmNvbS9nb29nbGUuaWRlbnRpdHkuaWRlbnRpdHl0b29sa2l0LnYxLklkZW50aXR5VG9vbGtpdCIsImV4cCI6MTY1OTY4OTcwMiwiaWF0IjoxNjU5Njg2MTAyfQ.WPixB0MvyLYW4NBP2RX7Xeu4Ow0Hmvi0uI9aMqmI8ElxvNWJ9ljyzkx1g-7Tt85hCoQgVvIAR3FBEubhbrZgECbQwNwUwMWId9hKp5cSRzj1oKRcSf5MpHHEk2uyD63qcCE0oBS4erz8ZC06qjKE7UrEeRiMXDb_ICLNmxmv-6Kl6d3RYLhTvDaEBxWXLoQEdWElx8r33eTBv2VbugzevlO5TMoz5ks67sZv__VJoUWS4A5uRZ2OZQEanFqz_sQdQI9B3fVAGKxdmpvaAsgkHLI8xlIdbGmsh1vXg1npleZLj-MDpwtYAMmyFI9EvAVKIwQlLrxbfLTpsf2DGojGmg';
export const ACCESS_TOKEN =
  'XulGho0NCEib4bNqkMjE2st-EHOkY3jlLbyYFGd6tUeZB05rEJc1JwDeawvTuGJmLnsEYJtcLnskm-DblSvSK3nMeSvtvq9qRdNXN43VAiPx_GqjUocw4AkvoZ5SmEgycP5dJgVQTW-usT_FOEag65NBZ9DtUKPg3Ga2hqRD_X9hCvyhU0SrgwoY4hS2ajBPZ3uO8LDQWLKizijj239n_at7I11guYY9JpQfF3Zv6VzGtcTPqkOrWnqU90NS7JPmsnTrBduRMwOG8GmphoQKUukDuiLpydTv1-4Qpc0C6_Ux0nzTKB5yPDty40zbmhhCEVJzPsdZWygwkQVQWEivXYz8nM-mJubLnhfV_8yEKCYgEjNkqBpDq0lYTJH9XUk_1GaTxXmvM4dcqk0DTmA2EgmYgw0DgHL2iSQyglWnyhAGfR6tPoEJasfORI4unI3HMhZ5BAwi87b63aTuR5v7pSd7So6ZU5H_9rVknWGTwrqEDv5JdZdbyRagnd5kgYwalp9QYZVxLPsLw3Aetb0QjCjCQX-9oypxbZsjNwOIvOPXze76H-LEAkC1tEwiN03WXn3Oee4KTlXoaoIFC9hAJnHR99BnPSJYKlkQgB8xstyZ9KzlT-Q_L4QReyZMuZRmZsUrd8WC-LUU_p0MkeWjL5Aw7mY8O2R04Ybkp-aO9Ll5foes33zhsACUVG7E0y7bnyTT58csgin-1tYB9_sK90Vc4fxecEhTAcJMkw6sI7H-cA7YQSyxvGf7YqC_-7cJu0XYNQGYg4ve1oA_zkWMihHdlCdR7hvB0RpZyYQqH16MmfdF3cyMXSY99yteiMGmT_a3BN3RqDZEAdlchwq8Xtywswb7lAa2NB8-pZM8kYBHr5eShm0Qh59mk6fn9DTKFzs712lunwIeBTb2KYNgyc-4ImKPDR97XfZdtHfHtVWSJtDAORhsErtf56UjW5DKc_3DWjwcxPjklSdxneciLUgtfgbgStC7oma0D2YJjrakr-TlqJTtMgQSxHcpH-r4Ja1FEaos83-Dv_X4V3wj8ds58iLmFc9Dr4pgngKYSq1A2tqld69tKx8HjzrDYj1WxtpttqyL38lM8qbtYgQZXlNpxcZg40PFSJmG_Fx1_aWxJwz4eeKxI91I8tOWs_Y8Nl077ZgxVAub-tDcizfFIHIlwRg-SxE3j5VqPwu_rt1Axmi1nLNTt9RzHQeslYtdVync5d32EdXIgQYQHh-11gV_tusBaeoYsxz0yDiZgLAJOHuRqSai5pTdmUo936Szopmanpm_pS7vTKxnm-dzyOlBH8lwD62lL5Q7elFaVk3tK7N96ytzfqPTy0bybmjJWItFubWyjsd2_u6PKZbTbA';
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
