import { useTheme } from "styled-components";
import { FC } from "react";

import * as S from "./styles";
import { OtpForm } from "./OtpForm";
import { ICONS } from "assets";
import { MessageType } from "utils/types";
import { generateLocalId } from "utils/helpers";
import { ThemeType } from "utils/theme/default";
import { IntroImage } from "screens/Intro/styles";
import { TextMessage } from "components/Chat/chatComponents/MessagesList/Message/TextMessage";

export const TrialPassword: FC = () => {
  const theme = useTheme() as ThemeType;

  return (
    <S.Wrapper>
      <S.IntroImageButton>
        <IntroImage
          src={theme?.imageUrl || ICONS.LOGO}
          size="20px"
          alt="rob-face"
        />
      </S.IntroImageButton>

      <S.OtpContent>
        <TextMessage
          message={{
            _id: generateLocalId(),
            content: {
              subType: MessageType.TEXT,
              text: "We have sent you a temporary code by email. Enter it in the box below!",
            },
          }}
        />
        <OtpForm />
      </S.OtpContent>
    </S.Wrapper>
  );
};
