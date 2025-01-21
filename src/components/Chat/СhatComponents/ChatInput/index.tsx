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
  useRef,
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
  referralOptions,
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
  createConsentInMsg,
  createTextMess,
  decodeHTML,
  getInputType,
  getMatchedItem,
  getMatchedItems,
  getNextActionType,
  isValidNumber,
  LOG,
  parsePathname,
  validateEmail,
  validateEmailOrPhone,
  withSendNewMess,
} from "utils/helpers";
import { CHAT_ACTIONS, ILocalMessage, MessageType } from "utils/types";
import { useFirebaseSignIn, usePersistStore, useTextField } from "utils/hooks";
import {
  ISubmitReferral,
  useAksQuestion,
  useConnectToLiveChat,
  useSubmitReferral,
  useValidateReferral,
} from "contexts/hooks";
import { MultiSelectInput, Autocomplete, BurgerMenu } from "components/Layout";
import {
  IApplyJobResponse,
  IUpdateOrMergeCandidateRequest,
  IUpdateOrMergeCandidateResponse,
} from "services/types";
import { PrivacyPolicy } from "./PrivacyPolicy";
import { useCheckAnswer, useIsDisabledInput } from "./hooks";

interface IChatInputProps {
  setSelectedReferralJobId: React.Dispatch<
    React.SetStateAction<number | undefined>
  >;
  selectedReferralJobId?: number;
}

const INPUT_KEY = "input-value";

