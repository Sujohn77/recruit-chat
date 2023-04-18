import { useAuthContext } from "contexts/AuthContext";
import { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import { useTheme } from "styled-components";

import * as S from "./styles";
import * as IntoStyles from "../styles";
import { ButtonsTheme } from "utils/types";
import { ThemeType } from "utils/theme/default";
import { INPUT_TYPES, InputTheme } from "utils/constants";
import { DefaultButton, DefaultInput } from "components/Layout";

export const OtpForm: FC = () => {
  const { loginByEmail, isVerified, error, setError } = useAuthContext();

  const [lengthError, setLengthError] = useState<string | null>(null);
  const [oneTimePassword, setOneTimePassword] = useState("");
  const [isSubmit, setIsSubmit] = useState(false);

  const theme = useTheme() as ThemeType;

  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (error) {
      ref.current?.focus();
      setOneTimePassword("");
    }
  }, [error]);

  const onClick = async () => {
    if (oneTimePassword.length === 6) {
      await loginByEmail({ oneTimePassword });
      setIsSubmit(true);
    } else {
      setLengthError("Incorrect length");
      setOneTimePassword("");
      ref?.current?.focus();
    }
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length < 7) {
      setLengthError(null);
      setError(null);
      setOneTimePassword(e.target.value);
    }
  };

  return (
    <IntoStyles.Wrapper theme={theme}>
      <DefaultInput
        type={INPUT_TYPES.NUMBER}
        placeHolder="0000"
        value={oneTimePassword}
        onChange={onChange}
        theme={InputTheme.Default}
        error={lengthError || error}
        style={{ textAlign: "center", marginBottom: "16px" }}
        ref={ref}
      />

      {(!isSubmit || !isVerified) && (
        <DefaultButton
          value="Send"
          onClick={onClick}
          theme={ButtonsTheme.Purple}
          style={{ padding: "0 10px" }}
        />
      )}

      {isVerified && isSubmit && <S.OtpSentText>Thanks!</S.OtpSentText>}
    </IntoStyles.Wrapper>
  );
};
