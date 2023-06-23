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

const ANIMATION_ID = "ANIMATION_ID";

export const JobOffer: React.FC<IJobOfferProps> = ({ jobOffer }) => {
  const { setViewJob } = useChatMessenger();
  const { t } = useTranslation();

  const [isSuccessInterested, setIsSuccessInterested] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [height, setHeight] = useState<Height>(0);

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

  const handleSubmitClick = useCallback(async () => {
    setIsLoading(true);
    try {
      const response: ApiResponse<ISuccessResponse> =
        await apiInstance.addCandidateByJobId(+jobOffer.id);

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
      console.log("====================================");
      console.log("ERROR", error);
      console.log("====================================");
    } finally {
      setIsLoading(false);
    }
  }, []);

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
        <DarkButton onClick={handleSubmitClick}>
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
