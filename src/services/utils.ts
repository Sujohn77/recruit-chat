
export const handleRefreshToken = async (action: () => any, isFirst = true) => {
    const response = await action();
  
    // Error: try to refresh token and repeat action
    // if (response?.status === HTTP_STATUSES.UNAUTHORIZED_401) {
    //   const refreshToken: string = yield select(UserSelectors.selectRefreshToken);
  
    //   const payload: string = yield call(generateGrantType, {
    //     grant_type: 'refresh_token',
    //     refresh_token: refreshToken,
    //   });
  
    //   const tokensResponse: ApiResponse<any> = yield call(apiInstance.refreshToken, payload);
  
    //   // Error on refresh call again
    //   if (!refreshToken) {
    //     yield call(logoutUser, { isGlobal: true, type: userActionTypes.LOGOUT_USER });
    //   } else {
    //     // Parse tokens to FE definitions
    //     const parsedTokens = parseResponseWithToken(tokensResponse.data);
  
    //     // Save parsed tokens
    //     yield put(userActionCreators.saveTokens(parsedTokens));
  
    //     // Repeat saga
    //     yield call(saga, { ...action, isRepeat: true });
    //   }
    // }
  
    // if request was canceled
    if (response?.status === null && isFirst) {
        handleRefreshToken(action, false)
    }
  }