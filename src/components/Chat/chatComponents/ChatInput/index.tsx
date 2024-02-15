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

import "../../../../services/firebase/config";
import * as S from "./styles";
import { ICONS } from "assets";
import {
  MessageOptionTypes,
  MessageStatuses,
  Status,
  TextFieldTypes,
} from "utils/constants";
import {
  generateLocalId,
  getAccessWriteType,
  getFormattedLocations,
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
import { useFirebaseSignIn, useTextField } from "utils/hooks";
import { MultiSelectInput, Autocomplete, BurgerMenu } from "components/Layout";
import { useSubmitReferral, useValidateReferral } from "contexts/hooks";
import {
  ReferralSteps,
  getReferralQuestion,
  getReferralResponseMess,
  getValidationRefResponse,
} from "./data";

interface IChatInputProps {
  setHeight: React.Dispatch<React.SetStateAction<number>>;
  setSelectedReferralJobId: React.Dispatch<
    React.SetStateAction<number | undefined>
  >;
  selectedReferralJobId?: number;
}

export const ChatInput: FC<IChatInputProps> = ({
  setHeight,
  setSelectedReferralJobId,
  selectedReferralJobId,
}) => {
  useFirebaseSignIn();
  const { t } = useTranslation();
  const { file, setNotification, showJobTitles } = useFileUploadContext();
  const {
    category,
    dispatch,
    searchLocations,
    status,
    locations,
    currentMsgType,
    setError,
    error,
    requisitions,
    chooseButtonOption,
    isChatLoading,
    alertCategories,
    isApplyJobFlow,
    sendPreScreenMessage,
    setSearchLocations,
    _setMessages,
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
    employeeFullName,
  } = useChatMessenger();
  const onValidateReferral = useValidateReferral();
  const onSubmitReferral = useSubmitReferral();

  // ---------------------- State --------------------- //
  const formattedLocations = getFormattedLocations(locations);
  // TODO: посмотреть как было placeHolder
  const { searchItems, placeHolder, headerName, subHeaderName } = useTextField({
    locations: formattedLocations,
    requisitions,
    category,
    lastActionType: currentMsgType,
  });

  const [draftMessage, setDraftMessage] = useState<string | null>(null);
  const [inputValues, setInputValues] = useState<string[]>([]);
  const [isShowResults, setIsShowResults] = useState(false);
  // Referral
  const [refEmployeeId, setRefEmployeeId] = useState("");
  const [referralStep, setReferralStep] = useState<ReferralSteps>(
    ReferralSteps.EmployeeId
  );
  // user details of the person they want to refer:
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [refError, setRefError] = useState("");

  const inputType = getInputType(currentMsgType);

  const { matchedPart, matchedItems } = useMemo(
    () =>
      getMatchedItems({
        message: draftMessage,
        searchItems,
        searchLocations,
        alertCategories:
          currentMsgType === CHAT_ACTIONS.SET_ALERT_CATEGORIES
            ? alertCategories
            : undefined,
      }),
    [
      searchItems,
      draftMessage,
      searchLocations,
      currentMsgType,
      alertCategories,
    ]
  );

  const isWriteAccess =
    file ||
    draftMessage ||
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
      (!!draftMessage || !!file)
    ) {
      setIsShowResults(true);
    }

    if (currentMsgType === CHAT_ACTIONS.MAKE_REFERRAL_FRIEND) {
      setReferralStep(ReferralSteps.UserFirstName);
      clearReferralState();
      // _setMessages((prev) => [
      //   getReferralQuestion(ReferralSteps.UserFirstName),
      //   ...prev,
      // ]);
    }
  }, [currentMsgType]);

  useEffect(() => {
    if (currentMsgType === CHAT_ACTIONS.SEND_LOCATIONS) {
      setInputValues([]);
    }
  }, [currentMsgType]);

  const clearReferralState = useCallback(() => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
  }, []);

  // Callbacks
  const sendMessage = useCallback(
    (draftMessage: string | null) => {
      const matchedSearchItem = getMatchedItem(draftMessage, searchItems);
      const isSelectedValues =
        matchedSearchItem || inputValues.length || draftMessage;
      const actionType =
        isSelectedValues && currentMsgType
          ? getNextActionType(currentMsgType)
          : CHAT_ACTIONS.NO_MATCH;

      if (inputType === TextFieldTypes.MultiSelect && actionType) {
        const items = !!matchedSearchItem
          ? uniq([...inputValues, matchedSearchItem])
          : uniq(inputValues.length ? inputValues : [draftMessage!]);

        if (
          actionType === CHAT_ACTIONS.SET_ALERT_JOB_LOCATIONS &&
          currentMsgType === CHAT_ACTIONS.SET_ALERT_JOB_LOCATIONS
        ) {
          const alertEmailMess: ILocalMessage = {
            isOwn: false,
            localId: generateLocalId(),
            content: {
              subType: MessageType.TEXT,
              text: t(
                `messages:${
                  emailAddress ? "emailAlreadyProvided" : "alertEmail"
                }`
              ),
            },
            _id: null,
          };

          const messWithLocations: ILocalMessage = {
            isOwn: true,
            localId: generateLocalId(),
            content: {
              subType: MessageType.TEXT,
              text: matchedSearchItem ? items.join("\r") : draftMessage!,
              locations: items.length ? items : [draftMessage || ""],
            },
            _id: generateLocalId(),
          };

          setSearchLocations(items.length ? items : [draftMessage!]);
          _setMessages((prevMessages) => [
            alertEmailMess,
            messWithLocations,
            ...prevMessages,
          ]);
          setInputValues([]);
          setCurrentMsgType(CHAT_ACTIONS.SET_ALERT_EMAIL);

          if (emailAddress) {
            clearJobFilters();
            createJobAlert({
              email: emailAddress,
              type: CHAT_ACTIONS.SET_ALERT_EMAIL,
            });
          }
        } else {
          if (actionType === CHAT_ACTIONS.SEND_LOCATIONS) {
            setSearchLocations(items);
          }

          dispatch({
            type: actionType,
            payload: { items },
          });
        }
      } else {
        if (
          (currentMsgType === CHAT_ACTIONS.MAKE_REFERRAL ||
            currentMsgType === CHAT_ACTIONS.MAKE_REFERRAL_FRIEND) &&
          (draftMessage || phone)
        ) {
          referralHandle(draftMessage || phone);
        } else {
          dispatch({
            type: !currentMsgType ? CHAT_ACTIONS.NO_MATCH : currentMsgType,
            payload: { item: draftMessage },
          });
        }
      }

      setDraftMessage(null);
    },
    [
      currentMsgType,
      matchedItems.length,
      searchLocations.length,
      inputValues,
      referralStep,
      dispatch,
      phone,
    ]
  );

  const referralHandle = (draftMessage: string) => {
    const mess: ILocalMessage = {
      isOwn: true,
      localId: generateLocalId(),
      content: {
        subType: MessageType.TEXT,
        text: draftMessage,
      },
      _id: generateLocalId(),
    };

    switch (referralStep) {
      case ReferralSteps.EmployeeId:
        const enterNamaMess = getReferralQuestion(ReferralSteps.EmployeeId);

        setRefEmployeeId(draftMessage);
        _setMessages((prevMessages) => [enterNamaMess, mess, ...prevMessages]);
        setReferralStep(ReferralSteps.ReferralLastName);

        break;
      case ReferralSteps.ReferralLastName:
        const enterBirthMess = getReferralQuestion(
          ReferralSteps.ReferralLastName
        );
        setRefLastName(draftMessage);
        _setMessages((prevMessages) => [enterBirthMess, mess, ...prevMessages]);
        setReferralStep(ReferralSteps.ReferralBirth);

        break;
      case ReferralSteps.ReferralBirth:
        const onSuccessCallback = (employeeFullName: string) => {
          const resMess = getValidationRefResponse(
            employeeJobCategory,
            employeeFullName || refLastName
          );
          _setMessages((prevMessages) => [resMess, ...prevMessages]);

          const trimmedEmployeeID = refEmployeeId.trim();
          trimmedEmployeeID &&
            !isNaN(trimmedEmployeeID) &&
            setEmployeeId(+trimmedEmployeeID);
          setReferralStep(ReferralSteps.UserFirstName);
        };

        const onFailure = () => {
          const tryAgainMess: ILocalMessage = {
            localId: generateLocalId(),
            content: {
              subType: MessageType.TRY_AGAIN,
              text: t("errors:referral_validation"),
            },
            _id: generateLocalId(),
            onClickTryAgain: () => {
              const tryAgain: ILocalMessage = {
                _id: generateLocalId(),
                localId: generateLocalId(),
                content: {
                  subType: MessageType.TEXT,
                  text: t("messages:try_again"),
                },
                isOwn: true,
              };
              const employeeQuestion: ILocalMessage = {
                _id: generateLocalId(),
                localId: generateLocalId(),
                content: {
                  subType: MessageType.TEXT,
                  text: t("messages:employeeId"),
                },
              };
              _setMessages((prevMessages) => [
                employeeQuestion,
                tryAgain,
                ...prevMessages,
              ]);
              setReferralStep(ReferralSteps.EmployeeId);
            },
          };

          _setMessages((prevMessages) => [tryAgainMess, ...prevMessages]);
        };

        _setMessages((prevMessages) => [mess, ...prevMessages]);
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
        setFirstName(draftMessage);

        const userLastNameMess = getReferralQuestion(
          ReferralSteps.UserLastName
        );
        _setMessages((prevMessages) => [
          userLastNameMess,
          mess,
          ...prevMessages,
        ]);
        setReferralStep(ReferralSteps.UserLastName);
        break;
      case ReferralSteps.UserLastName:
        setLastName(draftMessage);

        const userEmailMess = getReferralQuestion(ReferralSteps.UserEmail);
        _setMessages((prevMessages) => [userEmailMess, mess, ...prevMessages]);
        setReferralStep(ReferralSteps.UserEmail);
        break;
      case ReferralSteps.UserEmail:
        const emailError = validateEmail(draftMessage);

        if (emailError) {
          setRefError(emailError);
        } else {
          setEmail(draftMessage.trim());

          const userConfirmMess = getReferralQuestion(
            ReferralSteps.UserConfirmationEmail
          );
          _setMessages((prevMessages) => [
            userConfirmMess,
            mess,
            ...prevMessages,
          ]);
          setReferralStep(ReferralSteps.UserConfirmationEmail);
        }
        break;
      case ReferralSteps.UserConfirmationEmail:
        if (email === draftMessage.trim()) {
          const userMobileMess = getReferralQuestion(
            ReferralSteps.UserMobileNumber
          );
          _setMessages((prevMessages) => [
            userMobileMess,
            mess,
            ...prevMessages,
          ]);
          setReferralStep(ReferralSteps.UserMobileNumber);
        } else {
          setRefError(t("errors:not_match"));
        }
        break;
      case ReferralSteps.UserMobileNumber:
        const isValid = isValidNumber(phone);

        if (isValid) {
          _setMessages((prevMessages) => [mess, ...prevMessages]);

          const payload = {
            referralSourceTypeId: 3,
            referredCandidate: {
              emailAddress: email,
              firstName,
              lastName,
              mobileNumber: phone,
            },
            jobId: selectedReferralJobId,
          };
          const onSuccessSubmit = (previouslyReferredState: number) => {
            setSelectedReferralJobId(undefined);
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
                  ${t("referral:refer_someone_else")}
                `,
              },
              optionList: {
                type: MessageOptionTypes.Referral,
                isActive: true,
                status:
                  MessageStatuses[
                    previouslyReferredState === 0 ? "ok" : "warning"
                  ],
                options: [
                  {
                    id: 1,
                    itemId: 1,
                    isSelected: false,
                    name: t("labels:yes"),
                    text: t("labels:yes"),
                  },
                  {
                    id: 2,
                    itemId: 2,
                    isSelected: false,
                    name: t("labels:no"),
                    text: t("labels:no"),
                  },
                ],
              },
            };
            _setMessages((prevMessages) => [question, ...prevMessages]);
            setCurrentMsgType(CHAT_ACTIONS.REFERRAL_IS_SUBMITTED);
            setReferralStep(ReferralSteps.UserFirstName);
            setPhone("");
          };
          const onFailureSubmit = () => {
            const errorMess: ILocalMessage = {
              _id: null,
              localId: generateLocalId(),
              isOwn: false,
              content: {
                subType: MessageType.TRY_AGAIN,
                text: t("errors:submit_referral_error"),
              },
              onClickTryAgain: () => {
                const tryAgain: ILocalMessage = {
                  _id: generateLocalId(),
                  localId: generateLocalId(),
                  content: {
                    subType: MessageType.TEXT,
                    text: t("messages:try_again"),
                  },
                  isOwn: true,
                };

                const userLastNameMess = getReferralQuestion(
                  ReferralSteps.UserFirstName
                );
                _setMessages((prevMessages) => [
                  userLastNameMess,
                  tryAgain,
                  ...prevMessages,
                ]);
                setReferralStep(ReferralSteps.UserFirstName);
              },
            };
            _setMessages((prevMessages) => [errorMess, ...prevMessages]);
          };

          onSubmitReferral(payload, onSuccessSubmit, onFailureSubmit);
          clearReferralState();
        } else {
          setRefError(t("errors:invalid_phone_number"));
        }

        break;

      default:
        break;
    }
  };

  useEffect(() => {
    const keyDownHandler = (event: KeyboardEvent) => {
      const isWriteAccess = getAccessWriteType(currentMsgType) || file;
      if (draftMessage && event.key === "Enter" && isWriteAccess) {
        event.preventDefault();
        onSendMessageHandler();
      }
    };
    document.addEventListener("keydown", keyDownHandler);

    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, [draftMessage, sendMessage]);

  // Callbacks
  const onChangeCategory = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setError(null);
    setRefError("");

    if (error) {
      if (currentMsgType === CHAT_ACTIONS.APPLY_AGE && error) {
        const age = Number(value);
        if (age < 15 || age > 80) {
          setError(null);
        }
      } else if (currentMsgType === CHAT_ACTIONS.GET_USER_NAME) {
        const isPhone = currentMsgType === CHAT_ACTIONS.GET_USER_NAME;
        const isError = isPhone
          ? validateEmailOrPhone(value)
          : validateEmail(value);
        !isError.trim() && setError(null);
      }
    }

    setDraftMessage(value);
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
      setDraftMessage(null);
      if (currentMsgType !== CHAT_ACTIONS.SET_ALERT_JOB_LOCATIONS) {
        dispatch({
          type: currentMsgType,
          payload: { items: uniq(newValues) },
        });
      } else {
        setSearchLocations(uniq(newValues));
      }
    }
  };

  const onSendMessageHandler = async () => {
    if (!isChatLoading) {
      if (isApplyJobFlow && draftMessage) {
        try {
          await sendPreScreenMessage(draftMessage);
          setDraftMessage("");
        } catch (error) {
          console.log(error);
        }
      } else {
        const isSendMess =
          currentMsgType !== CHAT_ACTIONS.SET_CATEGORY || requisitions.length;
        if (isSendMess) {
          sendMessage(draftMessage);
          setIsShowResults(false);
        }

        switch (currentMsgType) {
          case CHAT_ACTIONS.ASK_QUESTION:
            draftMessage && chooseButtonOption(draftMessage as ButtonsOptions);
            break;
          default:
            break;
        }
      }
    }
  };

  const disabled =
    !isChatInputAvailable ||
    (!!messages[0].optionList && !!messages[0].optionList.options.length);

  const getPlaceholder = (): string => {
    if (inputType === TextFieldTypes.Select && disabled) {
      return "";
    }
    if (messages[0].optionList) {
      return t("placeHolders:selectOption");
    }
    if (currentMsgType === CHAT_ACTIONS.UPDATE_OR_MERGE_CANDIDATE) {
      return t("placeHolders:default");
    }
    if (messages[0].content.text === t("messages:employeeId")) {
      return t("placeHolders:enter_employee_id");
    }
    return "";
  };

  const inputProps = {
    type: inputType,
    headerName: headerName,
    subHeaderName,
    matchedItems: uniqBy(matchedItems, (i) => i),
    matchedPart,
    value: draftMessage || "",
    placeHolder: getPlaceholder(),
    setIsShowResults,
    isShowResults,
    setHeight,
    setInputValue: (value: string) => {
      setError(null);
      setDraftMessage(value);
    },
  };

  return (
    <S.MessagesInput marginTop={marginTop}>
      <BurgerMenu setIsShowResults={setIsShowResults} />

      {inputType === TextFieldTypes.MultiSelect ? (
        <MultiSelectInput
          {...inputProps}
          values={inputValues}
          onChange={onChangeAutocomplete}
        />
      ) : (
        <Autocomplete
          {...inputProps}
          phoneValue={phone}
          setPhoneValue={setPhone}
          onChange={onChangeCategory}
          disabled={disabled}
          errorText={refError}
          isPhoneNumberMode={referralStep === ReferralSteps.UserMobileNumber}
        />
      )}

      {isWriteAccess && !messages[0].optionList && (
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
