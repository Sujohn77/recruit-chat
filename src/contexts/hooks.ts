import { useCallback } from "react";
import { useChatMessenger } from "./MessengerContext";
import { apiInstance } from "services/api";
import { ICreateAndSendPayload, IValidateRefPayload } from "services/types";
import { LOG } from "utils/helpers";
import { IReferralData } from "utils/types";

export const useSubmitReferral = () => {
  const { setIsChatLoading } = useChatMessenger();

  return useCallback(
    async (
      payload: ICreateAndSendPayload,
      onSuccess?: () => void,
      onFailure?: () => void
    ) => {
      try {
        setIsChatLoading(true);

        const response = apiInstance.submitReferral(payload);
        onSuccess?.();
      } catch (error) {
        onFailure?.();
      } finally {
        setIsChatLoading(false);
      }
    },
    []
  );
};

export const useValidateReferral = () => {
  const { candidateId, chatId, setIsChatLoading } = useChatMessenger();

  return useCallback(
    async (data: IReferralData, onSuccess?: Function, onFailure?: Function) => {
      if (candidateId && chatId) {
        try {
          setIsChatLoading(true);
          const payload: IValidateRefPayload = {
            employeeId: +data.employeeId,
            lastName: data.lastName,
            candidateId: candidateId,
            chatId: chatId,
            "year-of-birth": data.yeanOrBirth,
          };

          const response = await apiInstance.validateReferral(payload);
          LOG(response, "response");
        } catch (error) {
          onFailure?.();
          onSuccess?.();
        } finally {
          setIsChatLoading(false);
        }
      } else {
        // TODO: remove after development
        onSuccess?.();
      }
    },
    [candidateId, chatId]
  );
};
