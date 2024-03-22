import { useChatMessenger } from "contexts/MessengerContext";
import { FC, useCallback, useEffect, useState } from "react";
import { FormControl } from "@mui/material";
import { useTranslation } from "react-i18next";
import AnimateHeight, { Height } from "react-animate-height";

import { IMAGES } from "assets";
import { PopUp } from "..";
import * as S from "./styles";
import { CHAT_ACTIONS } from "utils/types";
import { validateEmail } from "utils/helpers";
import { FormInput } from "components/Chat/ChatComponents/ChatInput/Autocomplete/styles";
import { FormButton } from "../MessagesList/Message/EmailForm/styles";

const ANIMATION_ID = "LOGIN_ANIMATION_ID";

interface ILoginProps {
  showLoginScreen: boolean;
  setShowLoginScreen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Login: FC<ILoginProps> = ({
  showLoginScreen,
  setShowLoginScreen,
}) => {
  const { t } = useTranslation();
  const { dispatch } = useChatMessenger();

  const [emailError, setEmailError] = useState<string>("");
  const [firstNameError, setFirstNameError] = useState<string>("");
  const [lastNameError, setLastNameError] = useState<string>("");
  const [touched, setTouched] = useState(false);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [height, setHeight] = useState<Height>(0);

  const onLogin = useCallback(() => {
    const errorText = validateEmail(email);

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
  }, [email, firstName, lastName]);

  useEffect(() => {
    const keyDownHandler = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        event.preventDefault();
        onLogin();
      }
    };
    document.addEventListener("keydown", keyDownHandler);

    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, [onLogin]);

  useEffect(() => {
    setHeight(emailError ? "auto" : 0);
  }, [emailError]);

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

  return !showLoginScreen ? null : (
    <PopUp>
      <S.Wrapper>
        <S.CloseLogin height="25px" onClick={() => setShowLoginScreen(false)} />

        <S.HeaderTitle>{t("messages:provideName")}</S.HeaderTitle>

        <FormControl aria-expanded={height !== 0} aria-controls={ANIMATION_ID}>
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
            onClick={() => setTouched(!touched)}
            placeholder="Email"
          />

          <AnimateHeight id={ANIMATION_ID} duration={500} height={height}>
            <S.Error>
              <S.WarningImg src={IMAGES.WARN} alt="" />
              {emailError}
            </S.Error>
          </AnimateHeight>
        </FormControl>

        <FormButton onClick={onLogin}>{t("buttons:send")}</FormButton>
      </S.Wrapper>
    </PopUp>
  );
};
