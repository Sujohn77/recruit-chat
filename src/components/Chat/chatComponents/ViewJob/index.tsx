import { useChatMessenger } from "contexts/MessengerContext";
import { FC, useEffect, useRef, useState } from "react";
import { ApiResponse } from "apisauce";
import parse from "html-react-parser";
import AnimateHeight, { Height } from "react-animate-height";
import isNull from "lodash/isNull";

import * as S from "./styles";
import { IMAGES } from "assets";
import { Loader } from "components/Layout";
import { LOG, generateLocalId, getFormattedDate } from "utils/helpers";
import { IApplyJobResponse, ISuccessResponse } from "services/types";
import { apiInstance } from "services/api";
import { ILocalMessage, MessageType } from "utils/types";
import { useTranslation } from "react-i18next";
import { DarkButton } from "components/Layout/styles";

const ANIMATION_ID = "VIEW_JOB_ANIMATION_ID";

type ButtonType = "interested_in" | "apply";

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
    _setMessages,
  } = useChatMessenger();
  const { t } = useTranslation();
  const lastBtn = useRef<null | ButtonType>(null);

  const [applyJobLoading, setApplyJobLoading] = useState(false);
  const [applyJobError, setApplyJobError] = useState<string | null>(null);
  const [height, setHeight] = useState<Height>(0);
  const [isClicked, setIsClicked] = useState(0);
  const [showApplyBtn, setShowApplyBtn] = useState(true);
  const [jobIdWithoutFlowId, setJobIdWithoutFlowId] = useState<number>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    isNull(viewJob) && setShowApplyBtn(true);
  }, [viewJob]);

  useEffect(() => {
    if (height === 0 && applyJobError) {
      setHeight("auto");
    }
  }, [height, applyJobError]);

  useEffect(() => {
    if (viewJob === null) {
      setHeight(0);
      setApplyJobError(null);
    }
  }, [viewJob]);

  useEffect(() => {
    if (viewJob?.id && +viewJob?.id === jobIdWithoutFlowId) {
      setShowApplyBtn(false);
      setApplyJobError(
        "Sorry, it’s not been possible to start your application for this job. Please try again or contact support@loopworks.com"
      );
    }
  }, [viewJob, jobIdWithoutFlowId]);

  useEffect(() => {
    // if the user has not yet entered an email then the login is displayed and that after login the callback is recalled
    if (
      isClicked !== 0 &&
      shouldCallAgain &&
      lastBtn.current === "interested_in"
    ) {
      interestedInHandler();
    }
  }, [isClicked, shouldCallAgain]);

  useEffect(() => {
    // if the user has not yet entered an email then the login is displayed and that after login the callback is recalled
    if (isClicked !== 0 && shouldCallAgain && lastBtn.current === "apply") {
      handleApplyJobClick();
    }
  }, [isClicked, shouldCallAgain]);

  useEffect(() => {
    return () => {
      lastBtn.current = null;
    };
  }, [viewJob]);

  const interestedInHandler = async () => {
    lastBtn.current = "interested_in";
    if ((!isAnonym || isCandidateWithEmail) && !isLoading && viewJob) {
      if (candidateId) {
        let interestedInResMess: ILocalMessage;

        try {
          setIsLoading(true);
          const response: ApiResponse<ISuccessResponse> =
            await apiInstance.addCandidateByJobId(+viewJob.id, candidateId);

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

          setViewJob(null);
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
      setIsClicked((prevValue) =>
        prevValue === 1 ? prevValue : prevValue + 1
      );
    }
  };

  const handleApplyJobClick = async () => {
    lastBtn.current = "apply";
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
                "Sorry, it’s not been possible to start your application for this job. Please try again or contact support@loopworks.com"
            );

            if (res.data?.FlowID === 0) {
              setJobIdWithoutFlowId(+viewJob.id);
            }
          }

          if (res.data?.statusCode === 105) {
            setApplyJobError(res.data?.errors[0] || "Something went wrong...");
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

  return !viewJob ? null : (
    <S.ViewBody aria-expanded={height !== 0} aria-controls={ANIMATION_ID}>
      <S.ViewShortInfo>
        <S.TextHeaderTitle>{viewJob.title}</S.TextHeaderTitle>

        <S.ShortItems>
          <S.InfoItem>{viewJob.location.city}</S.InfoItem>
          <S.InfoItem>{getFormattedDate(viewJob.datePosted!)}</S.InfoItem>
          <S.InfoItem>{viewJob.hiringType}</S.InfoItem>
        </S.ShortItems>

        <S.ButtonsWrapper>
          {showApplyBtn && (
            <DarkButton
              disabled={applyJobLoading}
              onClick={handleApplyJobClick}
              fontWeight={700}
            >
              {applyJobLoading ? (
                <S.LoaderWrapper>
                  <Loader showLoader absolutePosition={false} />
                </S.LoaderWrapper>
              ) : (
                "Apply"
              )}
            </DarkButton>
          )}

          <DarkButton
            disabled={isLoading}
            onClick={interestedInHandler}
            fontWeight={700}
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

        <AnimateHeight id={ANIMATION_ID} duration={500} height={height}>
          <S.Error>
            <S.WarningImg src={IMAGES.WARN} alt="" />
            <S.ErrorText>{applyJobError}</S.ErrorText>
          </S.Error>
        </AnimateHeight>
      </S.ViewShortInfo>

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
