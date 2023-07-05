import { useChatMessenger } from "contexts/MessengerContext";
import { FC, useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { Button, FormControl } from "@mui/material";

import { FormInput } from "components/Layout/Autocomplete/styles";
import { validateEmail } from "utils/helpers";
import { CHAT_ACTIONS } from "utils/types";

export const Wrapper = styled.div`
  background: ${({ theme: { message } }) => message.backgroundColor};
  border-radius: 10px;
  padding: 16px 18px;
  width: 249px;
  display: flex;
  flex-flow: column;
  gap: 20px;
  box-sizing: border-box;
  margin-bottom: 24px;
`;

export const Title = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 17px;
  color: ${({ theme: { message } }) => message.transcriptForm.color};
  text-align: center;
  font-weight: 500;
`;

export const FormButton = styled(Button)`
  background: ${(props) => props.theme.primaryColor}!important;
  border-radius: 100px !important;
  font-weight: 500 !important;
  color: ${({ theme: { button } }) => button.secondaryColor}!important;
  font-size: 14px !important;
  line-height: 17px !important;
  height: 40px;
  text-transform: initial !important;
`;

type PropsType = {};

export const EmailForm: FC<PropsType> = () => {
  const { t } = useTranslation();
  const { dispatch } = useChatMessenger();

  const [emailError, setEmailError] = useState<string>("");
  const [firstNameError, setFirstNameError] = useState<string>("");
  const [lastNameError, setLastNameError] = useState<string>("");
  const [touched, setTouched] = useState(false);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const onChange = (type: number) => (e: any) => {
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
  };

  const onClick = (value: string) => {
    const errorText = validateEmail(value);

    if (errorText) {
      setEmailError(errorText);
    } else if (!firstName.trim()) {
      setFirstNameError(t("labels:required"));
    } else if (!lastName.trim()) {
      setLastNameError(t("labels:required"));
    } else {
      dispatch({
        type: CHAT_ACTIONS.UPDATE_OR_MERGE_CANDIDATE,
        payload: {
          candidateData: {
            emailAddress: email,
            firstName,
            lastName,
          },
        },
      });
    }
  };

  return (
    <Wrapper>
      <Title>{t("chat_item_description:enter_email_title")}</Title>
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

      <FormButton onClick={() => onClick(email)}>
        {t("buttons:send")}
      </FormButton>
    </Wrapper>
  );
};
