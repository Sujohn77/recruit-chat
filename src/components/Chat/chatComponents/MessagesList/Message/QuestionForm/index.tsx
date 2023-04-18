import { useChatMessenger } from "contexts/MessengerContext";
import { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import find from "lodash/find";

import * as S from "./styles";
import { CHAT_ACTIONS } from "utils/types";
import { INPUT_TYPES } from "utils/constants";
import { validateFields } from "utils/helpers";

const rows = 3;

export const QuestionForm: FC = () => {
  const { t } = useTranslation();
  const { triggerAction } = useChatMessenger();

  const [errors, setErrors] = useState<{ name: string; text: string }[]>([]);
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");

  const onSubmit = () => {
    const updatedErrors = validateFields(email, description);
    if (!updatedErrors.length) {
      triggerAction({ type: CHAT_ACTIONS.QUESTION_RESPONSE });
    } else {
      setErrors(updatedErrors);
    }
  };

  const emailError = find(errors, (e) => e.name === "email")?.text || "";

  const descriptionError =
    find(errors, (e) => e.name === "description")?.text || "";

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
      <S.Content>
        <S.Title>Question form</S.Title>
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
          placeholder={"Text"}
          error={!!descriptionError}
          helperText={descriptionError}
        />
        <S.SubmitButton onClick={onSubmit}>{t("buttons:send")}</S.SubmitButton>
      </S.Content>
    </S.Wrapper>
  );
};
