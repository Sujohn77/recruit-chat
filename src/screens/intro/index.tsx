import React, { Dispatch, FC, SetStateAction } from 'react';

import * as S from './styles';

import { ICONS } from '../../utils/constants';

import { useChatMessanger } from 'contexts/MessangerContext';
import i18n from 'services/localization';
import { CHAT_ACTIONS } from 'utils/types';

import { useTheme } from 'styled-components';
import { ThemeType } from 'utils/theme/default';

export enum CHAT_OPTIONS {
  FIND_JOB = 'FIND JOB',
  ASK_QUESTION = 'ASK QUESTION',
}

type PropsType = {
  setIsSelectedOption: Dispatch<SetStateAction<boolean>>;
};

interface IOption {
  icon: string;
  message: string;
  type: CHAT_ACTIONS;
  size: string;
}

export const Intro: FC<PropsType> = ({ setIsSelectedOption }) => {
  const { triggerAction } = useChatMessanger();
  const theme = useTheme() as ThemeType;

  const onClick = (option: IOption) => {
    const { message: item, type } = option;
    setIsSelectedOption(true);
    triggerAction({ type, payload: { item, isChatMessage: true } });
  };

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

  const chooseOptions = messages.options.map((opt, index) => (
    <S.Message key={`chat-option-${index}`} onClick={() => onClick(opt)}>
      {opt.icon && <S.Image src={opt.icon} size={opt.size} alt={''} />}
      <S.Text>{opt.message}</S.Text>
    </S.Message>
  ));
  const lookingForJobTxt = i18n.t('messages:initialMessage');
  return (
    <S.Wrapper>
      <S.Flex>
        <S.ImageButton>
          <S.IntroImage
            src={theme?.imageUrl || ICONS.LOGO}
            size="20px"
            alt="rob-face"
          />
        </S.ImageButton>
        <S.InfoContent>
          <S.Question>{lookingForJobTxt}</S.Question>
          <S.Options>{chooseOptions}</S.Options>
        </S.InfoContent>
      </S.Flex>
    </S.Wrapper>
  );
};
