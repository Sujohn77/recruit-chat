import { Action } from 'redux';
import { Saga } from 'redux-saga';
import { ApiResponse } from 'apisauce';
import { call } from 'redux-saga/effects';



export function* handleRefreshToken(saga: Saga, action: Action, isFirst = true): any {
  // Initial saga call
  const response: ApiResponse<any> = yield call(saga, action);

  // Error: try to refresh token and repeat action
//   if (response?.status === 401) {
//     const refreshToken: string = yield select(UserSelectors.selectRefreshToken);

//     const payload: string = yield call(generateGrantType, {
//       grant_type: 'refresh_token',
//       refresh_token: refreshToken,
//     });

//     const tokensResponse: ApiResponse<any> = yield call(apiInstance.refreshToken, payload);

//     // Error on refresh call again
//     if (!refreshToken || !tokensResponse.ok) {
//       yield call(logoutUser);
//     } else {
//       // Parse tokens to FE definitions
//       const parsedTokens = parseResponseWithToken(tokensResponse.data);

//       // Save parsed tokens
//       yield put(userActionCreators.saveTokens(parsedTokens));

//       // Repeat saga
//       yield call(saga, { ...action, isRepeat: true });
//     }
//   }

  // if request was canceled
  if (response?.status === null && isFirst) {
    yield call(handleRefreshToken, saga, action, false);
  }
}

export const withRefreshTokenHandler = (saga: any) => (action: Action) =>
  handleRefreshToken(saga, action);
