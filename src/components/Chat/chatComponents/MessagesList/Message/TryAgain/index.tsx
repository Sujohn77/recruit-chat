import { FC, useCallback } from "react";
import { useTranslation } from "react-i18next";

import * as S from "./styles";
import { DarkButton } from "components/Layout/styles";
import { ILocalMessage, MessageType } from "utils/types";
import { COLORS } from "utils/colors";
import { TryAgainTypes } from "utils/constants";
import { useChatMessenger } from "contexts/MessengerContext";
import { generateLocalId } from "utils/helpers";
import {
  ReferralSteps,
  getReferralQuestion,
} from "components/Chat/ChatComponents/ChatInput/data";

interface ITryAgainProps {
  message: ILocalMessage;
  isLastMessage: boolean;
}

export const TryAgain: FC<ITryAgainProps> = ({ message, isLastMessage }) => {
  const { t } = useTranslation();
  const { referralCompanyName, setMessages, setReferralStep } =
    useChatMessenger();

  const onTryAgainClick = useCallback(() => {
    const tryAgain: ILocalMessage = {
      _id: generateLocalId(),
      localId: generateLocalId(),
      content: {
        subType: MessageType.TEXT,
        text: t("messages:try_again"),
        i18n: "messages:try_again",
        i18nProps: null,
      },
      isOwn: true,
    };

    switch (message.content.tryAgainType) {
      case TryAgainTypes.Validate:
        const employeeQuestion: ILocalMessage = {
          _id: generateLocalId(),
          localId: generateLocalId(),
          content: {
            subType: MessageType.TEXT,
            text: t("messages:employeeId", {
              companyName: referralCompanyName,
            }),
            i18n: "messages:employeeId",
            i18nProps: {
              companyName: referralCompanyName,
            },
          },
        };
        setMessages((prevMessages) => [
          employeeQuestion,
          tryAgain,
          ...prevMessages,
        ]);
        setReferralStep(ReferralSteps.EmployeeId);

        break;

      case TryAgainTypes.SendReferral:
        const userLastNameMess = getReferralQuestion(
          ReferralSteps.UserFirstName
        );
        setMessages((prevMessages) => [
          userLastNameMess,
          tryAgain,
          ...prevMessages,
        ]);
        setReferralStep(ReferralSteps.UserFirstName);
        break;

      default:
        break;
    }
  }, []);

  return (
    <S.Wrapper>
      <S.MessageText>{message.content.text}</S.MessageText>
      <DarkButton
        onClick={onTryAgainClick}
        disabled={!isLastMessage}
        width="35%"
        fontWeight={500}
        fontColor={COLORS.WHITE}
        backgroundColor={COLORS.VIVID_TANGERINE}
      >
        {t("buttons:try_again")}
      </DarkButton>
    </S.Wrapper>
  );
};
