import { useChatMessenger } from "contexts/MessengerContext";
import { Dispatch, FC, SetStateAction, useState } from "react";
import { useTranslation } from "react-i18next";
import find from "lodash/find";

import * as S from "./styles";
import { COLORS } from "utils/colors";
import { INPUT_TYPES } from "utils/constants";
import { validateFields } from "utils/helpers";
import { ButtonsTheme, CHAT_ACTIONS } from "utils/types";
import { DefaultButton } from "components/Layout";
import { Close } from "screens/Intro/styles";

interface ISupportFormProps {
  isQuestionSubmit: boolean;
  setIsQuestionSubmit: Dispatch<SetStateAction<boolean>>;
  setIsSupportForm: Dispatch<SetStateAction<boolean>>;
}

const rows = 3;

export const SupportForm: FC<ISupportFormProps> = ({
  setIsQuestionSubmit,
  isQuestionSubmit,
  setIsSupportForm,
}) => {
  const { t } = useTranslation();
  const { dispatch } = useChatMessenger();

  const [errors, setErrors] = useState<{ name: string; text: string }[]>([]);
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");

  const emailError = find(errors, (e) => e.name === "email")?.text || "";

  const onSubmit = () => {
    const updatedErrors = validateFields(email, description);
    if (!updatedErrors.length) {
      setIsQuestionSubmit(true);
      setEmail("");
      setDescription("");
      dispatch({ type: CHAT_ACTIONS.QUESTION_RESPONSE });
    } else {
      setErrors(updatedErrors);
    }
  };

  const onChangeEmail = (e: any) => {
    setEmail(e.target.value);
    if (errors.length) {
      const updatedErrors = validateFields(e.target.value, description);
      setErrors(updatedErrors);
    }
  };

  const onChangeDescription = (e: any) => {
    setDescription(e.target.value);
    if (errors.length) {
      const updatedErrors = validateFields(email, e.target.value);
      setErrors(updatedErrors);
    }
  };

  const onClose = () => setIsSupportForm(false);

  const descriptionError =
    find(errors, (e) => e.name === "description")?.text || "";

  // TODO: add translation

  return (
    <S.Wrapper>
      <S.Title>Support</S.Title>
      <S.Description>How we can help you?</S.Description>
      <S.QuestionInput
        type={INPUT_TYPES.TEXT}
        value={email}
        onChange={onChangeEmail}
        placeholder={"Email"}
        error={!!emailError}
        helperText={emailError}
      />
      <S.QuestionInput
        multiline={true}
        minRows={rows}
        value={description}
        onChange={onChangeDescription}
        placeholder={"I have a question..."}
        error={!!descriptionError}
        helperText={descriptionError}
      />

      {!isQuestionSubmit ? (
        <DefaultButton
          onClick={onSubmit}
          theme={ButtonsTheme.Purple}
          value={t("buttons:send")}
        />
      ) : (
        <S.SuccessText>
          We will send you an email with a response!
        </S.SuccessText>
      )}

      <Close
        height="12px"
        onClick={onClose}
        color={COLORS.DOVE_GRAY}
        style={S.CloseBtnStyle}
      />
    </S.Wrapper>
  );
};
