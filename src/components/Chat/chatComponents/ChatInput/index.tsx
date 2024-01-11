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
import uniqBy from "lodash/uniqBy";

import "../../../../services/firebase/config";
import * as S from "./styles";
import { ICONS } from "assets";
import { Status, TextFieldTypes } from "utils/constants";
import {
  generateLocalId,
  getAccessWriteType,
  getFormattedLocations,
  getInputType,
  getMatchedItem,
  getMatchedItems,
  getNextActionType,
  validateEmail,
  validateEmailOrPhone,
} from "utils/helpers";
import { CHAT_ACTIONS, ILocalMessage, MessageType } from "utils/types";
import { useFirebaseSignIn, useTextField } from "utils/hooks";
import { MultiSelectInput, Autocomplete, BurgerMenu } from "components/Layout";

interface IChatInputProps {
  setHeight: React.Dispatch<React.SetStateAction<number>>;
}

export const ChatInput: FC<IChatInputProps> = ({ setHeight }) => {
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
    validateRefDataAndGetWorker,
  } = useChatMessenger();

  // ---------------------- State --------------------- //
  const formattedLocations = getFormattedLocations(locations);
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
  const [employeeId, setEmployeeID] = useState("");
  const [refLastName, setRefLastName] = useState("");
  const [referralStep, setReferralStep] = useState(1);

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
    getAccessWriteType(currentMsgType) &&
    (file || draftMessage || !!inputValues.length);

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
  }, [currentMsgType]);

  useEffect(() => {
    if (currentMsgType === CHAT_ACTIONS.SEND_LOCATIONS) {
      setInputValues([]);
    }
  }, [currentMsgType]);

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
        if (currentMsgType === CHAT_ACTIONS.MAKE_REFERRAL && draftMessage) {
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
            case 1:
              const enterNamaMess: ILocalMessage = {
                isOwn: false,
                localId: generateLocalId(),
                content: {
                  subType: MessageType.TEXT,
                  text: "Enter a last name",
                },
                _id: generateLocalId(),
              };

              setEmployeeID(draftMessage);
              _setMessages((prevMessages) => [
                enterNamaMess,
                mess,
                ...prevMessages,
              ]);
              setReferralStep(2);

              break;
            case 2:
              const enterBirthMess: ILocalMessage = {
                isOwn: false,
                localId: generateLocalId(),
                content: {
                  subType: MessageType.TEXT,
                  text: "Enter your date or year of birth",
                },
                _id: generateLocalId(),
              };
              setRefLastName(draftMessage);
              _setMessages((prevMessages) => [
                enterBirthMess,
                mess,
                ...prevMessages,
              ]);
              setReferralStep(3);

              break;
            case 3:
              _setMessages((prevMessages) => [...prevMessages]);
              validateRefDataAndGetWorker({
                lastName: refLastName,
                yeanOrBirth: draftMessage,
                employeeId: +employeeId,
              });

              break;

            default:
              break;
          }
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
    ]
  );

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
      try {
        if (isApplyJobFlow && draftMessage) {
          await sendPreScreenMessage(draftMessage);
          setDraftMessage("");
        } else {
          if (
            currentMsgType !== CHAT_ACTIONS.SET_CATEGORY ||
            requisitions.length
          ) {
            sendMessage(draftMessage);
            setIsShowResults(false);
          }

          switch (currentMsgType) {
            case CHAT_ACTIONS.ASK_QUESTION:
              draftMessage && chooseButtonOption(draftMessage);
              break;
            default:
              break;
          }
        }
      } catch (error) {}
    }
  };

  const disabled =
    !isChatInputAvailable ||
    (!!messages[0].optionList && !!messages[0].optionList.options.length);

  const inputProps = {
    type: inputType,
    headerName: headerName,
    subHeaderName,
    matchedItems: uniqBy(matchedItems, (i) => i),
    matchedPart,
    value: draftMessage || "",
    placeHolder:
      inputType === TextFieldTypes.Select && disabled
        ? ""
        : messages[0].optionList
        ? t("placeHolders:selectOption")
        : currentMsgType === CHAT_ACTIONS.UPDATE_OR_MERGE_CANDIDATE
        ? t("placeHolders:default")
        : placeHolder || t("placeHolders:bot_typing"),
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
          onChange={onChangeCategory}
          disabled={disabled}
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
