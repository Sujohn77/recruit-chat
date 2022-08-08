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

const getInitialMessage = (option: CHAT_OPTIONS) => {
  return option === CHAT_OPTIONS.FIND_JOB
    ? USER_INPUTS.FIND_JOB
    : USER_INPUTS.ASK_QUESTION;
};

export const Intro: FC<PropsType> = ({ setIsSelectedOption }) => {
  const { addMessage } = useChatMessanger();

  const onClick = (option: CHAT_OPTIONS) => {
    setIsSelectedOption(true);
    // addMessage({
    //   text: getInitialMessage(option),
    // });
  };

  const messages = {
    options: [
      {
        icon: Images.SEARCH_ICON,
        message: i18n.t('buttons:find_job'),
        option: CHAT_OPTIONS.FIND_JOB,
        size: '20px',
      },
      {
        icon: Images.QUESTION,
        message: i18n.t('buttons:ask_question'),
        option: CHAT_OPTIONS.ASK_QUESTION,
        size: '16px',
      },
    ],
  };

  const chooseOptions = messages.options.map((opt, index) => (
    <S.Message key={`chat-option-${index}`} onClick={() => onClick(opt.option)}>
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
