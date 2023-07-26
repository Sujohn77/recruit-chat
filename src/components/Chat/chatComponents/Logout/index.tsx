import { Dispatch, FC, SetStateAction, useCallback } from "react";

import { PopUp } from "..";
import * as S from "./styles";
import { DarkButton } from "components/Layout/styles";
import { useChatMessenger } from "contexts/MessengerContext";
import { EventIds } from "utils/constants";
import { postMessToParent } from "utils/helpers";

interface ILogoutProps {
  showLogoutScreen: boolean;
  setShowConfirmLogout: Dispatch<SetStateAction<boolean>>;
  setIsSelectedOption: Dispatch<SetStateAction<boolean>>;
}

export const Logout: FC<ILogoutProps> = ({
  showLogoutScreen,
  setShowConfirmLogout,
  setIsSelectedOption,
}) => {
  const { logout } = useChatMessenger();

  const onLogout = useCallback(() => {
    postMessToParent(EventIds.RefreshToken);

    logout();
    setShowConfirmLogout(false);
    setIsSelectedOption(false);
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