export const ChatInput: FC<IChatInputProps> = ({
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
    setEmployeeId,
    companyName: referralCompanyName,
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
    PPLinkUrl,
    footerPrivacyLink,
    consentOptIn,
    companyName,
    setIsApplyJobSuccessfully,
    setFlowId,
    setSubscriberWorkflowId,
    parentPathname,
    isJobSearchLocationMultiSelect,
    setAlertCategories,
  } = useChatMessenger();
  const onValidateReferral = useValidateReferral();
  const onSubmitReferral = useSubmitReferral();
  const isTabActive = useIsTabActive();
  const connectToLiveChat = useConnectToLiveChat(chatId, chatQueueId);
  const checkAnswer = useCheckAnswer();
  const { askQuestionHandler, isAlreadyAsked } = useAksQuestion();
  const isInputDisabled = useIsDisabledInput();

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

  // TODO: tempo
  const [searchLocation, setSearchLocation] = useState("");

  const locationsForAlert = useRef<string[]>([]);

  const [isAcceptedApplyJob, setIsAcceptedApplyJob] = usePersistStore<boolean>(
    hostname + "isAccepted",
    false,
    hostname
  );

  const inputType = getInputType(currentMsgType);

  useEffect(() => {
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
      setReferralStep(storedReferralStep as ReferralSteps);
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
      const storedReferralStep = localStorage.getItem(
        hostname + "referralStep"
      );
      setReferralStep(
        (storedReferralStep as ReferralSteps) || ReferralSteps.UserFirstName
      );
    }
  }, [currentMsgType]);

  useEffect(() => {
    if (currentMsgType === CHAT_ACTIONS.SEND_LOCATIONS) {
      setTimeout(() => setInputValues([]), 1000);
    }
  }, [currentMsgType]);

  // Callbacks
  const sendMessage = async (message: string | null) => {
    const matchedSearchItem = getMatchedItem(
      currentMsgType === CHAT_ACTIONS.SET_LOCATIONS ? searchLocation : message,
      searchItems
    );
    const isSelectedValues = matchedSearchItem || inputValues.length || message;

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

        const messWithLocations = createTextMess({
          isOwn: true,
          text:
            message ||
            searchLocations[0] ||
            locationsForAlert.current[0] ||
            items.join("\r"),
          // locations: items.length ? items : [message || ""],
        });

        locationsForAlert.current = [];
        // setSearchLocations(items.length ? items : [message!]);
        setInputValues([]);

        const text = matchedSearchItem
          ? items.join("\r")
          : message || searchLocations[0];
        if (text) {
          sendNewMessage({
            message: text,
            isOwn: true,
            localId: messWithLocations.localId,
          });
        }

        if (!emailAddress) {
          sendNewMessage({
            isOwn: false,
            message: alertEmailMess.content.text,
            localId: alertEmailMess.localId,
          });
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

        const text = items.length ? items.join("\r\n") : message;
        if (text) {
          sendNewMessage({
            message: text,
            isOwn: true,
            localId: actionType + "_localId",
          });
          setMessageValue("");
        }
        const payload = { items: items.length ? items : [message] };
        LOG(actionType, "actionType");
        LOG(payload, "payload");

        if (actionType === CHAT_ACTIONS.SET_LOCATIONS && payload.items[0]) {
          setSearchLocation(payload.items[0]);
        }
        dispatch({
          type: actionType,
          payload,
          i18nProps: null,
        });
      }
    } else {
      const currentMess = createTextMess({
        isOwn: true,
        text: message || "",
      });

      const text = currentMess.content.text;
      if (text) {
        try {
          await sendNewMessage({
            message: text,
            isOwn: true,
            localId: currentMess.localId,
          });
          setMessageValue("");
        } catch (error) {
          console.log(error);
        }
      }

      if (
        (currentMsgType === CHAT_ACTIONS.MAKE_REFERRAL ||
          currentMsgType === CHAT_ACTIONS.MAKE_REFERRAL_FRIEND) &&
        (message || phone)
      ) {
        referralHandle(message || phone);
      } else if (currentMsgType === CHAT_ACTIONS.SET_USER_FIRST_NAME) {
        setUserFirstName(message!);

        const alertMess = getAlertJobMessage(message!, userLName, emailAddress);

        sendNewMessage({
          isOwn: false,
          message: alertMess.content.text,
          localId: alertMess.localId,
        });
        setMessages((prev) => [alertMess, currentMess, ...prev]);
        setCurrentMsgType(CHAT_ACTIONS.SET_USER_LAST_NAME);
      } else if (currentMsgType === CHAT_ACTIONS.SET_USER_LAST_NAME) {
        setUserLastName(message!);

        const alertMess = getAlertJobMessage(
          userFName || userFirstName,
          message!,
          emailAddress
        );

        sendNewMessage({
          isOwn: false,
          message: alertMess.content.text,
          localId: alertMess.localId,
        });
        setMessages((prev) => [alertMess, currentMess, ...prev]);
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

            sendNewMessage({
              isOwn: false,
              message: errorEmailMessage.content.text,
              localId: errorEmailMessage.localId,
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
  };

  const referralHandle = (draftMessage: string) => {
    const mess = createTextMess({ isOwn: true, text: draftMessage });

    switch (referralStep) {
      case ReferralSteps.EmployeeId:
        setRefEmployeeId(draftMessage);
        setMessages((prevMessages) => [mess, ...prevMessages]);
        setIsChatLoading(true);
        setTimeout(() => {
          const enterNamaMess = getReferralQuestion(ReferralSteps.EmployeeId);

          sendNewMessage({
            isOwn: false,
            message: enterNamaMess.content.text,
            localId: enterNamaMess.localId,
          });
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

          sendNewMessage({
            isOwn: false,
            message: enterBirthMess.content.text,
            localId: enterBirthMess.localId,
          });
          setIsChatLoading(false);
          setMessages((prevMessages) => [enterBirthMess, ...prevMessages]);
        }, 500);
        setReferralStep(ReferralSteps.ReferralBirth);

        break;
      case ReferralSteps.ReferralBirth:
        const onSuccessCallback = (
          employeeFullName: string,
          newCandidateId?: number
        ) => {
          const resMess = getValidationRefResponse(
            employeeJobCategory,
            employeeFullName || refLastName,
            true
          );
          sendNewMessage({
            isOwn: false,
            message: resMess.content.text,
            localId: resMess.localId,
            newCandidateId: newCandidateId,
          });
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

          sendNewMessage({
            isOwn: false,
            message: tryAgain.content.text,
            localId: tryAgain.localId,
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

          sendNewMessage({
            isOwn: false,
            message: userLastNameMess.content.text,
            localId: userLastNameMess.localId,
          });
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

          sendNewMessage({
            isOwn: false,
            message: userEmailMess.content.text,
            localId: userEmailMess.localId,
          });
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

            sendNewMessage({
              isOwn: false,
              message: errorMessage.content.text,
              localId: errorMessage.localId,
            });
            setMessages((prev) => [errorMessage, ...prev]);
          } else {
            setEmail(draftMessage.trim());

            const userConfirmMess = getReferralQuestion(
              ReferralSteps.UserConfirmationEmail
            );

            sendNewMessage({
              isOwn: false,
              message: userConfirmMess.content.text,
              localId: userConfirmMess.localId,
            });
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

            sendNewMessage({
              isOwn: false,
              message: userMobileMess.content.text,
              localId: userMobileMess.localId,
            });
            setMessages((prevMessages) => [userMobileMess, ...prevMessages]);
          }, 500);
          setReferralStep(ReferralSteps.UserMobileNumber);
        } else {
          const errorMessage = createTextMess({
            isError: true,
            text: t("errors:not_match"),
            i18n: "errors:not_match",
          });

          sendNewMessage({
            isOwn: false,
            message: errorMessage.content.text,
            localId: errorMessage.localId,
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

            // TODO: refactor
            const question = createTextMess({
              text: `${getReferralResponseMess(
                previouslyReferredState,
                firstName,
                lastName,
                referralCompanyName
              )}  \n  
                  ${
                    jobOffer?.title
                      ? t("referral:refer_someone_else_to_job", {
                          jobName: decodeHTML(jobOffer.title),
                        })
                      : t("referral:refer_someone_else_to", {
                          name: referralCompanyName,
                        })
                  }
                `.replaceAll("amp;", ""),
              isOwn: false,
              optionList: {
                type: MessageOptionTypes.Referral,
                isActive: true,
                status: MessageStatuses[isOk ? "ok" : "warning"],
                options: referralOptions,
              },
              jobId: jobOffer?.id,
            });

            sendNewMessage({
              isOwn: false,
              message: question.content.text,
              localId: question.localId,
            });
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

            sendNewMessage({
              isOwn: false,
              message: errorMess.content.text,
              localId: errorMess.localId,
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

          sendNewMessage({
            isOwn: false,
            message: errorMessage.content.text,
            localId: errorMessage.localId,
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
        !isError?.trim() && setError(null);
      }
    }

    setMessageValue(value);
    setNotification(null);
  };

  const onChangeMultiselect = (
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
      const values = uniq(newValues);
      setInputValues(values);
      setMessageValue("");

      switch (currentMsgType) {
        case CHAT_ACTIONS.SET_ALERT_CATEGORIES:
          if (values.length) {
            setAlertCategories(values);
            const userMessWithCategory = createTextMess({
              isOwn: true,
              text: values[0],
            });

            setMessages((prev) => [userMessWithCategory, ...prev]);
            sendNewMessage({
              isOwn: true,
              message: userMessWithCategory.content.text,
              localId: userMessWithCategory.localId,
            });
            onSendMessageHandler(values[0]);
          }

          break;
        case CHAT_ACTIONS.SET_ALERT_JOB_LOCATIONS:
          if (!!values[0]?.trim()) {
            setSearchLocations(values);
            locationsForAlert.current = values;
            onSendMessageHandler(values[0]?.trim());
          }

          break;

        default:
          dispatch({
            type: currentMsgType,
            payload: { items: values },
            i18nProps: null,
          });

          // temporary solution, since the api can only search for vacancies in 1 location
          // (if the api is updated, then remove this part)
          if (
            currentMsgType === CHAT_ACTIONS.SET_LOCATIONS &&
            values.length &&
            !isJobSearchLocationMultiSelect
          ) {
            setSearchLocations(values);
            const userMessWithLocation = createTextMess({
              isOwn: true,
              text: values[0],
            });
            setMessages((prev) => [userMessWithLocation, ...prev]);
            sendNewMessage({
              isOwn: true,
              message: userMessWithLocation.content.text,
              localId: userMessWithLocation.localId,
            });
            onSendMessageHandler();
          }
      }
    }
  };

  const onSendMessageHandler = async (msgText?: string) => {
    if (!isChatLoading && isTabActive) {
      const withSendMessToSever = withSendNewMess(messageValue, currentMsgType);
      const text = messageValue || msgText;
      const newUserMess = text ? createTextMess({ isOwn: true, text }) : null;

      if (withSendMessToSever && newUserMess) {
        if (
          currentMsgType === CHAT_ACTIONS.APPLY_JOB_FROM_PARENT_SITE &&
          messages.length === 1
        ) {
          LOG(messages, " messages.length === 1, messages ->");
          sendNewMessage({
            isOwn: false,
            message: messages[0].content.text,
            localId: messages[0].localId,
          });
        }

        try {
          sendNewMessage({
            isOwn: true,
            localId: newUserMess.localId,
            message: newUserMess.content.text,
          });
        } catch (error) {
          console.log(error);
        } finally {
          setMessageValue("");
        }
      }

      if (newUserMess?.content.text?.trim() === "can i speak to someone?") {
        setMessageValue("");
        setIsOpenBurgerMenu(false);
        connectToLiveChat();
        return;
      } else if (
        currentMsgType === CHAT_ACTIONS.LIVE_CHAT &&
        newUserMess?.content.text
      ) {
        LOG(currentMsgType, "__currentMsgType");
        if (!userFName) {
          setFName(newUserMess?.content.text.trim());
          setUserFirstName(newUserMess?.content.text.trim());
          setMessages((prev) => [newUserMess, ...prev]);
          setMessageValue("");
          setIsChatLoading(true);
          setTimeout(() => {
            setIsChatLoading(false);
            const chatbotMess = createTextMess({
              text: t("messages:provide_lastname"),
              i18n: "messages:provide_lastname",
            });

            sendNewMessage({
              isOwn: false,
              message: chatbotMess.content.text,
              localId: chatbotMess.localId,
            });
            setMessages((prevMessages) => [chatbotMess, ...prevMessages]);
          }, 500);
          return;
        } else if (!userLName) {
          setLName(newUserMess?.content.text.trim());
          setUserLastName(newUserMess?.content.text.trim());
          setMessages((prev) => [newUserMess, ...prev]);
          setMessageValue("");

          try {
            const candidateData: IUpdateOrMergeCandidateRequest = {
              firstName: userFName,
              lastName: newUserMess?.content.text.trim(),
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
              const thanksMess = createTextMess({
                text: `Thank you ${firstName}. Please wait while we connect you...`,
              });

              sendNewMessage({
                isOwn: false,
                message: thanksMess.content.text,
                localId: thanksMess.localId,
              });
              setMessages((prev) => [thanksMess, ...prev]);
            }
          } catch (error) {
          } finally {
            setIsLiveChat(true);
          }
          return;
        } else {
          await sendNewMessage({
            message: newUserMess?.content.text,
            isLiveChat: true,
            isOwn: true,
            localId: newUserMess.localId,
          });
        }
        setMessageValue("");
      } else if (
        currentMsgType === CHAT_ACTIONS.GET_EMAIL &&
        newUserMess?.content.text
      ) {
        const emailError = validateEmail(newUserMess?.content.text);
        setMessages((prevMessages) => [newUserMess, ...prevMessages]);
        setIsChatLoading(true);
        setMessageValue("");

        if (emailError) {
          setTimeout(async () => {
            setIsChatLoading(false);
            const errorMessage = createTextMess({
              text: emailError,
              isError: true,
            });

            sendNewMessage({
              isOwn: false,
              message: errorMessage.content.text,
              localId: errorMessage.localId,
            });
            setMessages((prev) => [errorMessage, ...prev]);
          }, 300);
        } else {
          setUserEmail(newUserMess?.content.text.trim());
          const candidatePayload: IUpdateOrMergeCandidateRequest = {
            firstName: userFName,
            lastName: userLName,
            emailAddress: newUserMess?.content.text.trim(),
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
              setEmailAddress(newUserMess?.content.text.trim());
              setUserFirstName(userFName);
              setUserLastName(userLName);
              setIsCandidateWithEmail(true);
            }

            await apiInstance.sendTranscript({
              ChatID: chatId!,
            });
            setCurrentMsgType(CHAT_ACTIONS.LIVE_CHAT);
          } catch (error) {
          } finally {
            setIsChatLoading(false);
          }
        }
      } else if (
        currentMsgType === CHAT_ACTIONS.APPLY_JOB_FROM_PARENT_SITE &&
        newUserMess &&
        newUserMess.content.text
      ) {
        const answer = newUserMess;
        setMessageValue("");

        const isConfirm = await checkAnswer(
          newUserMess.content.text,
          isAcceptedApplyJob
        );

        LOG(isAcceptedApplyJob, "isAcceptedApplyJob");

        if (!isConfirm && !isAcceptedApplyJob) {
          setMessages((prev) => [answer, ...prev]);
          // just set user message
          const chatbotMess = createTextMess({
            text: t("messages:select_option"),
            isOwn: false,
            optionList: {
              isActive: true,
              type: MessageOptionTypes.DefaultOptions,
              status: MessageStatuses.ok,
              options: [
                {
                  id: 1,
                  itemId: 1,
                  isSelected: false,
                  name: t("buttons:find_another_job"),
                  text: t("buttons:find_another_job"),
                  i18nPhrase: "buttons:find_another_job",
                },
                {
                  id: 2,
                  itemId: 2,
                  isSelected: false,
                  name: t("buttons:ask_questions"),
                  text: t("buttons:ask_questions"),
                  i18nPhrase: "buttons:ask_questions",
                },
              ],
            },
          });

          sendNewMessage({
            isOwn: false,
            message: chatbotMess.content.text,
            localId: chatbotMess.localId,
          });
          setMessages((prev) => [chatbotMess, ...prev]);
        } else if (isConfirm && !isAcceptedApplyJob) {
          const resMess = createTextMess({ text: t("messages:great_apply") });
          const consentInMessage = createConsentInMsg({
            consentOptIn,
            currentLanguage,
            companyName,
            t,
          });

          sendNewMessage({
            isOwn: false,
            message: resMess.content.text,
            localId: resMess.localId,
          });

          setMessages((prev) =>
            consentInMessage
              ? [consentInMessage, resMess, answer, ...prev]
              : [resMess, answer, ...prev]
          );
          setIsAcceptedApplyJob(true);
          setUserFirstName(newUserMess.content.text.trim());
        } else if (isAcceptedApplyJob) {
          if (!userFName) {
            setMessages((prev) => [answer, ...prev]);
            setFName(newUserMess.content.text.trim());

            setIsChatLoading(true);
            setTimeout(() => {
              setIsChatLoading(false);
              const chatbotMess = createTextMess({
                text: t("messages:provide_lastname"),
                i18n: "messages:provide_lastname",
              });

              sendNewMessage({
                isOwn: false,
                message: chatbotMess.content.text,
                localId: chatbotMess.localId,
              });
              setMessages((prevMessages) => [chatbotMess, ...prevMessages]);
            }, 500);
            return;
          } else if (!userLName) {
            setMessages((prev) => [answer, ...prev]);
            setLName(newUserMess.content.text.trim());
            setUserLastName(newUserMess.content.text.trim());

            const chatbotMess = createTextMess({
              text: t("messages:provideEmail"),
              i18n: "messages:provideEmail",
            });
            LOG(chatbotMess, chatbotMess.content.text);

            sendNewMessage({
              isOwn: false,
              message: chatbotMess.content.text,
              localId: chatbotMess.localId,
            });
            setMessages((prev) => [chatbotMess, ...prev]);
            setMessageValue("");
          } else if (!emailAddress) {
            setMessages((prev) => [answer, ...prev]);
            const emailError = validateEmail(newUserMess.content.text.trim());
            if (emailError) {
              const errorEmailMessage = createTextMess({
                isError: true,
                text: emailError,
              });

              sendNewMessage({
                isOwn: false,
                localId: errorEmailMessage.localId,
              });
              setMessages((prev) => [errorEmailMessage, ...prev]);
            } else {
              const candidatePayload: IUpdateOrMergeCandidateRequest = {
                firstName: userFName,
                lastName: userLName,
                emailAddress: newUserMess.content.text.trim(),
                candidateId: candidateId!,
                chatId: chatId!,
                skipEmailCheck: false,
              };

              setIsChatLoading(true);
              try {
                const candidateRes: ApiResponse<IUpdateOrMergeCandidateResponse> =
                  await apiInstance.updateOrMargeCandidate(candidatePayload);

                const response = candidateRes?.data;

                if (
                  response?.success &&
                  response?.updateChatBotCandidateId &&
                  response?.candidateId
                ) {
                  setCandidateId(response.candidateId);
                  setIsCandidateAnonym(false);
                }

                if (response?.success) {
                  setEmailAddress(newUserMess.content.text.trim());
                  setUserFirstName(userFName);
                  setUserLastName(userLName);
                  setIsCandidateWithEmail(true);
                }

                if (response?.success && response.candidateId && chatId) {
                  try {
                    const { jobId } = parsePathname(parentPathname);
                    if (jobId) {
                      const res: ApiResponse<IApplyJobResponse> =
                        await apiInstance.applyJob(
                          jobId,
                          response.candidateId,
                          chatId
                        );
                      if (
                        res.data?.success &&
                        res.data?.FlowID &&
                        res.data?.SubscriberWorkflowID
                      ) {
                        setIsApplyJobSuccessfully(true);
                        setFlowId(res.data.FlowID);
                        setSubscriberWorkflowId(res.data.SubscriberWorkflowID);
                      } else {
                        if (res.data?.statusCode === 105) {
                        } else {
                          setMessages((prev) => [
                            createTextMess({
                              text:
                                res.data?.errors[0]?.trim() ||
                                t(
                                  `errors:${
                                    res.data?.statusCode === 105
                                      ? "something_went_wrong"
                                      : "not_possible_to_start"
                                  }`
                                ),
                              isError: true,
                            }),
                            ...prev,
                          ]);
                        }
                      }
                    }
                  } catch (error) {
                    if (error.message) {
                      const errorMess = createTextMess({
                        text: error.message,
                        isError: true,
                      });

                      sendNewMessage({
                        isOwn: false,
                        message: errorMess.content.text,
                        localId: errorMess.localId,
                      });
                      setMessages((prev) => [errorMess, ...prev]);
                    }
                  }
                }
              } catch (error) {
              } finally {
                setIsChatLoading(false);
              }
              setUserEmail(newUserMess.content.text.trim());
            }
          }
        }
      } else if (isApplyJobFlow && newUserMess) {
        setMessageValue("");
        await sendNewMessage({
          message: newUserMess.content.text,
          isOwn: true,
          localId: newUserMess.localId,
        });
      } else {
        const isSendMess =
          (currentMsgType !== CHAT_ACTIONS.SET_CATEGORY &&
            currentMsgType !== CHAT_ACTIONS.ASK_QUESTION) ||
          requisitions.length;
        if (isSendMess) {
          sendMessage(newUserMess?.content.text || null);
          setIsShowResults(false);
        }

        switch (currentMsgType) {
          case CHAT_ACTIONS.ASK_QUESTION:
            askQuestionHandler({
              setMessageValue,
              question: newUserMess?.content.text,
            });
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

  const getPlaceholder = (): string => {
    if (
      inputType === TextFieldTypes.Select &&
      isInputDisabled &&
      currentMsgType !== CHAT_ACTIONS.SUCCESS_INTERESTED_IN &&
      currentMsgType !== CHAT_ACTIONS.CREATED_JOB_ALERT
    ) {
      return "";
    }
    if (messages[0]?.optionList) {
      return t("placeHolders:selectOption");
    }

    switch (currentMsgType) {
      case CHAT_ACTIONS.ASK_QUESTION:
        return t(
          `placeHolders:${isAlreadyAsked ? "aks_another_question" : "default"}`
        );
      case CHAT_ACTIONS.UPDATE_OR_MERGE_CANDIDATE:
        return t("placeHolders:default");
      case CHAT_ACTIONS.SUCCESS_INTERESTED_IN:
      case CHAT_ACTIONS.CREATED_JOB_ALERT:
        return t("placeHolders:click_menu");
    }

    if (
      messages?.[0]?.content?.text ===
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
    setInputValue: (value: string) => {
      setError(null);
      setMessageValue(value);
    },
  };

  const withFooterPP = !!PPLinkUrl && !!footerPrivacyLink?.enabled;

  return (
    <S.Wrapper withPPLink={withFooterPP}>
      <S.MessagesInput $withBottomLink={withFooterPP} marginTop={marginTop}>
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
            disabled={isInputDisabled}
            values={inputValues}
            onChange={onChangeMultiselect}
          />
        ) : (
          <Autocomplete
            {...inputProps}
            disabled={isInputDisabled}
            sendMessage={sendMessage}
            phoneValue={phone}
            setPhoneValue={setPhone}
            onChange={onChangeCategory}
            errorText={refError}
            isPhoneNumberMode={referralStep === ReferralSteps.UserMobileNumber}
          />
        )}

        {isWriteAccess && !messages[0]?.optionList && (
          <S.PlaneIcon
            onClick={() => onSendMessageHandler()}
            disabled={isChatLoading}
            src={ICONS.INPUT_PLANE}
            width="16"
          />
        )}
      </S.MessagesInput>

      <PrivacyPolicy />
    </S.Wrapper>
  );
};
