import { useChatMessenger } from "contexts/MessengerContext";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ApiResponse } from "apisauce";
import AnimateHeight, { Height } from "react-animate-height";

import * as S from "./styles";
import { IJobOfferProps } from "./props";
import { IMAGES } from "assets";
import { apiInstance } from "services/api";
import { ISuccessResponse } from "services/types";
import { Loader } from "components/Layout";
import { DarkButton } from "components/Layout/styles";
import { LOG } from "utils/helpers";

const ANIMATION_ID = "ANIMATION_ID";

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
    isAlreadyPassEmail,
  } = useChatMessenger();
  const { t } = useTranslation();

  const [isSuccessInterested, setIsSuccessInterested] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [height, setHeight] = useState<Height>(0);
  const [isClicked, setIsClicked] = useState(0);

  const [initVal] = useState(isAnonym);

  useEffect(() => {
    let timeout: NodeJS.Timeout | undefined;
    if (height === "auto") {
      timeout = setTimeout(() => {
        setHeight(0);
        setErrorText("");
      }, 5000);
    }

    return () => {
      timeout && clearTimeout(timeout);
    };
  }, [height]);

  const interestedIn = async () => {
    setIsClicked((prevValue) => (prevValue === 1 ? prevValue : prevValue + 1));
    if ((!isAnonym || isAlreadyPassEmail) && !isLoading) {
      if (candidateId) {
        setIsLoading(true);
        try {
          const response: ApiResponse<ISuccessResponse> =
            await apiInstance.addCandidateByJobId(+jobOffer.id, candidateId);

          if (response?.data?.success) {
            setIsSuccessInterested(true);
          } else if (response.data?.statusCode === 303) {
            // if 303 === the user has already registered themselves for this job

            setErrorText("Already registered themselves for this job");
            setHeight("auto");
            setIsSuccessInterested(true);
          } else if (response.data?.statusCode === 105) {
            // general error, show error msg
            if (response.data.errors[0]) {
              setErrorText(response.data.errors[0]);
              setHeight("auto");
            }
          }
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
    if (initVal && !isAnonym && isClicked === 1 && shouldCallAgain) {
      interestedIn();
    }
  }, [isClicked, shouldCallAgain, isAnonym]);

  const handleReadMore = useCallback(() => {
    setViewJob(jobOffer);
  }, []);

  return (
    <S.JobOfferWrapper
      aria-expanded={height !== 0}
      aria-controls={ANIMATION_ID}
    >
      <S.OfferTitle>{jobOffer.title}</S.OfferTitle>

      <S.ReadMore onClick={handleReadMore}>
        {t("chat_item_description:read_more")}
      </S.ReadMore>

      {isLoading ? (
        <S.LoaderWrapper>
          <Loader showLoader absolutePosition={false} />
        </S.LoaderWrapper>
      ) : isSuccessInterested ? (
        <S.SuccessInteresting>
          {t("chat_item_description:success_interested_id")}
        </S.SuccessInteresting>
      ) : (
        <DarkButton onClick={interestedIn}>
          {t("chat_item_description:interested_in")}
        </DarkButton>
      )}

      <AnimateHeight id={ANIMATION_ID} duration={500} height={height}>
        <S.Error>
          <S.WarningImg src={IMAGES.WARN} alt="" />
          <S.ErrorText>{errorText}</S.ErrorText>
        </S.Error>
      </AnimateHeight>
    </S.JobOfferWrapper>
  );
};
