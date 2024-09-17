import { useChatMessenger } from "contexts/MessengerContext";
import { FC, useCallback, useEffect } from "react";

import { IUser } from "contexts/types";
import { IRequisitionType } from "services/hooks";
import { ChatScreens, EventIds } from "utils/constants";
import { CHAT_ACTIONS, ILocalMessage, IRequisition } from "utils/types";
import { postMessToParent } from "utils/helpers";
import { useTranslation } from "react-i18next";
import { ReferralSteps } from "components/Chat/ChatComponents/ChatInput/data";

interface IStorePersistProps {
  children?: React.ReactNode | React.ReactNode[];
}

export const StorePersist: FC<IStorePersistProps> = ({ children }) => {
  const {
    messages,
    currentMsgType,
    user,
    chatId,
    candidateId,
    emailAddress,
    firstName,
    lastName,
    refBirth,
    refLastName,
    viewJob,
    employeeId,
    employeeFullName,
    employeeJobCategory,
    employeeLocation,
    searchLocations,
    chatScreen,
    requisitions,
    category,
    firebaseToken,
    offerJobs,
    locations,
    setMessages,
    setCandidateId,
    setUser,
    setCurrentMsgType,
    setEmailAddress,
    setEmployeeFullName,
    setEmployeeId,
    setChatScreen,
    setFirstName,
    setLastName,
    setRefBirth,
    setRefLastName,
    setViewJob,
    setSearchLocations,
    setRequisitions,
    setFirebaseToken,
    setEmployeeLocation,
    setEmployeeJobCategory,
    alertCategories,
    setAlertCategories,
    setOfferJobs,
    setChatId,
    setCategory,
    setLocations,
    hostname,
    currentLanguage,
    setCurrentLanguage,
    isLiveChat,
    setIsLiveChat,
    queueId,
    setQueueId,
    queueChatId,
    setQueueChatId,
    isApplyJobFlow,
    setIsApplyJobFlow,
    isApplyJobSuccessfully,
    setIsApplyJobSuccessfully,
    flowId,
    setFlowId,
    subscriberWorkflowId,
    setSubscriberWorkflowId,
    setReferralStep,
    referralStep,
  } = useChatMessenger();
  const { t } = useTranslation();

  useEffect(() => {
    localStorage.setItem(hostname + "lastActivity", new Date().toString());
  }, [messages.length, currentMsgType]);

  const updateStorage = useCallback((e?: StorageEvent) => {
    if (e?.key === hostname + "status" && e.newValue === "close") {
      postMessToParent(EventIds.RefreshChatbot);

      localStorage.clear();
    } else {
      const storedCurrentLanguage = localStorage.getItem(
        hostname + "currentLanguage"
      );
      storedCurrentLanguage && setCurrentLanguage(storedCurrentLanguage);

      const storedUserData = localStorage.getItem(hostname + "requisitions");
      storedUserData &&
        setRequisitions(JSON.parse(storedUserData) as IRequisitionType[]);

      const storedMessages = localStorage.getItem(hostname + "messages");

      if (storedMessages) {
        const messages = JSON.parse(storedMessages) as ILocalMessage[];

        if (
          messages.length === 1 &&
          messages[0].content.text === t("messages:initialMessage3")
        ) {
          // nothing to do
        } else {
          setMessages(messages);
        }
      }

      const storedCurrentMsgType = localStorage.getItem(
        hostname + "currentMsgType"
      );
      storedCurrentMsgType &&
        setCurrentMsgType(storedCurrentMsgType as CHAT_ACTIONS);

      const storedUser = localStorage.getItem(hostname + "user");
      storedUser && setUser(JSON.parse(storedUser) as IUser);

      const storedChatScreen = localStorage.getItem(hostname + "chatScreen");
      storedChatScreen && setChatScreen(storedChatScreen as ChatScreens);

      const storedOfferJobs = localStorage.getItem(hostname + "offerJobs");
      storedOfferJobs &&
        setOfferJobs(JSON.parse(storedOfferJobs) as IRequisition[]);

      const storedSearchLocations = localStorage.getItem(
        hostname + "searchLocations"
      );
      storedSearchLocations &&
        setSearchLocations(JSON.parse(storedSearchLocations) as string[]);

      const storedCandidateId = localStorage.getItem(hostname + "candidateId");
      storedCandidateId && setCandidateId(Number(storedCandidateId));

      const storedFirebaseToken = localStorage.getItem(
        hostname + "firebaseToken"
      );
      storedFirebaseToken && setFirebaseToken(storedFirebaseToken);

      const storedAlertCategories = localStorage.getItem(
        hostname + "alertCategories"
      );
      storedAlertCategories &&
        setAlertCategories(
          JSON.parse(storedAlertCategories) as string[] | null
        );

      const storedEmployeeId = localStorage.getItem(hostname + "employeeId");
      storedEmployeeId && setEmployeeId(Number(storedEmployeeId));

      const storedEmployeeFullName = localStorage.getItem(
        hostname + "employeeFullName"
      );
      storedEmployeeFullName && setEmployeeFullName(storedEmployeeFullName);

      const storedEmployeeJobCategory = localStorage.getItem(
        hostname + "employeeJobCategory"
      );
      storedEmployeeJobCategory &&
        setEmployeeJobCategory(storedEmployeeJobCategory);

      const storedEmailAddress = localStorage.getItem(
        hostname + "emailAddress"
      );
      storedEmailAddress && setEmailAddress(storedEmailAddress);

      const storedViewJob = localStorage.getItem(hostname + "viewJob");
      storedViewJob && setViewJob(JSON.parse(storedViewJob) as IRequisition);

      const storedEmployeeLocation = localStorage.getItem(
        hostname + "employeeLocation"
      );
      storedEmployeeLocation && setEmployeeLocation(storedEmployeeLocation);

      const storedRefBirth = localStorage.getItem(hostname + "refBirth");
      storedRefBirth && setRefBirth(storedRefBirth);

      const storedRefLastName = localStorage.getItem(hostname + "refLastName");
      storedRefLastName && setRefLastName(storedRefLastName);

      const storedChatId = localStorage.getItem(hostname + "chatId");
      Number(storedChatId) && setChatId(Number(storedChatId));

      const storedCategory = localStorage.getItem(hostname + "category");
      storedCategory && setCategory(storedCategory);

      const storedLocations = localStorage.getItem(hostname + "locations");
      storedLocations && setLocations(JSON.parse(storedLocations));

      const storedFirstName = localStorage.getItem(hostname + "firstName");
      storedFirstName && setFirstName(storedFirstName);
      const storedLastName = localStorage.getItem(hostname + "lastName");
      storedLastName && setLastName(storedLastName);

      const storedIsLiveChat = localStorage.getItem(hostname + "isLiveChat");
      setIsLiveChat(storedIsLiveChat === "true");

      const storedQueueId = localStorage.getItem(hostname + "queueId");
      storedQueueId && setQueueId(+storedQueueId);
      const storedQueueChatId = localStorage.getItem(hostname + "queueChatId");
      storedQueueChatId && setQueueChatId(+storedQueueChatId);

      const storedIsApplyJobFlow = localStorage.getItem(
        hostname + "isApplyJobFlow"
      );
      storedIsApplyJobFlow &&
        setIsApplyJobFlow(storedIsApplyJobFlow === "true");

      const storedSsApplyJobSuccessfully = localStorage.getItem(
        hostname + "isApplyJobSuccessfully"
      );
      storedSsApplyJobSuccessfully &&
        setIsApplyJobSuccessfully(storedSsApplyJobSuccessfully === "true");

      const storedFlowId = localStorage.getItem(hostname + "flowId");
      setFlowId(storedFlowId ? +storedFlowId : undefined);

      const storedSubscriberWorkflowId = localStorage.getItem(
        hostname + "subscriberWorkflowId"
      );
      setSubscriberWorkflowId(
        storedSubscriberWorkflowId ? +storedSubscriberWorkflowId : undefined
      );
      const storedReferralStep = localStorage.getItem(
        hostname + "referralStep"
      );
      if (storedReferralStep) {
        setReferralStep(storedReferralStep as ReferralSteps);
      }
    }
  }, []);

  useEffect(() => {
    messages.length &&
      localStorage.setItem(hostname + "messages", JSON.stringify(messages));
    currentMsgType &&
      localStorage.setItem(hostname + "currentMsgType", currentMsgType);
    user && localStorage.setItem(hostname + "user", JSON.stringify(user));
    emailAddress &&
      localStorage.setItem(hostname + "emailAddress", emailAddress);
    firstName && localStorage.setItem(hostname + "firstName", firstName);
    lastName && localStorage.setItem(hostname + "lastName", lastName);
    refBirth && localStorage.setItem(hostname + "refBirth", refBirth);
    refLastName && localStorage.setItem(hostname + "refLastName", refLastName);
    employeeId &&
      localStorage.setItem(hostname + "employeeId", employeeId.toString());
    employeeFullName &&
      localStorage.setItem(hostname + "employeeFullName", employeeFullName);
    employeeJobCategory &&
      localStorage.setItem(
        hostname + "employeeJobCategory",
        employeeJobCategory
      );
    employeeLocation &&
      localStorage.setItem(hostname + "employeeLocation", employeeLocation);
    chatId && localStorage.setItem(hostname + "chatId", chatId.toString());
    requisitions.length &&
      localStorage.setItem(
        hostname + "requisitions",
        JSON.stringify(requisitions)
      );
    chatScreen && localStorage.setItem(hostname + "chatScreen", chatScreen);
    offerJobs.length &&
      localStorage.setItem(hostname + "offerJobs", JSON.stringify(offerJobs));
    searchLocations?.length &&
      localStorage.setItem(
        hostname + "searchLocations",
        JSON.stringify(searchLocations)
      );
    candidateId &&
      localStorage.setItem(hostname + "candidateId", candidateId.toString());
    firebaseToken &&
      localStorage.setItem(hostname + "firebaseToken", firebaseToken);
    alertCategories &&
      localStorage.setItem(
        hostname + "alertCategories",
        JSON.stringify(alertCategories)
      );
    locations.length &&
      localStorage.setItem(hostname + "locations", JSON.stringify(locations));
    category && localStorage.setItem(hostname + "category", category);

    localStorage.setItem(hostname + "currentLanguage", currentLanguage);

    queueId && localStorage.setItem(hostname + "queueId", queueId?.toString());
    queueChatId &&
      localStorage.setItem(hostname + "queueChatId", queueChatId?.toString());
    localStorage.setItem(hostname + "isLiveChat", isLiveChat?.toString());

    localStorage.setItem(
      hostname + "isApplyJobFlow",
      isApplyJobFlow?.toString()
    );

    localStorage.setItem(
      hostname + "isApplyJobSuccessfully",
      isApplyJobSuccessfully?.toString()
    );

    localStorage.setItem(hostname + "referralStep", referralStep.toString());

    if (viewJob) {
      localStorage.setItem(hostname + "viewJob", JSON.stringify(viewJob));
    } else {
      localStorage.removeItem(hostname + "viewJob");
    }

    if (flowId) {
      localStorage.setItem(hostname + "flowId", flowId.toString());
    } else {
      localStorage.removeItem(hostname + "flowId");
    }

    if (subscriberWorkflowId) {
      localStorage.setItem(
        hostname + "subscriberWorkflowId",
        subscriberWorkflowId.toString()
      );
    } else {
      localStorage.removeItem(hostname + "subscriberWorkflowId");
    }
  }, [
    messages,
    currentMsgType,
    user,
    emailAddress,
    firstName,
    lastName,
    refBirth,
    refLastName,
    viewJob,
    employeeId,
    employeeFullName,
    employeeJobCategory,
    employeeLocation,
    candidateId,
    chatId,
    requisitions,
    chatScreen,
    offerJobs,
    searchLocations,
    firebaseToken,
    alertCategories,
    locations,
    category,
    currentLanguage,
    queueChatId,
    queueId,
    isLiveChat,
    isApplyJobFlow,
    isApplyJobSuccessfully,
    flowId,
    subscriberWorkflowId,
    referralStep,
  ]);

  useEffect(() => {
    setTimeout(() => {
      updateStorage();
    }, 100);
  }, []);

  useEffect(() => {
    window.addEventListener("storage", updateStorage);
    return () => {
      window.removeEventListener("storage", updateStorage);
    };
  }, []);

  return <>{children}</>;
};
