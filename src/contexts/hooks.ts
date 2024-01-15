import { useChatMessenger } from "./MessengerContext";
import { ApiResponse } from "apisauce";
import { useCallback } from "react";

import { apiInstance } from "services/api";
import {
  ISuccessResponse,
  IValidateRefPayload,
  IValidateRefResponse as IValidateRefRes,
} from "services/types";
import { LOG } from "utils/helpers";
import { IReferralData } from "utils/types";

interface ISubmitReferral {
  jobId?: number;
  referralSourceTypeId: number;
  referredCandidate: {
    firstName: string;
    lastName: string;
    emailAddress: string;
    mobileNumber: string;
  };
}

export const useValidateReferral = () => {
  const {
    candidateId,
    chatId,
    setIsChatLoading,
    setCandidateId,
    setIsCandidateAnonym,
  } = useChatMessenger();

  return useCallback(
    async (data: IReferralData, onSuccess: Function, onFailure: Function) => {
      if (candidateId && chatId) {
        const payload: IValidateRefPayload = {
          employeeId: +data.employeeId,
          lastName: data.lastName,
          candidateId: candidateId,
          chatId: chatId,
          "year-of-birth": data.yeanOrBirth,
        };

        try {
          setIsChatLoading(true);
          const res: ApiResponse<IValidateRefRes> =
            await apiInstance.validateReferral(payload);

          if (res?.data?.isValid) {
            onSuccess();
          }

          if (res.data?.candidateId && res.data.updateChatBotCandidateId) {
            setCandidateId(res.data.candidateId);
            setIsCandidateAnonym(false);
          }

          if (res.data?.success === false && res.data.errors.length) {
            onFailure();
          }
        } catch (error) {
          onFailure();
        } finally {
          setIsChatLoading(false);
        }
      }
    },
    [candidateId, chatId]
  );
};

export const useSubmitReferral = () => {
  const { setIsChatLoading, candidateId } = useChatMessenger();

  return useCallback(
    async (
      payload: ISubmitReferral,
      onSuccess: Function,
      onFailure: Function
    ) => {
      try {
        setIsChatLoading(true);

        const res: ApiResponse<ISuccessResponse> =
          await apiInstance.submitReferral({
            ...payload,
            referrerSubscriberId: candidateId!,
          });

        if (res.data?.success === false) {
          onFailure();
        } else {
          onSuccess();
        }
        LOG(res, "response");
      } catch (error) {
      } finally {
        setIsChatLoading(false);
      }
    },
    [candidateId]
  );
};
