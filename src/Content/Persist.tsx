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
    hostname,
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
  //        hostname +  key,
  //         typeof storeItem === "string" ? storeItem : JSON.stringify(storeItem)
  //       );
  //     }
  //   }
  // }, [store]);

  // useEffect(() => {
  //   storeKeys.forEach((k) => {
  //     if (storeWithoutFn[k]) {
  //       sessionStorage.setItem(
  //        hostname +  k,
  //         typeof storeWithoutFn[k] === "string"
  //           ? storeWithoutFn[k]
  //           : JSON.stringify(storeWithoutFn[k])
  //       );
  //     }
  //   });
  // }, [storeWithoutFn, storeKeys]);

  const updateStorage = useCallback((e?: StorageEvent) => {
    localStorage.setItem(hostname + "lastActivity", new Date().toString());

    if (e?.key === hostname + "status" && e.newValue === "close") {
      postMessToParent(EventIds.RefreshChatbot);

      localStorage.clear();
    } else {
      const storedUserData = localStorage.getItem(hostname + "requisitions");
      storedUserData &&
        setRequisitions(JSON.parse(storedUserData) as IRequisitionType[]);
      //   console.log(storedUserData, "storedUserData");

      const storedMessages = localStorage.getItem(hostname + "messages");
      storedMessages &&
        _setMessages(JSON.parse(storedMessages) as ILocalMessage[]);
      //   console.log(storedMessages, "storedMessages");

      const storedCurrentMsgType = localStorage.getItem(
        hostname + "currentMsgType"
      );
      storedCurrentMsgType &&
        setCurrentMsgType(storedCurrentMsgType as CHAT_ACTIONS);
      //   console.log(storedCurrentMsgType, "storedCurrentMsgType");

      const storedUser = localStorage.getItem(hostname + "user");
      storedUser && setUser(JSON.parse(storedUser) as IUser);
      // console.log(storedUser, "storedUser");

      const storedChatScreen = localStorage.getItem(hostname + "chatScreen");
      storedChatScreen && setChatScreen(storedChatScreen as ChatScreens);
      // console.log(storedChatScreen, "storedChatScreen");

      const storedOfferJobs = localStorage.getItem(hostname + "offerJobs");
      storedOfferJobs &&
        setOfferJobs(JSON.parse(storedOfferJobs) as IRequisition[]);
      // console.log(storedOfferJobs, "storedOfferJobs");

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
    viewJob &&
      localStorage.setItem(hostname + "viewJob", JSON.stringify(viewJob));
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

    searchLocations.length &&
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
