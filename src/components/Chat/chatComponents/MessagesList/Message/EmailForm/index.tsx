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
  const { triggerAction } = useChatMessenger();

  const [error, setError] = useState<string>("");
  const [touched, setTouched] = useState(false);
  const [value, setValue] = useState("");

  const onChange = (e: any) => {
    setError("");
    setValue(e.target.value);
  };

  const onClick = (value: string) => {
    const error = validateEmail(value);

    if (error) {
      error && setError(error);
    } else {
      triggerAction({
        type: CHAT_ACTIONS.SEND_TRANSCRIPT_EMAIL,
        payload: { item: value },
      });
    }
  };

  return (
    <Wrapper>
      <Title>{t("chat_item_description:enter_email_title")}</Title>
      <FormControl>
        <FormInput
          value={value}
          onChange={onChange}
          error={!!error}
          helperText={error}
          onClick={() => setTouched(!touched)}
          placeholder="Email"
        />
      </FormControl>

      <FormButton onClick={() => onClick(value)}>
        {t("buttons:send")}
      </FormButton>
    </Wrapper>
  );
};
