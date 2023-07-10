import { useAuthContext } from "contexts/AuthContext";
import { useChatMessenger } from "contexts/MessengerContext";
import { FC, useEffect, useState } from "react";
import { useTheme } from "styled-components";
import map from "lodash/map";

import * as S from "./styles";
import { messages } from "./data";
import { IOption } from "./types";
import { ICONS } from "assets";
import { LocalStorage } from "utils/constants";
import { ThemeType } from "utils/theme/default";
import { ChatScreens, useAppStore } from "store/app.store";
import { CHAT_ACTIONS } from "utils/types";

interface IDefaultMessagesProps {
  text: string;
  isOptions?: boolean;
}

export const DefaultMessages: FC<IDefaultMessagesProps> = ({
  text,
  isOptions = true,
}) => {
  const theme = useTheme() as ThemeType;
  const { isVerified } = useAuthContext();
  const { dispatch } = useChatMessenger();
  const { setChatScreen } = useAppStore();

  const [initialOption, setInitialOption] = useState<IOption | null>(null);

  useEffect(() => {
    if (isVerified && initialOption) {
      const { message: item, type } = initialOption;
      dispatch({ type, payload: { item, isChatMessage: true } });

      setInitialOption(null);
    }
  }, [isVerified, dispatch, initialOption]);

  const onSelectOption = (option: IOption) => {
    const { message: item, type } = option;

    setChatScreen(
      ChatScreens[type === CHAT_ACTIONS.FIND_JOB ? "FindAJob" : "QnA"]
    );
    dispatch({ type, payload: { item, isChatMessage: true } });
    localStorage.setItem(LocalStorage.InitChatActionType, JSON.stringify(type));
  };

  const chooseOptions = map(messages.options, (opt, index) => (
    <S.Message key={`chat-option-${index}`} onClick={() => onSelectOption(opt)}>
      {opt.icon && <S.Image src={opt.icon} size={opt.size} alt={""} />}
      <S.Text>{opt.message}</S.Text>
    </S.Message>
  ));

  return (
    <S.Wrapper>
      <S.IntroImage
        src={theme?.imageUrl || ICONS.LOGO}
        size="34px"
        alt="rob-face"
        isRounded
      />

      <S.InfoContent>
        <S.Question>{text}</S.Question>
        {isOptions && <S.Options>{chooseOptions}</S.Options>}
      </S.InfoContent>
    </S.Wrapper>
  );
};
