import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInWithCustomToken } from "firebase/auth";
import sortBy from "lodash/sortBy";
import remove from "lodash/remove";
import findIndex from "lodash/findIndex";

import {
  IChatRoom,
  IMessage,
  I_id,
  ISnapshot,
  SnapshotType,
} from "services/types";

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
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIxNTQzMiIsImlzcyI6ImZpcmViYXNlLWFkbWluc2RrLW5qc3k0QGxvb3AtbWVzc2VuZ2VyLWZpcmViYXNlLmlhbS5nc2VydmljZWFjY291bnQuY29tIiwic3ViIjoiZmlyZWJhc2UtYWRtaW5zZGstbmpzeTRAbG9vcC1tZXNzZW5nZXItZmlyZWJhc2UuaWFtLmdzZXJ2aWNlYWNjb3VudC5jb20iLCJhdWQiOiJodHRwczovL2lkZW50aXR5dG9vbGtpdC5nb29nbGVhcGlzLmNvbS9nb29nbGUuaWRlbnRpdHkuaWRlbnRpdHl0b29sa2l0LnYxLklkZW50aXR5VG9vbGtpdCIsImV4cCI6MTY2MTI3MDM2OSwiaWF0IjoxNjYxMjY2NzY5fQ.LLXKF8me9p7VycOXnkUFxc46tIOnCISCdOS2ltjAmWZytMxPLeRYfHvWzlUQWTtWk53-aGNIiegPSEOeOxXGrZt56hOdDUM7jCCnJ4ru7ESh9CfTEHWYwFeIFfiKEeK-kz_6Ryd4OJkaNrZTO2oB4d_HSidO1ajBFx9KMevfPs9b5nY5tyDfU2yWriyvjxfmzwfThVVt-IPYW-RAPc1kiIM5UiE233ZbMwBi9bms5ZX3Bp7vgFfHgVKQAk50DZts-QcvZ42VZPWQiP0usZ6LCBjViLIqnz9UQQPxLsnggjdARdBliYW_u0nDRj1fDcZ3liTt75ONuBGvsQgXbBS8oQ";

export const ACCESS_TOKEN =
  "1aZyv4kZuxJjQXklPoAG74oWqvU4WIdhtLtaUm6fSFRY7QVmCuKx1Yf78g6PtuWHWA--lNJJuxbjQV6ODS5ZHQvFFvOEmWKGyyxf-2idPfGzttrT2anmFIAkIcEpozevhpX-BQIC39203bWZpfRZSMV8DkCe11omB1uY44hHXXucq78rp7ccoa4GLWrDC792u8n7bjlWwh3tMpym3CgCp7dSaw-DdvRgFZ4UQdAcsG_Je6z-y6w7lapbLgMSR70GMmJ_OBG9CbnPeGbWbdpV3y94oavnN9fx38ELrueYlgeM_JRlEgXgBRFNZPYFWhBmvgYXXqKAYigRUjWLR0WEjU6ZHOihBpjX9ZPZ45yu0lNaDt4oO4nHocZ-wpUCPAiX9bsHZIblW3p9ngnuo2E31t7VUmK4i-7KhKzB_VVkhy2UHIOoaWwgsEAubEv3k_Llj4WixTtTI97pC7dj4b0cZ-JSYsBgUfpRLwkLV4579gTWbEyPw5CaoUYLgpfeKlGSTHKNXbZa9DphL7CYW8aCIKgkFHDJYPHNLBR14rx1R5iEMC6UPQMexvkglTMJDfVpEVKmwy0Ebt5cJy2OKoDI3rzz05bwSrZE_FC1BuhaxBylDRWShxESgtgcMyarhNYDMtbtMxWF3w9ZkWFqs9o-St1tH5luxAMl1Cd0ZzW_f1hNkdUQaZJOvXGvsYVcrxO1OYQyxMNmge72S6iPkUf3othfXUNAAYbfzClXsiwGquJt1tb8uJ5jac6wMIivbfz7aieoK1n7vk2AOJ9UaHeyRiU0Xn7rI1f8Fw7Z_x_qhQStrUUhwm8ya288YTfPS0j-HRbL7oepfxeLNZ8p5EMFUWp8QZcjvNk-jS9s2QjbkoaV4OneDVTpdVBe8_PHY-LxekCNPclaXX0lTiLR27qG3IPpwaFKQYX_bL2GH2Mwczqw9-hSAQ7ceuz4VklO8CEEI_kxlQ5_SLq97D9MQW7K-9bPM7rb-enbRSF1Nlq8DrtDSvGYOrtWDAPHqMs3NSrQe-1WshIVUsZmxw-ypZVcNGwlYETDWkGaMDE8rzQpdI69xtAaH2Hg9ec14cG4Bo_dvpL4xV7Vpul66FCPDvqTUOD_pOi-3RiOTNFcr1k-_5GbOuzyhcha4-Hj6d5NWRlE45T24HgNRj1XGb17IfW1sgeJMsr0Rp5fRCbf8xWgLMQWzgtZ_Orch1fGYxU6LTWbkPZ5amrh9vvpfI2Zu4LyqypuRvJs7REqXES3L09-tZb0NQqQTz_9YWhtKiKHh4ns4OCfY486V-NXXZxkda2PZ1np3_a2oO8-JfvwcPyn6q3_OEBKtaViRZ_5h6648Dq2kXc2TU3wXkG9r-X5nVgx7A";

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

const auth = getAuth();

export const handleSignInWithCustomToken = async (accessToken: string) => {
  try {
    const userCredential = await signInWithCustomToken(auth, accessToken);
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
