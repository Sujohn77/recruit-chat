/* eslint-disable react-hooks/exhaustive-deps */
import { useFileUploadContext } from "contexts/FileUploadContext";
import { useChatMessenger } from "contexts/MessengerContext";
import React, {
  FC,
  useState,
  useEffect,
  ChangeEvent,
  useCallback,
  useMemo,
} from "react";
import { useTranslation } from "react-i18next";
import uniq from "lodash/uniq";
import isNaN from "lodash/isNaN";
import uniqBy from "lodash/uniqBy";
import { ApiResponse } from "apisauce";
import { apiInstance } from "services/api";

import "../../../../services/firebase/config";
import * as S from "./styles";
import {
  ReferralSteps,
  getAlertJobMessage,
  getReferralQuestion,
  getReferralResponseMess,
  getValidationRefResponse,
} from "./data";
import { ICONS } from "assets";
import { useIsTabActive } from "services/hooks";
import {
  MessageOptionTypes,
  MessageStatuses,
  Status,
  TextFieldTypes,
  TryAgainTypes,
} from "utils/constants";
import {
  createTextMess,
  generateLocalId,
  getInputType,
  getMatchedItem,
  getMatchedItems,
  getNextActionType,
  isValidNumber,
  validateEmail,
  validateEmailOrPhone,
} from "utils/helpers";
import {
  ButtonsOptions,
  CHAT_ACTIONS,
  ILocalMessage,
  MessageType,
} from "utils/types";
import { COLORS } from "utils/colors";
import { useFirebaseSignIn, useTextField } from "utils/hooks";
import {
  ISubmitReferral,
  useConnectToLiveChat,
  useSubmitReferral,
  useValidateReferral,
} from "contexts/hooks";
import { MultiSelectInput, Autocomplete, BurgerMenu } from "components/Layout";
import {
  ISendTranscriptResponse,
  IUpdateOrMergeCandidateRequest,
  IUpdateOrMergeCandidateResponse,
} from "services/types";

interface IChatInputProps {
  setHeight: React.Dispatch<React.SetStateAction<number>>;
  setSelectedReferralJobId: React.Dispatch<
    React.SetStateAction<number | undefined>
  >;
  selectedReferralJobId?: number;
}

const INPUT_KEY = "input-value";

