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
import { FormButton } from "../MessagesList/Message/EmailForm/styles";
import { FormInput } from "../ChatInput/Autocomplete/styles";

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
  const { dispatch, isChatLoading } = useChatMessenger();

  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState<string>("");
  const [firstNameError, setFirstNameError] = useState<string>("");
  const [lastNameError, setLastNameError] = useState<string>("");
  const [touched, setTouched] = useState(false);

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [height, setHeight] = useState<Height>(0);

  const onLogin = useCallback(() => {
    const emailError = validateEmail(email, t("labels:login_validation"));
    const fNameError = !firstName.trim();
    const lNameError = !lastName.trim();

    if (fNameError) {
      setFirstNameError(t("labels:login_validation"));
      setError(t("labels:login_validation"));
    }
    if (lNameError) {
      setLastNameError(t("labels:login_validation"));
      setError(t("labels:login_validation"));
    }
    if (emailError) {
      setEmailError(emailError);
      setError(emailError);
    }

    if (!fNameError && !lNameError && !emailError) {
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
        i18nProps: null,
      });
    }
  }, [email, firstName, lastName]);

  useEffect(() => {
    const keyDownHandler = (event: KeyboardEvent) => {
      if (showLoginScreen && event.key === "Enter") {
        event.preventDefault();
        onLogin();
      }
    };
    document.addEventListener("keydown", keyDownHandler);

    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, [onLogin, showLoginScreen]);

  useEffect(() => {
    setHeight(error ? "auto" : 0);
  }, [error]);

  useEffect(() => {
    // clear state
    if (!showLoginScreen) {
      setEmail("");
      setEmailError("");
      setFirstName("");
      setFirstNameError("");
      setLastName("");
      setLastNameError("");
      setError("");
    }
  }, [showLoginScreen]);

  const onChange = useCallback(
    (type: number) => (e: any) => {
      setError("");
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

        <S.HeaderTitle>{t("labels:login")}</S.HeaderTitle>

        <FormControl aria-expanded={height !== 0} aria-controls={ANIMATION_ID}>
          <FormInput
            value={firstName}
            onChange={onChange(1)}
            onClick={() => setTouched(!touched)}
            placeholder={t("labels:first_name")}
            validationError={!!firstNameError}
          />
          <FormInput
            value={lastName}
            onChange={onChange(2)}
            onClick={() => setTouched(!touched)}
            placeholder={t("labels:last_name")}
            validationError={!!lastNameError}
          />
          <FormInput
            value={email}
            onChange={onChange(3)}
            onClick={() => setTouched(!touched)}
            placeholder="Email"
            validationError={!!emailError}
          />

          <AnimateHeight id={ANIMATION_ID} duration={500} height={height}>
            <S.Error>
              <S.WarningImg src={IMAGES.WARN} alt="" />
              {error}
            </S.Error>
          </AnimateHeight>
        </FormControl>

        <FormButton disabled={isChatLoading} onClick={onLogin}>
          {t("buttons:send")}
        </FormButton>
      </S.Wrapper>
    </PopUp>
  );
};
