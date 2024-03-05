import { useChatMessenger } from "contexts/MessengerContext";
import { FC, useCallback, useEffect, useMemo } from "react";

import { ChatMessengerContextKeys, IUser } from "contexts/types";
import { IRequisitionType } from "services/hooks";
import { ChatScreens, EventIds } from "utils/constants";
import { CHAT_ACTIONS, ILocalMessage, IRequisition } from "utils/types";
import { LOG, postMessToParent } from "utils/helpers";

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
    alertCategories,
    setAlertCategories,
    setOfferJobs,
    setChatId,
    setCategory,
    setLocations,
  } = useChatMessenger();
  // const store = useChatMessenger();
  // const storeWithoutFn = Object.fromEntries(
  //   Object.entries(store).filter(([key, value]) => typeof value !== "function")
  // );
  // const storeKeys = Object.keys(storeWithoutFn) as ChatMessengerContextKeys[];
  // const storeKeysEnum = useMemo(() => {
  //   const keysEnum: { [key in ChatMessengerContextKeys]?: string } = {};
  //   return storeKeys.forEach((k) => (keysEnum[k] = k));
  // }, [storeKeys]);

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

  const updateStorage = useCallback((e?: StorageEvent) => {
    localStorage.setItem("lastActivity", new Date().toString());

    if (e?.key === "status" && e.newValue === "close") {
      postMessToParent(EventIds.RefreshChatbot);

      localStorage.clear();
    } else {
      const storedUserData = localStorage.getItem("requisitions");
      storedUserData &&
        setRequisitions(JSON.parse(storedUserData) as IRequisitionType[]);
      //   console.log(storedUserData, "storedUserData");

      const storedMessages = localStorage.getItem("messages");
      storedMessages &&
        _setMessages(JSON.parse(storedMessages) as ILocalMessage[]);
      //   console.log(storedMessages, "storedMessages");

      const storedCurrentMsgType = localStorage.getItem("currentMsgType");
      storedCurrentMsgType &&
        setCurrentMsgType(storedCurrentMsgType as CHAT_ACTIONS);
      //   console.log(storedCurrentMsgType, "storedCurrentMsgType");

      const storedUser = localStorage.getItem("user");
      storedUser && setUser(JSON.parse(storedUser) as IUser);
      // console.log(storedUser, "storedUser");

      const storedChatScreen = localStorage.getItem("chatScreen");
      storedChatScreen && setChatScreen(storedChatScreen as ChatScreens);
      // console.log(storedChatScreen, "storedChatScreen");

      const storedOfferJobs = localStorage.getItem("offerJobs");
      storedOfferJobs &&
        setOfferJobs(JSON.parse(storedOfferJobs) as IRequisition[]);
      // console.log(storedOfferJobs, "storedOfferJobs");

      const storedSearchLocations = localStorage.getItem("searchLocations");
      storedSearchLocations &&
        setSearchLocations(JSON.parse(storedSearchLocations) as string[]);

      const storedCandidateId = localStorage.getItem("candidateId");
      storedCandidateId && setCandidateId(Number(storedCandidateId));

      const storedFirebaseToken = localStorage.getItem("firebaseToken");
      storedFirebaseToken && setFirebaseToken(storedFirebaseToken);

      const storedAlertCategories = localStorage.getItem("alertCategories");
      storedAlertCategories &&
        setAlertCategories(
          JSON.parse(storedAlertCategories) as string[] | null
        );

      const storedEmployeeId = localStorage.getItem("employeeId");
      storedEmployeeId && setEmployeeId(Number(storedEmployeeId));

      const storedEmployeeFullName = localStorage.getItem("employeeFullName");
      storedEmployeeFullName && setEmployeeFullName(storedEmployeeFullName);

      const storedEmployeeJobCategory = localStorage.getItem(
        "employeeJobCategory"
      );
      storedEmployeeJobCategory &&
        setEmployeeJobCategory(storedEmployeeJobCategory);

      const storedEmailAddress = localStorage.getItem("emailAddress");
      storedEmailAddress && setEmailAddress(storedEmailAddress);

      const storedViewJob = localStorage.getItem("viewJob");
      storedViewJob && setViewJob(JSON.parse(storedViewJob) as IRequisition);

      const storedEmployeeLocation = localStorage.getItem("employeeLocation");
      storedEmployeeLocation && setEmployeeLocation(storedEmployeeLocation);

      const storedRefBirth = localStorage.getItem("refBirth");
      storedRefBirth && setRefBirth(storedRefBirth);

      const storedRefLastName = localStorage.getItem("refLastName");
      storedRefLastName && setRefLastName(storedRefLastName);

      const storedChatId = localStorage.getItem("chatId");
      Number(storedChatId) && setChatId(Number(storedChatId));

      const storedCategory = localStorage.getItem("category");
      storedCategory && setCategory(storedCategory);

      const storedLocations = localStorage.getItem("locations");
      storedLocations && setLocations(JSON.parse(storedLocations));

      const storedFirstName = localStorage.getItem("firstName");
      storedFirstName && setFirstName(storedFirstName);
      const storedLastName = localStorage.getItem("lastName");
      storedLastName && setLastName(storedLastName);
    }
  }, []);

  useEffect(() => {
    messages.length &&
      localStorage.setItem("messages", JSON.stringify(messages));
    currentMsgType && localStorage.setItem("currentMsgType", currentMsgType);
    user && localStorage.setItem("user", JSON.stringify(user));
    emailAddress && localStorage.setItem("emailAddress", emailAddress);
    firstName && localStorage.setItem("firstName", firstName);
    lastName && localStorage.setItem("lastName", lastName);
    refBirth && localStorage.setItem("refBirth", refBirth);
    refLastName && localStorage.setItem("refLastName", refLastName);
    viewJob && localStorage.setItem("viewJob", JSON.stringify(viewJob));
    employeeId && localStorage.setItem("employeeId", employeeId.toString());
    employeeFullName &&
      localStorage.setItem("employeeFullName", employeeFullName);
    employeeJobCategory &&
      localStorage.setItem("employeeJobCategory", employeeJobCategory);
    employeeLocation &&
      localStorage.setItem("employeeLocation", employeeLocation);
    chatId && localStorage.setItem("chatId", chatId.toString());

    requisitions.length &&
      localStorage.setItem("requisitions", JSON.stringify(requisitions));
    chatScreen && localStorage.setItem("chatScreen", chatScreen);

    offerJobs.length &&
      localStorage.setItem("offerJobs", JSON.stringify(offerJobs));

    searchLocations.length &&
      localStorage.setItem("searchLocations", JSON.stringify(searchLocations));

    candidateId && localStorage.setItem("candidateId", candidateId.toString());

    firebaseToken && localStorage.setItem("firebaseToken", firebaseToken);

    alertCategories &&
      localStorage.setItem("alertCategories", JSON.stringify(alertCategories));

    locations.length &&
      localStorage.setItem("locations", JSON.stringify(locations));

    category && localStorage.setItem("category", category);
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
      updateStorage();
    }, 100);
  }, []);

  useEffect(() => {
    window.addEventListener("storage", updateStorage);
    return () => {
      window.removeEventListener("storage", updateStorage);
    };
  }, []);

  // LOG(chatId, "chatId PERSIST", undefined, undefined, true);
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
