import { FC } from "react";
import { useTranslation } from "react-i18next";

import * as S from "./styles";
import { useChatMessenger } from "contexts/MessengerContext";

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
        <S.Text>{t("labels:privacy_policy", { companyName })}</S.Text>
      </S.Link>
    </S.Wrapper>
  ) : null;
};
