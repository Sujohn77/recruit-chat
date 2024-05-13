import { FC } from "react";

import * as S from "./styles";
import { useChatMessenger } from "contexts/MessengerContext";
import { useTranslation } from "react-i18next";

export const PrivacyPolicy: FC = () => {
  const { t } = useTranslation();
  const { PPLinkUrl, footerPrivacyLink, companyName } = useChatMessenger();
  const withFooterPP = PPLinkUrl && footerPrivacyLink?.enabled;

  return withFooterPP ? (
    <S.Wrapper>
      <S.Link
        onClick={() => {
          const newTab = window.open(`${PPLinkUrl}`, "_blank");
          newTab?.focus();
        }}
      >
        {t("labels:privacy_policy", { companyName })}
      </S.Link>
    </S.Wrapper>
  ) : null;
};