export const ChatInput: FC<IChatInputProps> = ({
  setHeight,
  setSelectedReferralJobId,
  selectedReferralJobId,
}) => {
  useFirebaseSignIn();
  const { t } = useTranslation();
  const { file, setNotification, showJobTitles } = useFileUploadContext();
  const {
    dispatch,
    searchLocations,
    status,
    currentMsgType,
    setError,
    error,
    requisitions,
    chooseButtonOption,
    isChatLoading,
    isApplyJobFlow,
    sendNewMessage,
    setSearchLocations,
    setMessages,
    setCurrentMsgType,
    messages,
    emailAddress,
    createJobAlert,
    clearJobFilters,
    isChatInputAvailable,
    setEmployeeId,
    referralCompanyName,
    setRefBirth,
    setRefLastName,
    refLastName,
    employeeJobCategory,
    setIsChatLoading,
    offerJobs,
    firstName: userFName,
    lastName: userLName,
    setFirstName: setFName,
    setLastName: setLName,
    employeeId,
    jobSourceID,
    referralStep,
    setReferralStep,
    hostname,
    currentLanguage,
    chatId,
    chatQueueId,
    candidateId,
    setCandidateId,
    setIsCandidateAnonym,
    setIsLiveChat,
    queueId,
    setIsCandidateWithEmail,
    setEmailAddress,
  } = useChatMessenger();
  const onValidateReferral = useValidateReferral();
  const onSubmitReferral = useSubmitReferral();
  const isTabActive = useIsTabActive();
  const connectToLiveChat = useConnectToLiveChat(chatId, chatQueueId);

  // ---------------------- State --------------------- //
  const { searchItems, placeHolder, headerName, subHeaderName } =
    useTextField();

  const [isOpenBurgerMenu, setIsOpenBurgerMenu] = useState(false);
  // user
  const [userFirstName, setUserFirstName] = useState(userFName);
  const [userLastName, setUserLastName] = useState(userLName);
  const [userEmail, setUserEmail] = useState(emailAddress);

  const [messageValue, setMessageValue] = useState<string | null>(
    localStorage.getItem(hostname + INPUT_KEY)
  );
  const [inputValues, setInputValues] = useState<string[]>([]);
  const [isShowResults, setIsShowResults] = useState(false);
  // Referral
  const [refEmployeeId, setRefEmployeeId] = useState("");
  // user details of the person they want to refer:
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [refError, setRefError] = useState("");

  const inputType = getInputType(currentMsgType);

  useEffect(() => {
    referralStep &&
      localStorage.setItem(hostname + "referralStep", referralStep.toString());
    refEmployeeId &&
      localStorage.setItem(hostname + "refEmployeeId", refEmployeeId);
    firstName && localStorage.setItem(hostname + "firstName", firstName);
    lastName && localStorage.setItem(hostname + "lastName", lastName);
    email && localStorage.setItem(hostname + "email", email);
    phone && localStorage.setItem(hostname + "phone", phone);
  }, [referralStep, refEmployeeId]);

  useEffect(() => {
    const storedReferralStep = localStorage.getItem(hostname + "referralStep");
    if (storedReferralStep) {
      setReferralStep(Number(storedReferralStep));
    }

    setRefEmployeeId(localStorage.getItem(hostname + "refEmployeeId") || "");
    setFirstName(localStorage.getItem(hostname + "firstName") || "");
    setLastName(localStorage.getItem(hostname + "lastName") || "");
    setEmail(localStorage.getItem(hostname + "email") || "");
    setPhone(localStorage.getItem(hostname + "phone") || "");
  }, []);

  useEffect(() => {
    typeof messageValue === "string" &&
      localStorage.setItem(hostname + INPUT_KEY, messageValue);
  }, [messageValue]);

  useEffect(() => {
    if (isTabActive) {
      const storedDraftMess = localStorage.getItem(hostname + INPUT_KEY);
      typeof storedDraftMess === "string" && setMessageValue(storedDraftMess);
    }
  }, [isTabActive]);

  const { matchedPart, matchedItems } = useMemo(
    () =>
      getMatchedItems({
        searchStr: messageValue,
        searchItems,
      }),
    [searchItems, messageValue]
  );

  const isWriteAccess =
    file ||
    (inputType === TextFieldTypes.Select && messageValue) ||
    !!inputValues.length ||
    (referralStep === ReferralSteps.UserMobileNumber && isValidNumber(phone));

  const marginTop =
    status !== Status.PENDING && inputType === TextFieldTypes.MultiSelect
      ? "-30px"
      : "0px";

  // ------------------------------------------------- //

  useEffect(() => {
    showJobTitles && setIsShowResults(showJobTitles);
  }, [showJobTitles]);

  useEffect(() => {
    if (
      (currentMsgType === CHAT_ACTIONS.SET_CATEGORY ||
        currentMsgType === CHAT_ACTIONS.SET_ALERT_JOB_LOCATIONS) &&
      (!!messageValue || !!file)
    ) {
      setIsShowResults(true);
    }

    if (currentMsgType === CHAT_ACTIONS.MAKE_REFERRAL_FRIEND) {
      setReferralStep(ReferralSteps.UserFirstName);
    }
  }, [currentMsgType]);

  useEffect(() => {
    if (currentMsgType === CHAT_ACTIONS.SEND_LOCATIONS) {
      setInputValues([]);
    }
  }, [currentMsgType]);

  // Callbacks
  const sendMessage = useCallback(
    async (message: string | null) => {
      const matchedSearchItem = getMatchedItem(message, searchItems);
      const isSelectedValues =
        matchedSearchItem || inputValues.length || message;
      const actionType =
        isSelectedValues && currentMsgType
          ? getNextActionType(currentMsgType)
          : CHAT_ACTIONS.NO_MATCH;

      const createAlertHandle = (successText: string) => {
        clearJobFilters();
        createJobAlert({
          email: emailAddress || message!,
          type: CHAT_ACTIONS.SET_ALERT_EMAIL,
          successText,
        });
        setCurrentMsgType(CHAT_ACTIONS.SET_ALERT_EMAIL);
      };

      if (inputType === TextFieldTypes.MultiSelect && actionType) {
        const items = !!matchedSearchItem
          ? uniq(inputValues)
          : uniq(inputValues.length ? inputValues : [message!]);

        if (
          actionType === CHAT_ACTIONS.SET_ALERT_JOB_LOCATIONS &&
          currentMsgType === CHAT_ACTIONS.SET_ALERT_JOB_LOCATIONS
        ) {
          const alertEmailMess: ILocalMessage = getAlertJobMessage(
            userFName || userFirstName,
            userLName || userLastName,
            emailAddress
          );

          const messWithLocations: ILocalMessage = {
            isOwn: true,
            localId: generateLocalId(),
            content: {
              subType: MessageType.TEXT,
              text: matchedSearchItem ? items.join("\r") : message!,
              locations: items.length ? items : [message || ""],
              i18n: "",
              i18nProps: null,
            },
            _id: generateLocalId(),
          };

          setSearchLocations(items.length ? items : [message!]);
          setInputValues([]);

          if (!emailAddress) {
            setMessages((prevMessages) => [
              alertEmailMess,
              messWithLocations,
              ...prevMessages,
            ]);

            if (!userFName) {
              setCurrentMsgType(CHAT_ACTIONS.SET_USER_FIRST_NAME);
            } else if (!userLName) {
              setCurrentMsgType(CHAT_ACTIONS.SET_USER_LAST_NAME);
            } else if (!userEmail) {
              setCurrentMsgType(CHAT_ACTIONS.SET_USER_EMAIL);
            }
          } else {
            setMessages((prevMessages) => [messWithLocations, ...prevMessages]);
            createAlertHandle(t("messages:emailAlreadyProvided"));
          }
        } else {
          if (actionType === CHAT_ACTIONS.SEND_LOCATIONS) {
            setSearchLocations(items);
          }

          dispatch({
            type: actionType,
            payload: { items: items.length ? items : [message] },
            i18nProps: null,
          });
        }
      } else {
        const currentMess = createTextMess({
          isOwn: true,
          text: message || "",
        });

        if (
          (currentMsgType === CHAT_ACTIONS.MAKE_REFERRAL ||
            currentMsgType === CHAT_ACTIONS.MAKE_REFERRAL_FRIEND) &&
          (message || phone)
        ) {
          referralHandle(message || phone);
        } else if (currentMsgType === CHAT_ACTIONS.SET_USER_FIRST_NAME) {
          setUserFirstName(message!);
          setMessages((prev) => [
            getAlertJobMessage(message!, userLName, emailAddress),
            currentMess,
            ...prev,
          ]);
          setCurrentMsgType(CHAT_ACTIONS.SET_USER_LAST_NAME);
        } else if (currentMsgType === CHAT_ACTIONS.SET_USER_LAST_NAME) {
          setUserLastName(message!);
          setMessages((prev) => [
            getAlertJobMessage(
              userFName || userFirstName,
              message!,
              emailAddress
            ),
            currentMess,
            ...prev,
          ]);
          setCurrentMsgType(CHAT_ACTIONS.SET_USER_EMAIL);
        } else if (currentMsgType === CHAT_ACTIONS.SET_USER_EMAIL) {
          setMessages((prev) => [currentMess, ...prev]);
          setIsChatLoading(true);

          setTimeout(() => {
            setIsChatLoading(false);

            const emailError = validateEmail(message!);
            if (emailError) {
              const errorEmailMessage = createTextMess({
                isError: true,
                text: emailError,
              });
              setMessages((prev) => [errorEmailMessage, ...prev]);
            } else {
              setUserEmail(message!);
              // _setMessages((prev) => [message, ...prev]);
              dispatch({
                type: CHAT_ACTIONS.UPDATE_OR_MERGE_CANDIDATE,
                payload: {
                  candidateData: {
                    emailAddress: emailAddress || message!,
                    firstName: userFName || userFirstName,
                    lastName: userLName || userLastName,
                    callback: () => {
                      createAlertHandle(t("messages:successSubscribed"));
                    },
                  },
                },
                i18nProps: null,
              });
            }
          }, 500);
        } else {
          dispatch({
            type: !currentMsgType ? CHAT_ACTIONS.NO_MATCH : currentMsgType,
            payload: { item: message },
            i18nProps: null,
          });
        }
      }

      setMessageValue("");
    },
    [
      currentMsgType,
      matchedItems.length,
      searchLocations.length,
      inputValues,
      referralStep,
      dispatch,
      phone,
      emailAddress,
      userFirstName,
      userLastName,
      userEmail,
      chatId,
    ]
  );

  const referralHandle = (draftMessage: string) => {
    const mess = createTextMess({ isOwn: true, text: draftMessage });

    switch (referralStep) {
      case ReferralSteps.EmployeeId:
        setRefEmployeeId(draftMessage);
        setMessages((prevMessages) => [mess, ...prevMessages]);
        setIsChatLoading(true);
        setTimeout(() => {
          const enterNamaMess = getReferralQuestion(ReferralSteps.EmployeeId);
          setIsChatLoading(false);
          setMessages((prevMessages) => [enterNamaMess, ...prevMessages]);
        }, 500);
        setReferralStep(ReferralSteps.ReferralLastName);

        break;
      case ReferralSteps.ReferralLastName:
        draftMessage?.trim() && setRefLastName(draftMessage);

        setMessages((prevMessages) => [mess, ...prevMessages]);
        setIsChatLoading(true);
        setTimeout(() => {
          const enterBirthMess = getReferralQuestion(
            ReferralSteps.ReferralLastName
          );
          setIsChatLoading(false);
          setMessages((prevMessages) => [enterBirthMess, ...prevMessages]);
        }, 500);
        setReferralStep(ReferralSteps.ReferralBirth);

        break;
      case ReferralSteps.ReferralBirth:
        const onSuccessCallback = (employeeFullName: string) => {
          const resMess = getValidationRefResponse(
            employeeJobCategory,
            employeeFullName || refLastName,
            true
          );
          setMessages((prevMessages) => [resMess, ...prevMessages]);

          const trimmedEmployeeID = refEmployeeId.trim();
          trimmedEmployeeID &&
            !isNaN(trimmedEmployeeID) &&
            setEmployeeId(+trimmedEmployeeID);
          setReferralStep(ReferralSteps.UserFirstName);
        };

        const onFailure = () => {
          const tryAgain = createTextMess({
            subType: MessageType.TRY_AGAIN,
            text: t("errors:referral_validation"),
            tryAgainType: TryAgainTypes.Validate,
            i18n: "errors:referral_validation",
          });

          setMessages((prevMessages) => [tryAgain, ...prevMessages]);
        };

        setMessages((prevMessages) => [mess, ...prevMessages]);
        setRefBirth(draftMessage);
        onValidateReferral(
          {
            lastName: refLastName,
            yeanOrBirth: draftMessage,
            employeeId: +refEmployeeId,
          },
          onSuccessCallback,
          onFailure
        );
        break;
      case ReferralSteps.UserFirstName:
        draftMessage?.trim() && setFirstName(draftMessage);

        setMessages((prevMessages) => [mess, ...prevMessages]);
        setIsChatLoading(true);
        setTimeout(() => {
          const userLastNameMess = getReferralQuestion(
            ReferralSteps.UserLastName
          );

          setIsChatLoading(false);
          setMessages((prevMessages) => [userLastNameMess, ...prevMessages]);
        }, 500);
        setReferralStep(ReferralSteps.UserLastName);

        break;
      case ReferralSteps.UserLastName:
        draftMessage?.trim() && setLastName(draftMessage);

        setMessages((prevMessages) => [mess, ...prevMessages]);
        setIsChatLoading(true);
        setTimeout(() => {
          const userEmailMess = getReferralQuestion(ReferralSteps.UserEmail);
          setIsChatLoading(false);
          setMessages((prevMessages) => [userEmailMess, ...prevMessages]);
        }, 500);
        setReferralStep(ReferralSteps.UserEmail);

        break;
      case ReferralSteps.UserEmail:
        setMessages((prevMessages) => [mess, ...prevMessages]);
        setIsChatLoading(true);

        setTimeout(() => {
          const emailError = validateEmail(draftMessage);

          if (emailError) {
            const errorMessage = createTextMess({
              isError: true,
              text: emailError,
            });
            setMessages((prev) => [errorMessage, ...prev]);
          } else {
            setEmail(draftMessage.trim());

            const userConfirmMess = getReferralQuestion(
              ReferralSteps.UserConfirmationEmail
            );
            setMessages((prevMessages) => [userConfirmMess, ...prevMessages]);
            setReferralStep(ReferralSteps.UserConfirmationEmail);
          }
          setIsChatLoading(false);
        }, 500);

        break;
      case ReferralSteps.UserConfirmationEmail:
        if (email === draftMessage.trim()) {
          setMessages((prevMessages) => [mess, ...prevMessages]);
          setIsChatLoading(true);

          setTimeout(() => {
            const userMobileMess = getReferralQuestion(
              ReferralSteps.UserMobileNumber
            );
            setIsChatLoading(false);
            setMessages((prevMessages) => [userMobileMess, ...prevMessages]);
          }, 500);
          setReferralStep(ReferralSteps.UserMobileNumber);
        } else {
          const errorMessage = createTextMess({
            isError: true,
            text: t("errors:not_match"),
            i18n: "errors:not_match",
          });
          setMessages((prev) => [errorMessage, ...prev]);
        }
        break;
      case ReferralSteps.UserMobileNumber:
        setMessages((prevMessages) => [mess, ...prevMessages]);
        const isValid = isValidNumber(phone);

        if (isValid) {
          const payload: ISubmitReferral = {
            referralSourceTypeId: 3,
            referredCandidate: {
              emailAddress: email,
              firstName,
              lastName,
              mobileNumber: phone,
            },
            jobId: selectedReferralJobId,
            jobSourceID: selectedReferralJobId ? jobSourceID : undefined,
          };
          const onSuccessSubmit = (previouslyReferredState: number) => {
            const jobOffer = offerJobs.find(
              (o) => o.id.toString() === selectedReferralJobId?.toString()
            );

            const isOk = previouslyReferredState === 0;

            const question: ILocalMessage = {
              isOwn: false,
              localId: generateLocalId(),
              _id: generateLocalId(),
              content: {
                subType: MessageType.TEXT,
                text: `${getReferralResponseMess(
                  previouslyReferredState,
                  firstName,
                  lastName,
                  referralCompanyName
                )}  \n  
                  ${
                    jobOffer?.title
                      ? t("referral:refer_someone_else_to_job", {
                          jobName: jobOffer.title,
                        })
                      : t("referral:refer_someone_else_to", {
                          name: referralCompanyName,
                        })
                  }
                `,
                // TODO: test
                i18n: getReferralResponseMess(
                  previouslyReferredState,
                  firstName,
                  lastName,
                  referralCompanyName,
                  true
                ),
                i18nProps: {
                  refFirstName: firstName,
                  refLastName,
                  refCompanyName: referralCompanyName,
                },
              },
              optionList: {
                type: MessageOptionTypes.Referral,
                isActive: true,
                status: MessageStatuses[isOk ? "ok" : "warning"],
                options: [
                  {
                    id: 1,
                    itemId: 1,
                    isSelected: false,
                    name: t("labels:yes"),
                    text: t("labels:yes"),
                    i18nPhrase: "labels:yes",
                  },
                  {
                    id: 2,
                    itemId: 2,
                    isSelected: false,
                    name: t("labels:no"),
                    text: t("labels:no"),
                    i18nPhrase: "labels:no",
                  },
                ],
              },
              background: isOk ? COLORS.HAWKES_BLUE : undefined,
              border: `1px solid ${COLORS[isOk ? "ONAHAU" : "BEAUTY_BUSH"]}`,
              jobId: jobOffer?.id,
            };
            setMessages((prevMessages) => [question, ...prevMessages]);
            setCurrentMsgType(CHAT_ACTIONS.REFERRAL_IS_SUBMITTED);
            setReferralStep(ReferralSteps.UserFirstName);
            setPhone("");
          };
          const onFailureSubmit = () => {
            const errorMess = createTextMess({
              subType: MessageType.TRY_AGAIN,
              text: t("errors:submit_referral_error"),
              tryAgainType: TryAgainTypes.SendReferral,
              i18n: "errors:submit_referral_error",
            });
            setMessages((prevMessages) => [errorMess, ...prevMessages]);
          };

          onSubmitReferral(payload, onSuccessSubmit, onFailureSubmit);
          cleanInputState();
        } else {
          const errorMessage = createTextMess({
            isError: true,
            text: t("errors:invalid_phone_number"),
            i18n: "errors:invalid_phone_number",
          });
          setMessages((prev) => [errorMessage, ...prev]);
        }

        break;

      default:
        break;
    }
  };

  useEffect(() => {
    const keyDownHandler = (event: KeyboardEvent) => {
      if ((messageValue || phone) && event.key === "Enter" && isWriteAccess) {
        event.preventDefault();
        onSendMessageHandler();
      }
    };
    document.addEventListener("keydown", keyDownHandler);

    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, [messageValue, sendMessage, isWriteAccess]);

  // Callbacks
  const onChangeCategory = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setError(null);
    setRefError("");

    if (error) {
      if (currentMsgType === CHAT_ACTIONS.GET_USER_NAME) {
        const isPhone = currentMsgType === CHAT_ACTIONS.GET_USER_NAME;
        const isError = isPhone
          ? validateEmailOrPhone(value)
          : validateEmail(value);
        !isError.trim() && setError(null);
      }
    }

    setMessageValue(value);
    setNotification(null);
  };

  const onChangeAutocomplete = (
    e: ChangeEvent<HTMLInputElement>,
    values: string[]
  ) => {
    setRefError("");
    const newLocation = e?.currentTarget?.textContent;
    let newValues = values.filter(Boolean);

    if (newLocation) {
      const lastLocation = newValues[newValues.length - 1];
      const numberOfCharacters = newLocation.length - lastLocation?.length;

      // it needs to be because of a bug. If you enter a value in the search box and select a location,
      // the location will be listed without the characters entered in the input box
      if (newLocation?.substring(numberOfCharacters) === lastLocation) {
        if (newValues.length > 1) {
          newValues = [
            ...newValues.slice(0, newValues.length - 1),
            newLocation,
          ];
        } else {
          newValues = [];
        }
      }

      if (!newValues.some((location) => location === newLocation))
        newValues = [...newValues, newLocation];
    }

    if (currentMsgType) {
      setInputValues(uniq(newValues));
      setMessageValue("");
      if (currentMsgType !== CHAT_ACTIONS.SET_ALERT_JOB_LOCATIONS) {
        dispatch({
          type: currentMsgType,
          payload: { items: uniq(newValues) },
          i18nProps: null,
        });
      } else {
        setSearchLocations(uniq(newValues));
      }
    }
  };

  const onSendMessageHandler = async () => {
    // LOG(isLiveChat, "isLiveChat", undefined, undefined, true);
    if (!isChatLoading) {
      if (messageValue?.trim() === "can i speak to someone?") {
        setMessageValue("");
        setIsOpenBurgerMenu(false);
        connectToLiveChat();
        return;
      } else if (currentMsgType === CHAT_ACTIONS.LIVE_CHAT && messageValue) {
        if (!userFName) {
          setFName(messageValue.trim());
          setUserFirstName(messageValue.trim());
          setMessages((prev) => [
            createTextMess({ isOwn: true, text: messageValue }),
            ...prev,
          ]);
          setMessageValue("");
          setIsChatLoading(true);
          setTimeout(() => {
            setIsChatLoading(false);
            setMessages((prevMessages) => [
              createTextMess({
                text: t("messages:provide_lastname"),
                i18n: "messages:provide_lastname",
              }),
              ...prevMessages,
            ]);
          }, 500);
          return;
        } else if (!userLName) {
          setLName(messageValue.trim());
          setUserLastName(messageValue.trim());
          setMessages((prev) => [
            createTextMess({
              isOwn: true,
              text: messageValue,
            }),
            ...prev,
          ]);
          setMessageValue("");

          try {
            const candidateData: IUpdateOrMergeCandidateRequest = {
              firstName: userFName,
              lastName: messageValue.trim(),
              candidateId: candidateId!,
              chatId: chatId!,
              skipEmailCheck: true,
              queueId: queueId || undefined,
            };
            const candidateRes: ApiResponse<IUpdateOrMergeCandidateResponse> =
              await apiInstance.updateOrMargeCandidate(candidateData);

            const res = candidateRes?.data;

            if (
              res?.success &&
              res?.updateChatBotCandidateId &&
              res?.candidateId
            ) {
              setCandidateId(res.candidateId);
              setIsCandidateAnonym(false);
            }
            if (res?.success) {
              setIsCandidateWithEmail(true);
              setMessages((prev) => [
                createTextMess({
                  text: `Thank you ${firstName}. Please wait while we connect you...`,
                }),
                ...prev,
              ]);
            }
          } catch (error) {
          } finally {
            setIsLiveChat(true);
          }
          return;
        } else {
          await sendNewMessage({
            message: messageValue,
            isLiveChat: true,
          });
        }
        setMessageValue("");
      } else if (currentMsgType === CHAT_ACTIONS.GET_EMAIL && messageValue) {
        const emailError = validateEmail(messageValue);
        setMessages((prevMessages) => [
          createTextMess({ text: messageValue, isOwn: true }),
          ...prevMessages,
        ]);
        setIsChatLoading(true);
        setMessageValue("");

        if (emailError) {
          setTimeout(async () => {
            setIsChatLoading(false);
            const errorMessage = createTextMess({
              text: emailError,
              isError: true,
            });
            setMessages((prev) => [errorMessage, ...prev]);
          }, 300);
        } else {
          setUserEmail(messageValue.trim());
          const candidatePayload: IUpdateOrMergeCandidateRequest = {
            firstName: userFName,
            lastName: userLName,
            emailAddress: messageValue.trim(),
            candidateId: candidateId!,
            chatId: chatId!,
            skipEmailCheck: false,
            queueId: chatQueueId!,
          };

          try {
            const candidateRes: ApiResponse<IUpdateOrMergeCandidateResponse> =
              await apiInstance.updateOrMargeCandidate(candidatePayload);

            const res = candidateRes?.data;

            if (
              res?.success &&
              res?.updateChatBotCandidateId &&
              res?.candidateId
            ) {
              setCandidateId(res.candidateId);
              setIsCandidateAnonym(false);
            }

            if (res?.success) {
              setEmailAddress(messageValue.trim());
              setIsCandidateWithEmail(true);
            }

            if (res?.success) {
              setEmailAddress(messageValue.trim());
              setUserFirstName(userFName);
              setUserLastName(userLName);
              setIsCandidateWithEmail(true);
            }

            const sendTranscriptRes: ApiResponse<ISendTranscriptResponse> =
              await apiInstance.sendTranscript({
                ChatID: chatId!,
              });
            setCurrentMsgType(CHAT_ACTIONS.LIVE_CHAT);
          } catch (error) {
          } finally {
            setIsChatLoading(false);
          }
        }
      } else if (isApplyJobFlow && messageValue) {
        try {
          await sendNewMessage({
            message: messageValue,
          });
          setMessageValue("");
        } catch (error) {
          console.log(error);
        }
      } else {
        const isSendMess =
          currentMsgType !== CHAT_ACTIONS.SET_CATEGORY || requisitions.length;
        if (isSendMess) {
          sendMessage(messageValue);
          setIsShowResults(false);
        }

        switch (currentMsgType) {
          case CHAT_ACTIONS.ASK_QUESTION:
            messageValue && chooseButtonOption(messageValue as ButtonsOptions);
            break;
          default:
            break;
        }
      }
    }
  };

  const cleanInputState = useCallback(() => {
    setReferralStep(ReferralSteps[employeeId ? "UserFirstName" : "EmployeeId"]);
    setMessageValue("");
    setRefError("");
    setError("");
  }, [employeeId]);

  const isLastMessageWithOptions =
    !!messages[0]?.optionList && !!messages[0]?.optionList.options.length;
  const disabled = !isChatInputAvailable || isLastMessageWithOptions;

  const getPlaceholder = (): string => {
    if (inputType === TextFieldTypes.Select && disabled) {
      return "";
    }
    if (messages[0]?.optionList) {
      return t("placeHolders:selectOption");
    }
    if (currentMsgType === CHAT_ACTIONS.UPDATE_OR_MERGE_CANDIDATE) {
      return t("placeHolders:default");
    }
    if (
      messages[0].content.text ===
      t("messages:employeeId", {
        companyName: referralCompanyName,
      })
    ) {
      return t("placeHolders:enter_employee_id");
    }
    return placeHolder || t("placeHolders:bot_typing");
  };

  const inputProps = {
    type: inputType,
    headerName: headerName,
    subHeaderName,
    matchedItems: uniqBy(matchedItems, (i) => i),
    matchedPart,
    value: messageValue || "",
    placeHolder: getPlaceholder(),
    setIsShowResults,
    isShowResults,
    setHeight,
    setInputValue: (value: string) => {
      setError(null);
      setMessageValue(value);
    },
  };

  return (
    <S.MessagesInput marginTop={marginTop} isFrLang={currentLanguage === "fr"}>
      <BurgerMenu
        isOpen={isOpenBurgerMenu}
        setIsOpen={setIsOpenBurgerMenu}
        setIsShowResults={setIsShowResults}
        setSelectedReferralJobId={setSelectedReferralJobId}
        cleanInputValue={cleanInputState}
      />

      {inputType === TextFieldTypes.MultiSelect ? (
        <MultiSelectInput
          {...inputProps}
          values={inputValues}
          onChange={onChangeAutocomplete}
        />
      ) : (
        <Autocomplete
          {...inputProps}
          sendMessage={sendMessage}
          phoneValue={phone}
          setPhoneValue={setPhone}
          onChange={onChangeCategory}
          disabled={
            (isChatLoading &&
              currentMsgType !== CHAT_ACTIONS.SET_CATEGORY &&
              currentMsgType !== CHAT_ACTIONS.SET_LOCATIONS) ||
            disabled
          }
          errorText={refError}
          isPhoneNumberMode={referralStep === ReferralSteps.UserMobileNumber}
        />
      )}

      {isWriteAccess && !messages[0]?.optionList && (
        <S.PlaneIcon
          onClick={onSendMessageHandler}
          disabled={isChatLoading}
          src={ICONS.INPUT_PLANE}
          width="16"
        />
      )}
    </S.MessagesInput>
  );
};
