import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signInWithCustomToken } from 'firebase/auth';
import { findIndex, remove, sortBy } from 'lodash';

import { IChatRoom, IMessage, I_id, ISnapshot, SnapshotType } from 'services/types';
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
  'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIxNTQzMiIsImlzcyI6ImZpcmViYXNlLWFkbWluc2RrLW5qc3k0QGxvb3AtbWVzc2VuZ2VyLWZpcmViYXNlLmlhbS5nc2VydmljZWFjY291bnQuY29tIiwic3ViIjoiZmlyZWJhc2UtYWRtaW5zZGstbmpzeTRAbG9vcC1tZXNzZW5nZXItZmlyZWJhc2UuaWFtLmdzZXJ2aWNlYWNjb3VudC5jb20iLCJhdWQiOiJodHRwczovL2lkZW50aXR5dG9vbGtpdC5nb29nbGVhcGlzLmNvbS9nb29nbGUuaWRlbnRpdHkuaWRlbnRpdHl0b29sa2l0LnYxLklkZW50aXR5VG9vbGtpdCIsImV4cCI6MTY2MTI0MTc5MywiaWF0IjoxNjYxMjM4MTkzfQ.UHqQZht2Lq8IaLnfcShmzHYbPmgAjEyPkAlALXM5ekDf-l2jdAf2P_9Udza0YBZzIkD8ke2X-FceZXfmMBEEHlbluWiti6XotFLd_TkVIuKFT58A06S009NvZlQYNg9rRZiXz-IEA1ihrJbWql3SSE41BHuN1cf6xDQKWTPxASQEaR3NH2l-ZWqm5EUCsX54Lyr3gkke-vfyjaxZFvLtmD3LU0YxcoFGZYk60WlW3FFXtT8JwoTatp-Vw2U3Ovb0yxYFk2QpJV7l_Egv6cJENrOXJqaHQGWmeHLhXDTSfpYpF9VrjTF5yrGOiyBO3vM2Fd77yvS2FHfhtUJ6YFcEuw';

export const ACCESS_TOKEN =
  'OwztA4wa7NkKjKtzFlpWatdRZ2QPzkkywpLbmdW2avWiCbHVp48HBIVgI8_3atwGERR2CHLrE3CthSvInP90xLMWxJGU8yfqJ23udloDqReLtV2MKMcEQlIP9aeerKrJpHhlj9-3M6L8nRbqRxqRW4UkMOcfo4PH4STMFdATYWgoSZ3RGxZTueNQIQMZkECm7JYU5vhkJKS37coExPLMlo4YTJJUTfiiKRP0tiPpbopUNeQtwotLhisUtkhKgd3YF45bHi8zMBo77AN5hk74sdHZAAvZQ4EjGFF4zbIMKB-bYoeqDAyj8D9BNzF-ykSlgvBCMpza8XsRsafAAbELMPt3Nc7Me3-81IA08SYgAFKcj1fpzp8ETP50iUyt3lYK0XqbaRqeEA3eWoK4p7bqmnEIoatMBETrWFGHASqLnmF7XEwUHdR16koMcdeyVp-t9m-SReNFQhO79xLS0wYgcA9qZQxYbgVOGIPOf45n0H2OY5D7_sGJiS-wio-XdlMKVS7bJZt1zL-iO3X2i63_TCJgayF0H5X_1qUPpROj79yccfEtoQ_WbvP2ek9_LYMRSnOP8Lxx9MQMPAdJU4MPr2bnyyhM9-6OSlb0joMyv51NXJkx4HWAIQlgD9hzmA_WQaQqcr9fm6cgvkocYnbH5VQWZ4fZaAaX8nyywqweQt_cwOqYma9vX5p3hScQCJ06SsbCYhQ3hPWGxZRnkrF5Ud_b_-RwUv0vIckJlXC6-zaNHGogcEmfvJ2scVQUYNlJmSoIr3ZWKTke-PN9CPsS6r5dg10Q2sEBRbdXNtbMvB30KSODbon82kdpRfggTPhTwrik9qBhdxS00EBXPvPZgt6LZ-oWE3nUZiLRqN7fnzjYKQaw002Ud-Yf3GQ5sDEZ9p1q-iJ83esTpfp1GVkJSiIYOBypzMSYGuvd0yFnJlZh1EDmUZoInC_CDnb0__YftAjAsMPpvkR2H7woKxMh7-7-vKNMhGogxN30gd-U8AT6-Hf38E69A7-qmtjWskofkBgk4trNbo5eXXUsEn0YouRZzlDdDl6t7G1jPMnP9SBfCES3RKDbDP3DbeWrf2aMhTsGUmhFx0GHhC_-FVt_v-sno2eKmskExxzMkKoIgNS2OJeXjxXamL0rc-FGTTSzDBAy5QmpYAQ9UXGr8P53OM5UiWzlvVwSrrfm_SO-NivytgHwRN7XidhZP7SJMOAApHgZ1CME3oZPiUWzKdpBSdxEPA5r2ClOOG-uMASPFfVguFaGS4APfnMUNR3fwgeHg6trgMpulW0CHUigPN07fij5Ye-hf5EnYxhWodFRgXsf64BybWykGUvUgBfd2I6jTBR-5uXNyFiTpAGBA8MLK4u2efZFA6-mOQPQPSQotm4';

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

const auth = getAuth();

export const handleSignInWithCustomToken = async (accessToken: string) => {
  try {
    const userCredential = await signInWithCustomToken(auth, accessToken);
    console.log(userCredential);
    return userCredential.user;
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error(errorCode, errorMessage);
    return error;
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
      remove(newItemsArray, (item: any) => item[idField] === snapshotData[idField]);
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

export const updateChatRoomMessages = (state: any, { messagesSnapshots, chatId }: any) => {
  const updatedRooms: IChatRoom[] = [...state.rooms];

  // Find room
  const foundRoomIndex = findIndex(state.rooms, (room: any) => room.chatId === chatId);
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
