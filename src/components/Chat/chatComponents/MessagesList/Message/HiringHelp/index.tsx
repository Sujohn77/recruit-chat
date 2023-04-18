import { useChatMessenger } from "contexts/MessengerContext";
import { FC } from "react";
import { useTranslation } from "react-i18next";

import { ICONS } from "assets";
import { getMessageProps } from "utils/helpers";
import { CHAT_ACTIONS, ILocalMessage } from "utils/types";
import { DarkButton } from "components/Layout/styles";
import * as S from "./styles";

interface IHiringHelpProps {
  message: ILocalMessage;
}

export const HiringHelp: FC<IHiringHelpProps> = ({ message }) => {
  const { t } = useTranslation();
  const { triggerAction } = useChatMessenger();
  const messagesProps = getMessageProps(message);

  const onClick = () => triggerAction({ type: CHAT_ACTIONS.HELP });

  const handleFeedBackClick = () => {};

  return (
    <S.Wrapper {...messagesProps}>
      <S.Section>
        <S.Title>{t("chat_item_description:hiring_help_title")}</S.Title>
        <DarkButton onClick={onClick}>
          {t("chat_item_description:hiring_help_text")}
        </DarkButton>
      </S.Section>

      <S.Text>{t("chat_item_description:hiring_helpful_text")}</S.Text>
      <S.FeedBackIcons>
        <FeedBackIcon isReversed onClick={handleFeedBackClick} />
        <FeedBackIcon onClick={handleFeedBackClick} />
      </S.FeedBackIcons>
    </S.Wrapper>
  );
};

interface IFeedBackIconProps {
  isReversed?: boolean;
  onClick: () => void;
}

export const FeedBackIcon: FC<IFeedBackIconProps> = ({
  isReversed = false,
  onClick,
}) => (
  <S.FeedbackIconWrapper isReversed={isReversed} onClick={onClick}>
    <img src={ICONS.FINGER_UP} alt="down" width={22} height={20} />
  </S.FeedbackIconWrapper>
);
