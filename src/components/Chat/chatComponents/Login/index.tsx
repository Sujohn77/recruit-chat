import { useChatMessenger } from "contexts/MessengerContext";
import { FC, useCallback, useEffect, useState } from "react";

import * as S from "./styles";
import { validateEmail } from "utils/helpers";
import { CHAT_ACTIONS } from "utils/types";
import { useTranslation } from "react-i18next";
import { FormControl } from "@mui/material";
import { FormInput } from "components/Layout/Autocomplete/styles";
import { FormButton } from "../MessagesList/Message/EmailForm";
import { colors } from "utils/colors";

interface ILoginProps {
  showLoginScreen: boolean;
  setShowLoginScreen: (show: boolean) => void;
}

export const Login: FC<ILoginProps> = ({
  showLoginScreen,
  setShowLoginScreen,
}) => {
  const { isAnonym } = useChatMessenger();
  const { t } = useTranslation();
  const { dispatch } = useChatMessenger();

  const [emailError, setEmailError] = useState<string>("");
  const [firstNameError, setFirstNameError] = useState<string>("");
  const [lastNameError, setLastNameError] = useState<string>("");
  const [touched, setTouched] = useState(false);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  useEffect(() => {
    !isAnonym && setShowLoginScreen(false);
  }, [isAnonym, setShowLoginScreen]);

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
      dispatch({
        type: CHAT_ACTIONS.UPDATE_OR_MERGE_CANDIDATE,
        payload: {
          candidateData: {
            emailAddress: email,
            firstName,
            lastName,
            callback: () => setShowLoginScreen(false),
          },
        },
      });
    }
  };

  return !showLoginScreen ? null : (
    <S.ViewBody>
      <S.Wrapper>
        <S.CloseLogin
          height="25px"
          onClick={() => setShowLoginScreen(false)}
          color={colors.black}
        />

        <S.HeaderTitle>{t("messages:provideName")}</S.HeaderTitle>

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
      </S.Wrapper>
    </S.ViewBody>
  );
};
