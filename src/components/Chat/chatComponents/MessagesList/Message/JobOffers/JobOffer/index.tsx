import { useChatMessenger } from "contexts/MessengerContext";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ApiResponse } from "apisauce";
import parse from "html-react-parser";

import * as S from "./styles";
import { IJobOfferProps } from "./props";
import { apiInstance } from "services/api";
import { ISuccessResponse } from "services/types";
import { Loader } from "components/Layout";
import { DarkButton } from "components/Layout/styles";
import { LOG, generateLocalId } from "utils/helpers";
import { ILocalMessage, MessageType } from "utils/types";

export const JobOffer: React.FC<IJobOfferProps> = ({
  jobOffer,
  setShowLoginScreen,
  isLastMessage,
  isActive,
}) => {
  const {
    setViewJob,
    candidateId,
    isAnonym,
    shouldCallAgain,
    isCandidateWithEmail,
    _setMessages,
  } = useChatMessenger();
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);
  const [isClicked, setIsClicked] = useState(0);

  const interestedInHandler = async () => {
    setIsClicked((prevValue) => (prevValue === 1 ? prevValue : prevValue + 1));
    if ((!isAnonym || isCandidateWithEmail) && !isLoading) {
      if (candidateId) {
        let interestedInResMess: ILocalMessage;

        try {
          setIsLoading(true);
          const response: ApiResponse<ISuccessResponse> =
            await apiInstance.addCandidateByJobId(+jobOffer.id, candidateId);

          if (response?.data?.success) {
            interestedInResMess = {
              isOwn: false,
              _id: null,
              localId: generateLocalId(),
              content: {
                subType: MessageType.TEXT,
                text: t("chat_item_description:success_interested_id"),
              },
            };
          } else if (response.data?.statusCode === 303) {
            // if 303 === the user has already registered themselves for this job
            interestedInResMess = {
              _id: null,
              localId: generateLocalId(),
              isOwn: false,
              content: {
                subType: MessageType.TEXT,
                // TODO: add translation
                text: "Already registered themselves for this job",
              },
            };
          } else if (response.data?.statusCode === 105) {
            // general error, show error msg
            if (response.data.errors[0]) {
              interestedInResMess = {
                _id: null,
                localId: generateLocalId(),
                isOwn: false,
                content: {
                  subType: MessageType.TEXT,
                  text: response.data.errors[0],
                },
              };
            }
          }

          _setMessages((prevMessages) => [
            interestedInResMess,
            ...prevMessages,
          ]);
        } catch (error) {
          LOG(error, "ERROR");
        } finally {
          setIsLoading(false);
        }
      }
    } else {
      setShowLoginScreen(true);
    }
  };

  useEffect(() => {
    // if the user has not yet entered an email then the login is displayed and that after login the callback is recalled
    if (isClicked === 1 && shouldCallAgain) {
      interestedInHandler();
    }
  }, [isClicked, shouldCallAgain]);

  const handleReadMore = useCallback(() => setViewJob(jobOffer), []);

  return (
    <S.JobOfferWrapper>
      <S.OfferTitle>{jobOffer.title}</S.OfferTitle>

      <S.Description>{parse(jobOffer.description)}</S.Description>

      <S.ButtonsWrapper>
        <DarkButton onClick={handleReadMore}>
          {t("chat_item_description:read_more")}
        </DarkButton>

        <DarkButton
          disabled={isLoading || !isLastMessage}
          onClick={interestedInHandler}
        >
          {isLoading ? (
            <S.LoaderWrapper>
              <Loader showLoader absolutePosition={false} />
            </S.LoaderWrapper>
          ) : (
            t("chat_item_description:interested_in")
          )}
        </DarkButton>
      </S.ButtonsWrapper>
    </S.JobOfferWrapper>
  );
};
