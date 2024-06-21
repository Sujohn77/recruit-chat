import { FC, useCallback } from "react";
import { useTranslation } from "react-i18next";

import * as S from "./styles";
import { DarkButton } from "components/Layout/styles";
import { ILocalMessage } from "utils/types";
import { COLORS } from "utils/colors";
import { TryAgainTypes } from "utils/constants";
import { useChatMessenger } from "contexts/MessengerContext";
import { createTextMess } from "utils/helpers";
import {
  ReferralSteps,
  getReferralQuestion,
} from "components/Chat/ChatComponents/ChatInput/data";

interface ITryAgainProps {
  message: ILocalMessage;
  isLastMess: boolean;
}

export const TryAgain: FC<ITryAgainProps> = ({ message, isLastMess }) => {
  const { t } = useTranslation();
  const {
    companyName: referralCompanyName,
    setMessages,
    setReferralStep,
    sendNewMessage,
  } = useChatMessenger();

  const onTryAgainClick = useCallback(() => {
    const tryAgain = createTextMess({
      isOwn: true,
      text: t("messages:try_again"),
      i18n: "messages:try_again",
    });

    switch (message.content.tryAgainType) {
      case TryAgainTypes.Validate:
        const employeeQuestion = createTextMess({
          text: t("messages:employeeId", {
            companyName: referralCompanyName,
          }),
          i18n: "messages:employeeId",
          i18nProps: {
            companyName: referralCompanyName,
          },
        });

        sendNewMessage({
          isOwn: false,
          message: tryAgain.content.text,
          localId: tryAgain.localId,
        });
        sendNewMessage({
          isOwn: false,
          message: employeeQuestion.content.text,
          localId: employeeQuestion.localId,
        });

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

        sendNewMessage({
          isOwn: false,
          message: tryAgain.content.text,
          localId: tryAgain.localId,
        });
        sendNewMessage({
          isOwn: false,
          message: userLastNameMess.content.text,
          localId: userLastNameMess.localId,
        });

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
        disabled={!isLastMess}
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
