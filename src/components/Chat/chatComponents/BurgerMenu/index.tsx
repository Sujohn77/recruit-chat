import { useChatMessenger } from "contexts/MessengerContext";
import React, { FC, useCallback, useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import map from "lodash/map";

import * as S from "./styles";
import { Burger } from "./Burger";
import { MenuItem } from "./MenuItem";
import {
  baseWithRefItems,
  baseWithRef,
  menuForCandidateWithEmail,
  menuItems,
} from "./data";
import { getValidationRefResponse } from "components/Chat/ChatComponents/ChatInput/data";
import { apiInstance } from "services/api";
import { createTextMess } from "utils/helpers";
import { CHAT_ACTIONS, IMenuItem } from "utils/types";
import i18n from "services/localization";

interface IBurgerMenuProps {
  setIsShowResults: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedReferralJobId: React.Dispatch<
    React.SetStateAction<number | undefined>
  >;
  cleanInputValue: () => void;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const BurgerMenu: FC<IBurgerMenuProps> = ({
  setIsShowResults,
  setSelectedReferralJobId,
  cleanInputValue,
  isOpen,
  setIsOpen,
}) => {
  const { t } = useTranslation();
  const {
    dispatch,
    chatId,
    setIsApplyJobFlow,
    isCandidateWithEmail,
    emailAddress,
    setViewJob,
    isReferralEnabled,
    employeeId,
    refLastName,
    refBirth,
    refURL,
    clientApiToken,
    setMessages,
    employeeJobCategory,
    hostname,
    languages,
    isMultiLanguage,
    currentLanguage,
    setIsLiveChat,
    isLiveChat,
    currentMsgType,
    setIsChatLoading,
    setCurrentMsgType,
    messages,
    withFindJobOption,
    chatConsent,
    sendNewMessage,
    setCurrentLanguage,
    setIsApplyJobSuccessfully,
    setFlowId,
    setSubscriberWorkflowId,
  } = useChatMessenger();

  const wrapperRef = useRef<HTMLDivElement>(null);

  const list = useMemo(() => {
    const withSendTranscript =
      currentMsgType === CHAT_ACTIONS.LIVE_CHAT &&
      isLiveChat &&
      messages[0].dateCreated?.seconds;

    const withFindJob = withFindJobOption && chatConsent;

    let defaultItems =
      withSendTranscript || isCandidateWithEmail
        ? menuForCandidateWithEmail(languages, isMultiLanguage, withFindJob)
        : menuItems(languages, isMultiLanguage, withFindJob);
    if (isReferralEnabled && !!employeeId) {
      return baseWithRef(languages, isMultiLanguage);
    }
    if (isReferralEnabled) {
      return baseWithRefItems(languages, isMultiLanguage);
    }
    return defaultItems;
  }, [
    isReferralEnabled,
    isCandidateWithEmail,
    employeeId,
    languages,
    isMultiLanguage,
    currentLanguage,
    isLiveChat,
    currentMsgType,
    messages,
    withFindJobOption,
    chatConsent,
  ]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setTimeout(() => setIsOpen(false), 100);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const refreshInputStateIfNeed = useCallback(
    (type: CHAT_ACTIONS) => {
      type === CHAT_ACTIONS.MAKE_REFERRAL &&
        setSelectedReferralJobId(undefined);

      if (
        type === CHAT_ACTIONS.ASK_QUESTION ||
        type === CHAT_ACTIONS.FIND_JOB ||
        type === CHAT_ACTIONS.MAKE_REFERRAL
      ) {
        setIsApplyJobFlow(false);
        setIsApplyJobSuccessfully(false);
        localStorage.removeItem(hostname + "viewJob");
        setViewJob(null);
        cleanInputValue();
        setIsLiveChat(false);
        setFlowId();
        setSubscriberWorkflowId();
      }
    },
    [cleanInputValue]
  );

  const onSelectOption = async (item: IMenuItem) => {
    const { type, text } = item;
    setIsOpen(false);
    refreshInputStateIfNeed(type);

    if (type === CHAT_ACTIONS.MAKE_REFERRAL && employeeId) {
      const resMess = getValidationRefResponse(
        employeeJobCategory,
        refLastName,
        false
      );
      const makeRefMess = createTextMess({
        text,
        i18n: "buttons:make_referral",
        isOwn: true,
      });

      sendNewMessage({ isOwn: true, message: makeRefMess.content.text });
      sendNewMessage({ isOwn: false, message: resMess.content.text });

      setMessages((prevMessages) => [resMess, makeRefMess, ...prevMessages]);
      return;
    }

    switch (type) {
      case CHAT_ACTIONS.SEE_MY_REFERRALS:
        const inputString = `${clientApiToken}:${employeeId}:${refLastName}:${refBirth}`;
        const base64Encoded = btoa(inputString);
        const myReferralsTab = window.open(
          `https://${refURL}/refer/myreferrals/?rvid=${base64Encoded}&staging=true`,
          "_blank"
        );
        myReferralsTab?.focus();
        break;
      case CHAT_ACTIONS.SAVE_TRANSCRIPT:
        cleanInputValue();
        if (chatId) {
          try {
            if (emailAddress) {
              await apiInstance.sendTranscript({
                ChatID: chatId,
              });
            } else {
              const saveTranscriptMess = createTextMess({
                text,
                isOwn: true,
              });
              setMessages((prev) => [saveTranscriptMess, ...prev]);

              setCurrentMsgType(CHAT_ACTIONS.GET_EMAIL);
              setIsChatLoading(true);
              setTimeout(() => {
                setIsChatLoading(false);
                const chatbotMess = createTextMess({
                  text: t("messages:provideEmail"),
                  i18n: "messages:provideEmail",
                });

                sendNewMessage({
                  isOwn: false,
                  message: chatbotMess.content.text,
                });

                setMessages((prev) => [chatbotMess, ...prev]);
              }, 500);
            }
          } catch (error) {
            console.log("Send Transcript ERROR", error);
          }
        }
        break;
      case CHAT_ACTIONS.ASK_QUESTION:
        if (!chatConsent) {
          // setIsChatLoading(true);
          // setTimeout(() => {
          //   setIsChatLoading(false);
          //   setMessages((prev) => [
          //     ...getParsedMessages(
          //       getQuestions(isReferralEnabled, companyName)
          //     ),
          //     ...prev,
          //   ]);
          // }, 1000);
        } else {
          dispatch({
            type,
            payload: { item: text, isChatMessage: true },
            i18nProps: null,
          });
        }

        setIsShowResults(false);
        break;
      case CHAT_ACTIONS.CHANGE_LANG:
        setCurrentLanguage(text);
        await i18n.changeLanguage(text);
        localStorage.setItem(hostname + "currentLanguage", text);
        break;
      default:
        dispatch({
          type,
          payload: { item: text, isChatMessage: true },
          i18nProps: null,
        });
        setIsShowResults(false);
    }
  };

  const handleBurgerClick = useCallback(() => {
    !isOpen && setIsOpen(true);
  }, [isOpen]);

  return (
    <S.Wrapper>
      {isOpen && (
        <S.MenuItemsWrapper ref={wrapperRef}>
          {map(list, (item, index) => (
            <MenuItem
              key={`menu-item-${index}`}
              item={item}
              onClick={onSelectOption}
              onSelectLanguage={handleBurgerClick}
            />
          ))}
        </S.MenuItemsWrapper>
      )}
      <Burger isOpen={isOpen} onBurgerClick={handleBurgerClick} />
    </S.Wrapper>
  );
};

export default BurgerMenu;
