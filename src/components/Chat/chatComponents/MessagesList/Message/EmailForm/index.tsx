import { useChatMessenger } from "contexts/MessengerContext";
import { FC, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { FormControl } from "@mui/material";

import * as S from "./styles";
import { CHAT_ACTIONS } from "utils/types";
import { validateEmail } from "utils/helpers";
import { FormInput } from "components/Chat/ChatComponents/ChatInput/Autocomplete/styles";

export const EmailForm: FC = () => {
  const { t } = useTranslation();
  const { dispatch } = useChatMessenger();

  const [emailError, setEmailError] = useState<string>("");
  const [firstNameError, setFirstNameError] = useState<string>("");
  const [lastNameError, setLastNameError] = useState<string>("");
  const [touched, setTouched] = useState(false);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const onChange = useCallback(
    (type: number) => (e: any) => {
      switch (type) {
        case 1:
          setFirstName(e.target.value);
          setFirstNameError("");
          break;
        case 2:
          setLastName(e.target.value);
          setLastNameError("");
          break;
        case 3:
          setEmail(e.target.value);
          setEmailError("");
          break;
        default:
          break;
      }
    },
    []
  );

  const onClick = (value: string) => {
    const errorText = validateEmail(value);

    if (errorText) {
      setEmailError(errorText);
    } else if (!firstName.trim()) {
      setFirstNameError(t("labels:required"));
    } else if (!lastName.trim()) {
      setLastNameError(t("labels:required"));
    } else {
      const action = {
        type: CHAT_ACTIONS.UPDATE_OR_MERGE_CANDIDATE,
        payload: {
          candidateData: {
            emailAddress: email,
            firstName,
            lastName,
          },
        },
      };
      dispatch(action);
    }
  };

  return (
    <S.Wrapper>
      <S.Title>{t("chat_item_description:enter_email_title")}</S.Title>
      <FormControl>
        <FormInput
          value={firstName}
          onChange={onChange(1)}
          error={!!firstNameError}
          helperText={firstNameError}
          onClick={() => setTouched(!touched)}
          placeholder="First Name"
        />

        <FormInput
          value={lastName}
          onChange={onChange(2)}
          error={!!lastNameError}
          helperText={lastNameError}
          onClick={() => setTouched(!touched)}
          placeholder="Last Name"
        />

        <FormInput
          value={email}
          onChange={onChange(3)}
          error={!!emailError}
          helperText={emailError}
          onClick={() => setTouched(!touched)}
          placeholder="Email"
        />
      </FormControl>

      <S.FormButton onClick={() => onClick(email)}>
        {t("buttons:send")}
      </S.FormButton>
    </S.Wrapper>
  );
};
