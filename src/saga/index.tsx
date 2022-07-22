import { call, all, takeEvery, takeLatest } from "redux-saga/effects";
import { FIREBASE_TOKEN } from "firebase/config";
import { handleSignInWithCustomToken } from "./handlers";
import { chatsActionTypes } from "redux/actions";
import { SendMessageAction, UpdateChatRoomMessagesAction } from "./types";
import { withRefreshTokenHandler } from "./refreshToken";
import { sendMessage, updateMessages } from "./chat";

function* setUserDataAfterVerify() {
  yield call(handleSignInWithCustomToken, FIREBASE_TOKEN);
}

export function* watchInit() {
  yield takeEvery<{ type: chatsActionTypes.INIT_CHAT }>(
    chatsActionTypes.INIT_CHAT,
    setUserDataAfterVerify
  );
}

export function* rootSaga() {
  yield all([
    watchInit(),
    takeLatest<SendMessageAction>(
      chatsActionTypes.SEND_MESSAGE,
      withRefreshTokenHandler(sendMessage)
    ),
    takeLatest<UpdateChatRoomMessagesAction>(
      chatsActionTypes.UPDATE_CHAT_ROOM_MESSAGES,
      withRefreshTokenHandler(updateMessages)
    ),
  ]);
}
