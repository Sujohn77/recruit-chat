import { useAuthContext } from "contexts/AuthContext";
import { useChatMessenger } from "contexts/MessengerContext";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { useTheme } from "styled-components";
import map from "lodash/map";

import { ICONS } from "assets";
import { LocalStorage } from "utils/constants";
import { ThemeType } from "utils/theme/default";
import { messages } from "./data";
import { IOption } from "./types";
import * as S from "./styles";

interface IDefaultMessagesProps {
  text: string;
  setIsEmailForm: Dispatch<SetStateAction<boolean>>;
  setIsSelectedOption: Dispatch<SetStateAction<boolean>>;
  isOptions?: boolean;
}

export const DefaultMessages: FC<IDefaultMessagesProps> = ({
  text,
  setIsEmailForm,
  setIsSelectedOption,
  isOptions = true,
}) => {
  const theme = useTheme() as ThemeType;
  const { isVerified } = useAuthContext();
  const { triggerAction } = useChatMessenger();

  const [initialOption, setInitialOption] = useState<IOption | null>(null);

  useEffect(() => {
    if (isVerified && initialOption) {
      const { message: item, type } = initialOption;
      triggerAction({ type, payload: { item, isChatMessage: true } });

      setInitialOption(null);
    }
  }, [isVerified, triggerAction, initialOption]);

  const onClick = (option: IOption) => {
    const { message: item, type } = option;

    setIsSelectedOption(true);
    triggerAction({ type, payload: { item, isChatMessage: true } });
    localStorage.setItem(LocalStorage.InitChatActionType, JSON.stringify(type));

    // if (subscriberID) {
    //     setIsSelectedOption(true);
    //     triggerAction({ type, payload: { item, isChatMessage: true } });
    //     localStorage.setItem(LocalStorage.InitChatActionType, JSON.stringify(type));
    // } else {
    //     setInitialOption(option);
    // }

    // setIsEmailForm(!subscriberID);
  };

  const chooseOptions = map(messages.options, (opt, index) => (
    <S.Message key={`chat-option-${index}`} onClick={() => onClick(opt)}>
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
