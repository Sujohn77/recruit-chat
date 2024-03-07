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

export interface ISubmitReferral {
  referralSourceTypeId: number;
  referredCandidate: {
    firstName: string;
    lastName: string;
    emailAddress: string;
    mobileNumber: string;
  };
  jobId?: number;
  jobSourceID?: string;
}

export const useValidateReferral = () => {
  const {
    candidateId,
    chatId,
    setIsChatLoading,
    setCandidateId,
    setEmployeeJobCategory,
    setEmployeeLocation,
    setEmployeeFullName,
    setEmployeeLocationID,
    setEmployeeJobFamilyNames,
  } = useChatMessenger();

  return useCallback(
    async (
      data: IReferralData,
      onSuccess: (fullName?: string) => void,
      onFailure: () => void
    ) => {
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

          if (res.data) {
            const {
              candidateId,
              employeeLocationCity,
              employeeJobTitle,
              employeeFullName,
              employeeLocationId,
              employeeJobFamilyNames,
              updateChatBotCandidateId,
            } = res.data;

            if (candidateId && updateChatBotCandidateId) {
              setCandidateId(candidateId);
              // setIsCandidateAnonym(false);
            }
            employeeLocationCity && setEmployeeLocation(employeeLocationCity);
            employeeJobTitle && setEmployeeJobCategory(employeeJobTitle);
            employeeFullName && setEmployeeFullName(employeeFullName);
            employeeLocationId && setEmployeeLocationID(employeeLocationId);
            employeeJobFamilyNames.length &&
              setEmployeeJobFamilyNames(employeeJobFamilyNames);
          }

          if (res?.data?.isValid) {
            onSuccess(res.data.employeeFullName);
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
