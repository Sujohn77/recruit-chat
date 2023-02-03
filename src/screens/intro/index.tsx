import React, { Dispatch, FC, SetStateAction, useState } from 'react';

import * as S from './styles';

import { ICONS } from '../../utils/constants';

import { useChatMessenger } from 'contexts/MessangerContext';
import i18n from 'services/localization';
import { CHAT_ACTIONS } from 'utils/types';

import { useTheme } from 'styled-components';
import { ThemeType } from 'utils/theme/default';
import { EmailForm } from 'components/Intro/EmailLogin/Email';
import { TrialPassword } from 'components/Intro/TrialPassword';
import { DefaultButton } from 'components/Layout/Buttons';
import { ButtonsTheme } from 'components/Layout/Buttons/types';
import { SupportForm } from 'components/Intro/SupportForm';
import { DefaultMessages } from 'components/Intro/DefautMessages';
import { useAuthContext } from 'contexts/AuthContext';

export enum CHAT_OPTIONS {
  FIND_JOB = 'FIND JOB',
  ASK_QUESTION = 'ASK QUESTION',
}

type PropsType = {
  setIsSelectedOption: Dispatch<SetStateAction<boolean>>;
  isSelectedOption: boolean | boolean | null;
};

export const Intro: FC<PropsType> = ({
  setIsSelectedOption,
  isSelectedOption,
}) => {
  const { accessToken } = useChatMessenger();
  const { isOTPpSent } = useAuthContext();
  const [isEmailForm, setIsEmailForm] = useState(false);
  const [isNeedSupport, setIsNeedSupport] = useState(false);
  const [isQuestionSubmit, setIsQuestionSubmit] = useState(false);

  const handleSupportClick = () => {
    setIsNeedSupport(true);
  };

  const lookingForJobTxt = i18n.t('messages:initialMessage');
  const continueTxt = i18n.t('messages:wantContinue');

  const isOtpMessages = isOTPpSent && !isNeedSupport;

  return (
    <S.Wrapper isClosed={!!isSelectedOption && !!accessToken}>
      <DefaultMessages
        setIsEmailForm={setIsEmailForm}
        text={lookingForJobTxt}
        isOptions={!isQuestionSubmit}
        setIsSelectedOption={setIsSelectedOption}
      />

      {!isOtpMessages && <EmailForm setIsEmailForm={setIsEmailForm} />}

      {isOtpMessages && <TrialPassword />}

      {!isNeedSupport && isEmailForm && (
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

      {isNeedSupport && (
        <SupportForm
          isQuestionSubmit={isQuestionSubmit}
          setIsQuestionSubmit={setIsQuestionSubmit}
          setIsSupportForm={setIsNeedSupport}
        />
      )}

      {isQuestionSubmit && (
        <DefaultMessages
          setIsEmailForm={setIsEmailForm}
          text={continueTxt}
          setIsSelectedOption={setIsSelectedOption}
        />
      )}
    </S.Wrapper>
  );
};
