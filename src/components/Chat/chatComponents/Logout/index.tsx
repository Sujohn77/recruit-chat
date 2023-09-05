import { Dispatch, FC, SetStateAction, useCallback } from "react";

import { PopUp } from "..";
import * as S from "./styles";
import { DarkButton } from "components/Layout/styles";
import { useChatMessenger } from "contexts/MessengerContext";
import { EventIds } from "utils/constants";
import { postMessToParent } from "utils/helpers";
import { ChatScreens, useAppStore } from "store/app.store";

interface ILogoutProps {
  showLogoutScreen: boolean;
  setShowConfirmLogout: Dispatch<SetStateAction<boolean>>;
}

export const Logout: FC<ILogoutProps> = ({
  showLogoutScreen,
  setShowConfirmLogout,
}) => {
  const { logout } = useChatMessenger();
  const { setChatScreen } = useAppStore();

  const onLogout = useCallback(() => {
    postMessToParent(EventIds.RefreshToken);

    logout();
    setShowConfirmLogout(false);
    setChatScreen(ChatScreens.Default);
  }, []);

  return showLogoutScreen ? (
    <PopUp>
      <S.Wrapper>
        <S.Text>Do you really want to finish the session?</S.Text>

        <S.ButtonsWrapper>
          <DarkButton onClick={onLogout}>Yes</DarkButton>
          <DarkButton onClick={() => setShowConfirmLogout(false)}>
            Cancel
          </DarkButton>
        </S.ButtonsWrapper>
      </S.Wrapper>
    </PopUp>
  ) : null;
};
