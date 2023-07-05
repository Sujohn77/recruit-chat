import { useChatMessenger } from "contexts/MessengerContext";
import { FC, useEffect, useState } from "react";
import parse from "html-react-parser";
import AnimateHeight, { Height } from "react-animate-height";

import * as S from "./styles";
import { getFormattedDate } from "utils/helpers";
import { ApiResponse } from "apisauce";
import { IApplyJobResponse } from "services/types";
import { apiInstance } from "services/api";
import { IMAGES } from "assets";
import { Loader } from "components/Layout";

const ANIMATION_ID = "VIEW_JOB_ANIMATION_ID";

interface IViewJobProps {
  setShowLoginScreen: (show: boolean) => void;
}

export const ViewJob: FC<IViewJobProps> = ({ setShowLoginScreen }) => {
  const { viewJob, setViewJob, candidateId, isAnonym } = useChatMessenger();

  const [applyJobLoading, setApplyJobLoading] = useState(false);
  const [applyJobError, setApplyJobError] = useState<string | null>(null);
  const [height, setHeight] = useState<Height>(0);

  useEffect(() => {
    let timeout: NodeJS.Timeout | undefined;
    if (height === "auto") {
      timeout = setTimeout(() => {
        setHeight(0);
        setApplyJobError(null);
      }, 5000);
    }

    if (height === 0 && applyJobError) {
      setHeight("auto");
    }

    return () => {
      timeout && clearTimeout(timeout);
    };
  }, [height, applyJobError]);

  const handleApplyJobClick = async () => {
    if (!isAnonym) {
      if (viewJob?.id && candidateId) {
        setApplyJobLoading(true);
        try {
          const res: ApiResponse<IApplyJobResponse> =
            await apiInstance.applyJob(+viewJob.id, candidateId);

          if (
            res.data?.success &&
            res.data?.FlowID &&
            res.data?.SubscriberWorkflowID
          ) {
            setViewJob(null);
            // for sending answer
            // const payload: IFollowingRequest = {
            //   FlowID: res.data.FlowID,
            //   SubscriberWorkflowID: res.data.SubscriberWorkflowID,
            //   candidateId: CANDIDATE_ID,
            //   message: "yes", // answer example
            // };

            // const followingRes: ApiResponse<IFollowingResponse> =
            //   await apiInstance.sendFollowing(payload);

            // if (followingRes.data?.success) {
            //   setViewJob(null);
            // }
          } else {
            res.data?.errors[0] &&
              setApplyJobError(res.data?.errors[0] || "Something");
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
      setShowLoginScreen(true);
    }
  };

  return !viewJob ? null : (
    <S.ViewBody>
      <S.ViewShortInfo>
        <S.TextHeaderTitle>{viewJob.title}</S.TextHeaderTitle>

        <S.ShortItems>
          <S.InfoItem>{viewJob.location.city}</S.InfoItem>
          <S.InfoItem>{getFormattedDate(viewJob.datePosted!)}</S.InfoItem>
          <S.InfoItem>{viewJob.hiringType}</S.InfoItem>
        </S.ShortItems>

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
      <S.SubmitButton disabled={applyJobLoading} onClick={handleApplyJobClick}>
        {applyJobLoading ? (
          <S.LoaderWrapper>
            <Loader showLoader absolutePosition={false} />
          </S.LoaderWrapper>
        ) : (
          "Apply"
        )}
      </S.SubmitButton>

      <AnimateHeight id={ANIMATION_ID} duration={500} height={height}>
        <S.Error>
          <S.WarningImg src={IMAGES.WARN} alt="" />
          <S.ErrorText>{applyJobError}</S.ErrorText>
        </S.Error>
      </AnimateHeight>
    </S.ViewBody>
  );
};
