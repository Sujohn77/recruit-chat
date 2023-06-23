import { useChatMessenger } from "contexts/MessengerContext";
import { FC, useEffect, useState } from "react";
import parse from "html-react-parser";
import AnimateHeight, { Height } from "react-animate-height";

import * as S from "./styles";
import { getFormattedDate } from "utils/helpers";
import { ApiResponse } from "apisauce";
import {
  IApplyJobResponse,
  IFollowingRequest,
  IFollowingResponse,
} from "services/types";
import { CANDIDATE_ID, apiInstance } from "services/api";
import { IMAGES } from "assets";
import { Loader } from "components/Layout";

const ANIMATION_ID = "VIEW_JOB_ANIMATION_ID";

export const ViewJob: FC = () => {
  const { viewJob, setViewJob } = useChatMessenger();

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
    if (viewJob?.id) {
      setApplyJobLoading(true);
      try {
        const res: ApiResponse<IApplyJobResponse> = await apiInstance.applyJob(
          +viewJob.id
        );

        if (
          res.data?.success &&
          res.data?.FlowID &&
          res.data?.SubscriberWorkflowID
        ) {
          const payload: IFollowingRequest = {
            FlowID: res.data.FlowID,
            SubscriberWorkflowID: res.data.SubscriberWorkflowID,
            candidateId: CANDIDATE_ID,
            message: "yes",
          };
          const followingRes: ApiResponse<IFollowingResponse> =
            await apiInstance.sendFollowing(payload);

          if (followingRes.data?.success) {
            setViewJob(null);
          }
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
