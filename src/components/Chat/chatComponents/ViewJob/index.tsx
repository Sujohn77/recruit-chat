import { useChatMessenger } from "contexts/MessengerContext";
import { FC, useEffect, useState } from "react";
import { ApiResponse } from "apisauce";
import parse from "html-react-parser";
import AnimateHeight, { Height } from "react-animate-height";
import isNull from "lodash/isNull";

import * as S from "./styles";
import { IMAGES } from "assets";
import { Loader } from "components/Layout";
import { getFormattedDate } from "utils/helpers";
import { IApplyJobResponse } from "services/types";
import { apiInstance } from "services/api";

const ANIMATION_ID = "VIEW_JOB_ANIMATION_ID";

interface IViewJobProps {
  setShowLoginScreen: (show: boolean) => void;
}

export const ViewJob: FC<IViewJobProps> = ({ setShowLoginScreen }) => {
  const {
    viewJob,
    setViewJob,
    candidateId,
    isAnonym,
    chatId,
    shouldCallAgain,
    isCandidateWithEmail,
    setIsApplyJobSuccessfully,
    setFlowId,
    setSubscriberWorkflowId,
  } = useChatMessenger();

  const [applyJobLoading, setApplyJobLoading] = useState(false);
  const [applyJobError, setApplyJobError] = useState<string | null>(null);
  const [height, setHeight] = useState<Height>(0);
  const [isClicked, setIsClicked] = useState(0);
  const [showApplyBtn, setShowApplyBtn] = useState(true);

  useEffect(() => {
    isNull(viewJob) && setShowApplyBtn(true);
  }, [viewJob]);

  useEffect(() => {
    let timeout: NodeJS.Timeout | undefined;
    if (height === "auto") {
      timeout = setTimeout(() => {
        setHeight(0);
        setApplyJobError(null);
      }, 10000);
    }

    if (height === 0 && applyJobError) {
      setHeight("auto");
    }

    return () => {
      timeout && clearTimeout(timeout);
    };
  }, [height, applyJobError]);

  const handleApplyJobClick = async () => {
    if (!isAnonym || isCandidateWithEmail) {
      if (viewJob?.id && candidateId && chatId) {
        setApplyJobLoading(true);
        try {
          const res: ApiResponse<IApplyJobResponse> =
            await apiInstance.applyJob(+viewJob.id, candidateId, chatId);

          if (
            res.data?.success &&
            res.data?.FlowID &&
            res.data?.SubscriberWorkflowID
          ) {
            setIsApplyJobSuccessfully(true);
            setFlowId(res.data.FlowID);
            setSubscriberWorkflowId(res.data.SubscriberWorkflowID);
            setViewJob(null);
          } else {
            setShowApplyBtn(false);
            setApplyJobError(
              res.data?.errors[0]?.trim() ||
                "Sorry, it's not possible to accept this job."
            );
          }

          if (res.data?.statusCode === 105) {
            res.data?.errors[0] && setApplyJobError(res.data?.errors[0]);
          }
        } catch (error) {
          error.message && setApplyJobError(error.message);
        } finally {
          setApplyJobLoading(false);
        }
      }
    } else {
      setIsClicked((value) => (value === 1 ? value : value + 1));
      setShowLoginScreen(true);
    }
  };

  useEffect(() => {
    // if the user has not yet entered an email then the login is displayed and that after login the callback is recalled
    if (isClicked === 1 && shouldCallAgain) {
      handleApplyJobClick();
    }
  }, [isClicked, shouldCallAgain]);

  return !viewJob ? null : (
    <S.ViewBody aria-expanded={height !== 0} aria-controls={ANIMATION_ID}>
      <S.ViewShortInfo>
        <S.TextHeaderTitle>{viewJob.title}</S.TextHeaderTitle>

        <S.ShortItems>
          <S.InfoItem>{viewJob.location.city}</S.InfoItem>
          <S.InfoItem>{getFormattedDate(viewJob.datePosted!)}</S.InfoItem>
          <S.InfoItem>{viewJob.hiringType}</S.InfoItem>
        </S.ShortItems>

        {showApplyBtn && (
          <S.SubmitButton
            disabled={applyJobLoading}
            onClick={handleApplyJobClick}
          >
            {applyJobLoading ? (
              <S.LoaderWrapper>
                <Loader showLoader absolutePosition={false} />
              </S.LoaderWrapper>
            ) : (
              "Apply"
            )}
          </S.SubmitButton>
        )}
      </S.ViewShortInfo>

      <AnimateHeight id={ANIMATION_ID} duration={500} height={height}>
        <S.Error>
          <S.WarningImg src={IMAGES.WARN} alt="" />
          <S.ErrorText>{applyJobError}</S.ErrorText>
        </S.Error>
      </AnimateHeight>

      <S.ViewText>
        {viewJob.company && (
          <p>
            <b>Company: </b>
            {viewJob.company}
          </p>
        )}

        {viewJob?.status && (
          <p>
            <b>Status: </b>
            {viewJob.status}
          </p>
        )}
      </S.ViewText>
      <S.TextTitle>Job description: </S.TextTitle>
      <S.ViewDescription>{parse(viewJob.description)}</S.ViewDescription>

      {showApplyBtn && (
        <S.SubmitButton
          disabled={applyJobLoading}
          onClick={handleApplyJobClick}
        >
          {applyJobLoading ? (
            <S.LoaderWrapper>
              <Loader showLoader absolutePosition={false} />
            </S.LoaderWrapper>
          ) : (
            "Apply"
          )}
        </S.SubmitButton>
      )}

      <AnimateHeight id={ANIMATION_ID} duration={500} height={height}>
        <S.Error>
          <S.WarningImg src={IMAGES.WARN} alt="" />
          <S.ErrorText>{applyJobError}</S.ErrorText>
        </S.Error>
      </AnimateHeight>
    </S.ViewBody>
  );
};
