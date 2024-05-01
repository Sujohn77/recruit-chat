import { FC } from "react";

import * as S from "./styles";
import { useChatMessenger } from "contexts/MessengerContext";

export const PrivacyPolicy: FC = () => {
  const { PPLinkInnerText, PPLinkUrl } = useChatMessenger();

  return PPLinkInnerText && PPLinkUrl ? (
    <S.Wrapper>
      <S.Link target="_blank" href={PPLinkUrl}>
        {PPLinkInnerText}
      </S.Link>
    </S.Wrapper>
  ) : null;
};
