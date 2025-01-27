import { useChatMessenger } from "contexts/MessengerContext";
import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import map from "lodash/map";

import * as S from "./styles";
import { Burger } from "./Burger";
import { MenuItem } from "./MenuItem";
import { ConfirmPanel } from "./ConfirmPanel";
import {
  baseWithRefItems,
  baseWithRef,
  menuForCandidateWithEmail,
  menuItems,
} from "./data";
import i18n from "services/localization";
import { apiInstance } from "services/api";
import { createTextMess } from "utils/helpers";
import { CHAT_ACTIONS, IMenuItem, MessageType, NextMsgType } from "utils/types";
import { getValidationRefResponse, ReferralSteps } from "../ChatInput/data";

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
    isApplyJobFlow,
    isApplyJobSuccessfully,
    setReferralStep,
    companyName,
  } = useChatMessenger();

  const wrapperRef = useRef<HTMLDivElement>(null);

  const [showPopUp, setShowPopUp] = useState(false);
  const [nxtMsgType, setNxtMsgType] = useState<NextMsgType | null>(null);
  const [isReferralClicked, setIsReferralClicked] = useState(false);

  // const isLastMessRef = messages[0]?.content.subType === MessageType.REFERRAL;

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
      return baseWithRef(languages, isMultiLanguage, isReferralClicked);
    } else if (isReferralEnabled) {
      return baseWithRefItems(languages, isMultiLanguage, isReferralClicked);
    } else return defaultItems;
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
    isReferralClicked,
  ]);

  useEffect(() => {
    employeeId && setIsReferralClicked(true);
  }, [employeeId]);

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
        setFlowId(undefined);
        setSubscriberWorkflowId(undefined);
      }
    },
    [cleanInputValue]
  );

  const onLeaveApplyJob = useCallback((type: NextMsgType) => {
    setShowPopUp(true);
    setNxtMsgType(type);
  }, []);

  const onSelectOption = async (item: IMenuItem) => {
    const { type, text } = item;
    setIsOpen(false);
    !isApplyJobFlow && !isApplyJobSuccessfully && refreshInputStateIfNeed(type);

    if (type === CHAT_ACTIONS.MAKE_REFERRAL) {
      if (!isApplyJobFlow && !isApplyJobSuccessfully) {
        const resMess = refLastName?.trim()
          ? getValidationRefResponse(employeeJobCategory, refLastName, false)
          : null;
        const makeRefMess = createTextMess({
          text,
          i18n: "buttons:make_referral",
          isOwn: true,
        });

        sendNewMessage({
          isOwn: true,
          message: makeRefMess.content.text,
          localId: makeRefMess.localId.toString(),
        });

        if (resMess) {
          sendNewMessage({
            isOwn: false,
            message: resMess.content.text,
            localId: resMess.localId,
          });

          setMessages((prevMessages) => [
            resMess,
            makeRefMess,
            ...prevMessages,
          ]);
        } else {
          setCurrentMsgType(CHAT_ACTIONS.MAKE_REFERRAL);
          const employeeQuestion = createTextMess({
            text: t("messages:employeeId", {
              companyName,
            }),
            i18n: "messages:employeeId",
            i18nProps: {
              companyName,
            },
          });

          sendNewMessage({
            isOwn: false,
            message: employeeQuestion.content.text,
            localId: employeeQuestion.localId,
          });

          setMessages((prevMessages) => [
            employeeQuestion,
            makeRefMess,
            ...prevMessages,
          ]);
          setReferralStep(ReferralSteps.EmployeeId);
        }

        return;
      } else {
        onLeaveApplyJob(type);
      }
    }

    switch (type) {
      case CHAT_ACTIONS.SEE_MY_REFERRALS:
        const inputString = `${clientApiToken}:${employeeId}:${refLastName}:${refBirth}`;
        const base64Encoded = btoa(inputString);
        const myReferralsTab = window.open(
          `https://${refURL}/refer/myreferrals/?rvid=${base64Encoded}`,
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
              const successMess = createTextMess({
                text,
                isOwn: false,
                subType: MessageType.TRANSCRIPT,
              });
              setMessages((prev) => [successMess, ...prev]);
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
                  localId: chatbotMess.localId,
                });

                setMessages((prev) => [chatbotMess, ...prev]);
              }, 500);
            }
          } catch (error) {
            console.log("Send Transcript ERROR", error);
          }
        }
        break;
      case CHAT_ACTIONS.CHANGE_LANG:
        setCurrentLanguage(text);
        await i18n.changeLanguage(text);
        localStorage.setItem(hostname + "currentLanguage", text);
        break;
      case CHAT_ACTIONS.ASK_QUESTION:
        if (!isApplyJobFlow && !isApplyJobSuccessfully) {
          if (!chatConsent) {
            // show chat consent msg
          } else {
            dispatch({
              type,
              payload: { item: text, isChatMessage: true },
              i18nProps: null,
            });
          }
        } else {
          onLeaveApplyJob(type);
        }

        setIsShowResults(false);
        break;
      case CHAT_ACTIONS.FIND_JOB:
        if (!isApplyJobFlow && !isApplyJobSuccessfully) {
          dispatch({
            type,
            payload: { item: text, isChatMessage: true },
            i18nProps: null,
          });
        } else {
          onLeaveApplyJob(type);
        }
        setIsShowResults(false);
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
      <ConfirmPanel
        showPopUp={showPopUp}
        setShowPopUp={setShowPopUp}
        nxtMsgType={nxtMsgType}
        setNxtMsgType={setNxtMsgType}
      />

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
