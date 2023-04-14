import { useChatMessenger } from "contexts/MessengerContext";
import { Dispatch, FC, SetStateAction, useState } from "react";
import { useTranslation } from "react-i18next";

import * as S from "./styles";

import { validateEmail } from "utils/helpers";
import { ButtonsTheme, CHAT_ACTIONS } from "utils/types";
import { colors } from "utils/colors";
import { Close } from "screens/intro/styles";
import { DefaultButton } from "components/Layout";
import { INPUT_TYPES } from "components/Layout/Input/types";

const rows = 3;

const validateFields = (email: string, text: string) => {
  const errors = [];
  const emailError = validateEmail(email);
  if (emailError) {
    errors.push({ name: "email", text: emailError });
  }
  if (!text) {
    errors.push({ name: "description", text: "Required" });
  }
  return errors;
};

interface ISupportFormProps {
  isQuestionSubmit: boolean;
  setIsQuestionSubmit: Dispatch<SetStateAction<boolean>>;
  setIsSupportForm: Dispatch<SetStateAction<boolean>>;
}

export const SupportForm: FC<ISupportFormProps> = ({
  setIsQuestionSubmit,
  isQuestionSubmit,
  setIsSupportForm,
}) => {
  const { t } = useTranslation();
  const { triggerAction } = useChatMessenger();

  const [errors, setErrors] = useState<{ name: string; text: string }[]>([]);
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");

  const emailError = errors.find((e) => e.name === "email")?.text || "";

  const onSubmit = () => {
    const updatedErrors = validateFields(email, description);
    if (!updatedErrors.length) {
      setIsQuestionSubmit(true);
      setEmail("");
      setDescription("");
      triggerAction({ type: CHAT_ACTIONS.QUESTION_RESPONSE });
    } else {
      setErrors(updatedErrors);
    }
  };

  const descriptionError =
    errors.find((e) => e.name === "description")?.text || "";

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
        onClick={() => setIsSupportForm(false)}
        color={colors.doveGray}
        style={{ right: "7px", top: "8px" }}
      />
    </S.Wrapper>
  );
};
