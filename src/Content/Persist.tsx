import { useChatMessenger } from "contexts/MessengerContext";
import { FC, useEffect, useMemo } from "react";

import { ChatMessengerContextKeys, IUser } from "contexts/types";
import { IRequisitionType } from "services/hooks";
import { ChatScreens } from "utils/constants";
import { LOG } from "utils/helpers";
import { CHAT_ACTIONS, ILocalMessage, IRequisition } from "utils/types";

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
    isCandidateWithEmail,
    isAnonym,
    isApplyJobFlow,
    chatScreen,
    requisitions,
    category,
    error,
    firebaseToken,
    offerJobs,
    isAuthInFirebase,
    isChatInputAvailable,
    locations,

    _setMessages,

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
    setIsApplyJobFlow,
    setIsCandidateAnonym,
    setSearchLocations,
    setRequisitions,
    setJobPositions,
    setFirebaseToken,
    setEmployeeLocation,
    setEmployeeJobCategory,
    setError,
    alertCategories,
    setAlertCategories,
    setOfferJobs,
    setChatId,
    setCategory,
    setLocations,
  } = useChatMessenger();
  const store = useChatMessenger();

  const storeWithoutFn = Object.fromEntries(
    Object.entries(store).filter(([key, value]) => typeof value !== "function")
  );
  const storeKeys = Object.keys(storeWithoutFn) as ChatMessengerContextKeys[];

  const storeKeysEnum = useMemo(() => {
    const keysEnum: { [key in ChatMessengerContextKeys]?: string } = {};
    return storeKeys.forEach((k) => (keysEnum[k] = k));
  }, [storeKeys]);

  // useEffect(() => {
  //   for (const key in storeWithoutFn) {
  //     const storeItem = store[key as ChatMessengerContextKeys];
  //     if (storeItem) {
  //       sessionStorage.setItem(
  //         key,
  //         typeof storeItem === "string" ? storeItem : JSON.stringify(storeItem)
  //       );
  //     }
  //   }
  // }, [store]);

  // useEffect(() => {
  //   storeKeys.forEach((k) => {
  //     if (storeWithoutFn[k]) {
  //       sessionStorage.setItem(
  //         k,
  //         typeof storeWithoutFn[k] === "string"
  //           ? storeWithoutFn[k]
  //           : JSON.stringify(storeWithoutFn[k])
  //       );
  //     }
  //   });
  // }, [storeWithoutFn, storeKeys]);

  useEffect(() => {
    messages.length &&
      sessionStorage.setItem("messages", JSON.stringify(messages));
    currentMsgType && sessionStorage.setItem("currentMsgType", currentMsgType);
    user && sessionStorage.setItem("user", JSON.stringify(user));
    emailAddress && sessionStorage.setItem("emailAddress", emailAddress);
    firstName && sessionStorage.setItem("firstName", firstName);
    lastName && sessionStorage.setItem("lastName", lastName);
    refBirth && sessionStorage.setItem("refBirth", refBirth);
    refLastName && sessionStorage.setItem("refLastName", refLastName);
    viewJob && sessionStorage.setItem("viewJob", JSON.stringify(viewJob));
    employeeId && sessionStorage.setItem("employeeId", employeeId.toString());
    employeeFullName &&
      sessionStorage.setItem("employeeFullName", employeeFullName);
    employeeJobCategory &&
      sessionStorage.setItem("employeeJobCategory", employeeJobCategory);
    employeeLocation &&
      sessionStorage.setItem("employeeLocation", employeeLocation);
    chatId && sessionStorage.setItem("chatId", chatId.toString());

    requisitions.length &&
      sessionStorage.setItem("requisitions", JSON.stringify(requisitions));
    chatScreen && sessionStorage.setItem("chatScreen", chatScreen);

    offerJobs.length &&
      sessionStorage.setItem("offerJobs", JSON.stringify(offerJobs));

    searchLocations.length &&
      sessionStorage.setItem(
        "searchLocations",
        JSON.stringify(searchLocations)
      );

    candidateId &&
      sessionStorage.setItem("candidateId", candidateId.toString());

    firebaseToken && sessionStorage.setItem("firebaseToken", firebaseToken);

    alertCategories &&
      sessionStorage.setItem(
        "alertCategories",
        JSON.stringify(alertCategories)
      );

    locations.length &&
      sessionStorage.setItem("locations", JSON.stringify(locations));

    category && sessionStorage.setItem("category", category);
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
  ]);

  useEffect(() => {
    setTimeout(() => {
      const storedUserData = sessionStorage.getItem("requisitions");
      storedUserData &&
        setRequisitions(JSON.parse(storedUserData) as IRequisitionType[]);
      //   console.log(storedUserData, "storedUserData");

      const storedMessages = sessionStorage.getItem("messages");
      storedMessages &&
        _setMessages(JSON.parse(storedMessages) as ILocalMessage[]);
      //   console.log(storedMessages, "storedMessages");

      const storedCurrentMsgType = sessionStorage.getItem("currentMsgType");
      storedCurrentMsgType &&
        setCurrentMsgType(storedCurrentMsgType as CHAT_ACTIONS);
      //   console.log(storedCurrentMsgType, "storedCurrentMsgType");

      const storedUser = sessionStorage.getItem("user");
      storedUser && setUser(JSON.parse(storedUser) as IUser);
      // console.log(storedUser, "storedUser");

      const storedChatScreen = sessionStorage.getItem("chatScreen");
      storedChatScreen && setChatScreen(storedChatScreen as ChatScreens);
      // console.log(storedChatScreen, "storedChatScreen");

      const storedOfferJobs = sessionStorage.getItem("offerJobs");
      storedOfferJobs &&
        setOfferJobs(JSON.parse(storedOfferJobs) as IRequisition[]);
      // console.log(storedOfferJobs, "storedOfferJobs");

      const storedSearchLocations = sessionStorage.getItem("searchLocations");
      storedSearchLocations &&
        setSearchLocations(JSON.parse(storedSearchLocations) as string[]);

      const storedCandidateId = sessionStorage.getItem("candidateId");
      storedCandidateId && setCandidateId(Number(storedCandidateId));

      const storedFirebaseToken = sessionStorage.getItem("firebaseToken");
      storedFirebaseToken && setFirebaseToken(storedFirebaseToken);

      const storedAlertCategories = sessionStorage.getItem("alertCategories");
      storedAlertCategories &&
        setAlertCategories(
          JSON.parse(storedAlertCategories) as string[] | null
        );

      const storedEmployeeId = sessionStorage.getItem("employeeId");
      storedEmployeeId && setEmployeeId(Number(storedEmployeeId));

      const storedEmployeeFullName = sessionStorage.getItem("employeeFullName");
      storedEmployeeFullName && setEmployeeFullName(storedEmployeeFullName);

      const storedEmployeeJobCategory = sessionStorage.getItem(
        "employeeJobCategory"
      );
      storedEmployeeJobCategory &&
        setEmployeeJobCategory(storedEmployeeJobCategory);

      const storedEmailAddress = sessionStorage.getItem("emailAddress");
      storedEmailAddress && setEmailAddress(storedEmailAddress);

      const storedViewJob = sessionStorage.getItem("viewJob");
      storedViewJob && setViewJob(JSON.parse(storedViewJob) as IRequisition);

      const storedEmployeeLocation = sessionStorage.getItem("employeeLocation");
      storedEmployeeLocation && setEmployeeLocation(storedEmployeeLocation);

      const storedRefBirth = sessionStorage.getItem("refBirth");
      storedRefBirth && setRefBirth(storedRefBirth);

      const storedRefLastName = sessionStorage.getItem("refLastName");
      storedRefLastName && setRefLastName(storedRefLastName);

      const storedChatId = sessionStorage.getItem("chatId");
      Number(storedChatId) && setChatId(Number(storedChatId));

      const storedCategory = sessionStorage.getItem("category");
      storedCategory && setCategory(storedCategory);

      const storedLocations = sessionStorage.getItem("locations");
      storedLocations && setLocations(JSON.parse(storedLocations));

      const storedFirstName = sessionStorage.getItem("firstName");
      storedFirstName && setFirstName(storedFirstName);
      const storedLastName = sessionStorage.getItem("lastName");
      storedLastName && setLastName(storedLastName);
    }, 100);
  }, []);

  LOG(chatId, "chatId PERSIST", undefined, undefined, true);
  // LOG(candidateId, "candidateId", undefined, undefined, true);
  // LOG(currentMsgType, "currentMsgType", undefined, undefined, true);
  // LOG(employeeId, "employeeId", undefined, undefined, true);
  // LOG(requisitions, "requisitions", undefined, undefined, true);
  // LOG(chatScreen, "chatScreen", undefined, undefined, true);
  // LOG(user, "user", undefined, undefined, true);
  // LOG(storeKeysEnum, "storeKeysEnum", undefined, undefined, true);
  // LOG(storeWithoutFn, "storeWithoutFn", undefined, undefined, true);

  return <>{children}</>;
};
