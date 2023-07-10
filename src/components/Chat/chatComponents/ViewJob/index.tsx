import { useChatMessenger } from "contexts/MessengerContext";
import { FC, useEffect, useState } from "react";
import parse from "html-react-parser";
import AnimateHeight, { Height } from "react-animate-height";
import sortBy from "lodash/sortBy";
import moment from "moment";

import * as S from "./styles";
import { LOG, getFormattedDate } from "utils/helpers";
import { ApiResponse } from "apisauce";
import { IApplyJobResponse, IMessage } from "services/types";
import { apiInstance } from "services/api";
import { IMAGES } from "assets";
import { Loader } from "components/Layout";
import { IMessageID, ISnapshot } from "utils/types";
import { getProcessedSnapshots } from "firebase/config";
import { FirebaseSocketReactivePagination } from "services/firebase/socket";
import { SocketCollectionPreset } from "services/firebase/socket.options";

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
    isAlreadyPassEmail,
  } = useChatMessenger();

  const [applyJobLoading, setApplyJobLoading] = useState(false);
  const [applyJobError, setApplyJobError] = useState<string | null>(null);
  const [height, setHeight] = useState<Height>(0);
  const [isClicked, setIsClicked] = useState(0);
  const [firebaseMessages, setFirebaseMessages] = useState<IMessage[]>([]);

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

  // LOG(firebaseMessages, "firebaseMessages");

  const handleApplyJobClick = async () => {
    setIsClicked((prevValue) => (prevValue === 1 ? prevValue : prevValue + 1));
    if (!isAnonym || isAlreadyPassEmail) {
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
            setViewJob(null);

            const savedSocketConnection =
              new FirebaseSocketReactivePagination<IMessage>(
                SocketCollectionPreset.Messages,
                chatId
              );

            savedSocketConnection.subscribe(
              (messagesSnapshots: ISnapshot<IMessage>[]) => {
                const processedSnapshots = sortBy(
                  getProcessedSnapshots<IMessageID, IMessage>(
                    firebaseMessages,
                    messagesSnapshots,
                    "chatItemId",
                    [],
                    "localId"
                  ),
                  (message: IMessage) => {
                    if (typeof message.dateCreated === "string") {
                      return -moment(message.dateCreated).unix();
                    } else if (message.dateCreated.seconds) {
                      return -message.dateCreated.seconds;
                    }
                  }
                );

                setFirebaseMessages(processedSnapshots);
              }
            );

            // for sending answer
            // const payload: IFollowingRequest = {
            //   FlowID: res.data.FlowID,
            //   SubscriberWorkflowID: res.data.SubscriberWorkflowID,
            //   candidateId: candidateId,
            //   message: "Yes", // answer example
            // };

            // const followingRes: ApiResponse<IFollowingResponse> =
            //   await apiInstance.sendFollowing(payload);

            // if (followingRes.data?.success) {
            //   setTimeout(() => setViewJob(null), 1000);
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

  useEffect(() => {
    // if the user has not yet entered an email then the login is displayed and that after login the callback is recalled
    if (isClicked === 1 && shouldCallAgain) {
      handleApplyJobClick();
    }
  }, [isClicked, shouldCallAgain]);

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
