import { useAuthContext } from 'contexts/AuthContext';
import { useChatMessenger } from 'contexts/MessangerContext';
import React, { Dispatch, FC, SetStateAction } from 'react';
import i18n from 'services/localization';
import { useTheme } from 'styled-components';
import { ICONS } from 'utils/constants';
import { ThemeType } from 'utils/theme/default';
import { CHAT_ACTIONS } from 'utils/types';
import * as S from './styles';
import { IOption } from './types';

const messages = {
  options: [
    {
      icon: ICONS.SEARCH_ICON,
      message: i18n.t('buttons:find_job'),
      type: CHAT_ACTIONS.FIND_JOB,
      size: '16px',
    },
    {
      icon: ICONS.QUESTION,
      message: i18n.t('buttons:ask_questions'),
      type: CHAT_ACTIONS.ASK_QUESTION,
      size: '16px',
    },
  ],
};

type PropsType = {
  handleOptionsClick: () => void;
  text: string;
  isOptions?: boolean;
  setIsSelectedOption: Dispatch<SetStateAction<boolean>>;
};

export const DefaultMessages: FC<PropsType> = ({
  handleOptionsClick,
  text,
  isOptions = true,
  setIsSelectedOption,
}) => {
  const theme = useTheme() as ThemeType;
  const { subscriberID } = useAuthContext();
  const { triggerAction } = useChatMessenger();

  const onClick = (option: IOption) => {
    const { message: item, type } = option;
    if (subscriberID) {
      setIsSelectedOption(true);
      triggerAction({ type, payload: { item, isChatMessage: true } });
    } else {
      handleOptionsClick();
    }
  };

  const chooseOptions = messages.options.map((opt, index) => (
    <S.Message key={`chat-option-${index}`} onClick={() => onClick(opt)}>
      {opt.icon && <S.Image src={opt.icon} size={opt.size} alt={''} />}
      <S.Text>{opt.message}</S.Text>
    </S.Message>
  ));

  return (
    <S.Wrapper>
      <S.ImageButton>
        <S.IntroImage
          src={theme?.imageUrl || ICONS.LOGO}
          size="20px"
          alt="rob-face"
        />
      </S.ImageButton>
      <S.InfoContent>
        <S.Question>{text}</S.Question>
        {isOptions && <S.Options>{chooseOptions}</S.Options>}
      </S.InfoContent>
    </S.Wrapper>
  );
};
