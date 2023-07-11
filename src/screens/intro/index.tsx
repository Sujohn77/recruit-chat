import { useAuthContext } from "contexts/AuthContext";
import { Dispatch, FC, SetStateAction, useState } from "react";
import { useTranslation } from "react-i18next";

import * as S from "./styles";
import { DefaultMessages, SupportForm } from "components";
import { ButtonsTheme } from "utils/types";
import { DefaultButton } from "components/Layout";

export enum CHAT_OPTIONS {
  FIND_JOB = "FIND JOB",
  ASK_QUESTION = "ASK QUESTION",
}

interface IIntroScreenProps {
  setIsSelectedOption: Dispatch<SetStateAction<boolean>>;
  isSelectedOption: boolean | boolean | null;
}

export const Intro: FC<IIntroScreenProps> = ({
  setIsSelectedOption,
  isSelectedOption,
}) => {
  const { t } = useTranslation();
  const { isVerified } = useAuthContext();

  const [isEmailForm, setIsEmailForm] = useState(false);
  const [isNeedSupport, setIsNeedSupport] = useState(false);
  const [isQuestionSubmit, setIsQuestionSubmit] = useState(false);

  const handleSupportClick = () => {
    setIsNeedSupport(true);
  };

  return (
    <S.Wrapper isClosed={!!isSelectedOption}>
      <DefaultMessages
        text={t("messages:initialMessage")}
        isOptions={!isQuestionSubmit}
        setIsSelectedOption={setIsSelectedOption}
      />

      {!isNeedSupport && isEmailForm && !isVerified && (
        <DefaultButton
          variant="outlined"
          value="Support"
          style={S.ButtonStyles}
          theme={ButtonsTheme.Purple}
          onClick={handleSupportClick}
        />
      )}

      {isNeedSupport && !isVerified && (
        <SupportForm
          isQuestionSubmit={isQuestionSubmit}
          setIsQuestionSubmit={setIsQuestionSubmit}
          setIsSupportForm={setIsNeedSupport}
        />
      )}

      {isQuestionSubmit && (
        <DefaultMessages
          text={t("messages:wantContinue")}
          setIsSelectedOption={setIsSelectedOption}
        />
      )}
    </S.Wrapper>
  );
};
