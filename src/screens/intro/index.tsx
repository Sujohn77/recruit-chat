import React, { Dispatch, FC, SetStateAction } from 'react';

import * as S from './styles';

// import { Images } from "../../utils/constants";
import SEARCH_ICON from '../../assets/imgs/search.png';
import QUESTION from '../../assets/imgs/question.png';
import ROB_FACE from '../../assets/imgs/rob-face.png';
import { useChatMessanger } from 'contexts/MessangerContext';
import i18n from 'services/localization';
import { CHAT_ACTIONS, USER_INPUTS } from 'utils/types';

export enum CHAT_OPTIONS {
  FIND_JOB = 'FIND JOB',
  ASK_QUESTION = 'ASK QUESTION',
}
export const Images = {
  SEARCH_ICON,
  QUESTION,
  ROB_FACE,
};

type PropsType = {
  setIsSelectedOption: Dispatch<SetStateAction<boolean>>;
};

interface IOption {
  icon: string;
  message: string;
  type: CHAT_ACTIONS;
  size: string;
  text: string;
}

export const Intro: FC<PropsType> = ({ setIsSelectedOption }) => {
  const { triggerAction } = useChatMessanger();

  const onClick = (option: IOption) => {
    const { text: item, type } = option;
    setIsSelectedOption(true);
    triggerAction({ type, payload: { item } });
  };

  const messages = {
    options: [
      {
        icon: Images.SEARCH_ICON,
        message: i18n.t('buttons:find_job'),
        type: CHAT_ACTIONS.FIND_JOB,
        size: '20px',
        text: 'Find a job',
      },
      {
        icon: Images.QUESTION,
        message: i18n.t('buttons:ask_question'),
        type: CHAT_ACTIONS.ASK_QUESTION,
        size: '16px',
        text: 'Ask a question',
      },
    ],
  };

  const chooseOptions = messages.options.map((opt, index) => (
    <S.Message key={`chat-option-${index}`} onClick={() => onClick(opt)}>
      {opt.icon && <S.Image src={opt.icon} size={opt.size} alt={''} />}
      <S.Text>{opt.message}</S.Text>
    </S.Message>
  ));
  const lookingForJobTxt = i18n.t('chat_item_description:lookingFor');
  return (
    <S.Wrapper>
      <S.Flex>
        <S.ImageButton>
          <S.IntroImage src={Images.ROB_FACE} size="57px" alt="rob-face" />
        </S.ImageButton>
        <S.InfoContent>
          <S.Question>{lookingForJobTxt}</S.Question>
          <S.Options>{chooseOptions}</S.Options>
        </S.InfoContent>
      </S.Flex>
      <S.Close height="12px" />
    </S.Wrapper>
  );
};
