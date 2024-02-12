import { useChatMessenger } from "./MessengerContext";
import isNumber from "lodash/isNumber";
import { ApiResponse } from "apisauce";
import { useCallback } from "react";

import { apiInstance } from "services/api";
import {
  ISubmitReferralResponse,
  IValidateRefPayload,
  IValidateRefResponse as IValidateRefRes,
} from "services/types";
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
    setEmployeeJobCategory,
    setEmployeeLocation,
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

          if (res.data) {
            if (res.data?.candidateId && res.data?.updateChatBotCandidateId) {
              setCandidateId(res.data.candidateId);
              // setIsCandidateAnonym(false);
            }
            res.data.employeeLocation &&
              setEmployeeLocation(res.data.employeeLocation);
            res.data.employeeJobCategory &&
              setEmployeeJobCategory(res.data.employeeJobCategory);
          }

          if (
            (res.data?.success === false && res.data?.errors.length) ||
            res?.data?.isValid === false
          ) {
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
      onSuccess: (previouslyReferredState: number) => void,
      onFailure: Function
    ) => {
      try {
        setIsChatLoading(true);

        const res: ApiResponse<ISubmitReferralResponse> =
          await apiInstance.submitReferral({
            ...payload,
            referrerSubscriberId: candidateId!,
          });

        if (res.data && isNumber(res.data?.previouslyReferredState)) {
          onSuccess(res.data.previouslyReferredState);
        } else {
          onFailure();
        }
      } catch (error) {
      } finally {
        setIsChatLoading(false);
      }
    },
    [candidateId]
  );
};
