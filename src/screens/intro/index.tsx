import React, { Dispatch, FC, SetStateAction, useState } from 'react';

import * as S from './styles';

import { ICONS } from '../../utils/constants';

import { useChatMessanger } from 'contexts/MessangerContext';
import i18n from 'services/localization';
import { CHAT_ACTIONS } from 'utils/types';

import { useTheme } from 'styled-components';
import { ThemeType } from 'utils/theme/default';
import { EmailForm } from 'components/Intro/EmailLogin/Email';
import { TrialPassword } from 'components/Intro/TrialPassword';
import { DefaultButton } from 'components/Layout/Buttons';
import { ButtonsTheme } from 'components/Layout/Buttons/types';
import { SupportForm } from 'components/Intro/SupportForm';

export enum CHAT_OPTIONS {
  FIND_JOB = 'FIND JOB',
  ASK_QUESTION = 'ASK QUESTION',
}

type PropsType = {
  setIsSelectedOption: Dispatch<SetStateAction<boolean>>;
  isSelectedOption: boolean | boolean | null;
};

interface IOption {
  icon: string;
  message: string;
  type: CHAT_ACTIONS;
  size: string;
}

export const Intro: FC<PropsType> = ({
  setIsSelectedOption,
  isSelectedOption,
}) => {
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(false);
  const [isNeedSupport, setIsNeedSupport] = useState(false);
  const { triggerAction } = useChatMessanger();
  const theme = useTheme() as ThemeType;

  const onClick = (option: IOption) => {
    const { message: item, type } = option;
    setIsSelectedOption(true);
    // if (window.parent) {
    //   window.parent.postMessage({ height: '601px' }, '*');
    // }

    triggerAction({ type, payload: { item, isChatMessage: true } });
  };

  const onLoad = () => {
    setTimeout(() => {
      setIsFirstLoad(true);
    }, 500);
  };

  const handleSupportClick = () => {
    setIsNeedSupport(true);
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
  const isEmailForm = isFirstLoad && !isNeedSupport;
  const isOtpMessages = isOtpSent && !isNeedSupport;

  return (
    <S.Wrapper isClosed={!!isSelectedOption}>
      <S.ButtonsWrapper onLoad={onLoad}>
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
      </S.ButtonsWrapper>

      {isEmailForm && (
        <EmailForm setIsOtpSent={setIsOtpSent} isOtpSent={isOtpSent} />
      )}

      {isOtpMessages && <TrialPassword />}

      {!isNeedSupport && isFirstLoad && (
        <DefaultButton
          variant="outlined"
          value="Support"
          style={{
            width: '250px',
            margin: '0 auto 16px',
            display: 'block',
            animation: 'fadeHeight 0.6s ease-in',
          }}
          theme={ButtonsTheme.Purple}
          onClick={handleSupportClick}
        />
      )}

      {isNeedSupport && <SupportForm />}
    </S.Wrapper>
  );
};
