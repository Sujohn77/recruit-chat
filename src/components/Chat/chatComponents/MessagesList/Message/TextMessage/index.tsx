import { FC, memo, useEffect } from "react";
import DOMPurify from "isomorphic-dompurify";

import { ReferralOptionList } from "./ReferralOptionList";
import { ICONS } from "assets";
import { getMessageProps } from "utils/helpers";
import { MessageOptionTypes, autolinkerClassName } from "utils/constants";
import { ILocalMessage, MessageType } from "utils/types";
import { LocationList, LocationItem } from "./styles";
import { OptionList } from "./OptionList";
import { renderSendingTime } from "..";
import * as S from "../styles";
import { Icon } from "../../styles";

interface ITextMessageProps {
  message: ILocalMessage;
  index?: number;
}

export const TextMessage: FC<ITextMessageProps> = memo(({ message, index }) => {
  const subType = message?.content.subType;
  const messageProps = { ...getMessageProps(message) };

  const isFile = subType === MessageType.FILE;
  useEffect(() => {
    // for a clickable link in message text
    let listeners: undefined | NodeListOf<Element>;
    const listenersClones: Node[] = [];

    if (message?.content.text?.includes(autolinkerClassName)) {
      listeners = document.querySelectorAll(`.${autolinkerClassName}`);
      for (let i = 0; i < listeners.length; i++) {
        listenersClones.push(listeners[i].cloneNode(true));
        const listener = listeners[i];

        if (listener.innerHTML) {
          listener.addEventListener("click", () => {
            const newTab = window.open(listener.innerHTML, "_blank");
            newTab?.focus?.();
          });
        }
      }
    }

    return () => {
      // remove listeners
      if (message?.content.text?.includes(autolinkerClassName)) {
        listeners = document.querySelectorAll(`.${autolinkerClassName}`);
        for (let i = 0; i < listeners.length; i++) {
          listeners[i].replaceChild(listenersClones[i], listeners[i]);
        }
      }
    };
  }, []);

  // TODO: fix
  const wrongMess = !!message.isOwn && !!message.optionList;

  return wrongMess ? null : (
    <S.MessageBox {...messageProps}>
      <S.MessageContent
        isFile={isFile}
        withOptions={!!message.optionList}
        isOwn={message.isOwn}
      >
        {isFile && <Icon src={ICONS.ATTACHED_FILE} />}

        {message.content.locations ? (
          <LocationList>
            {message.content.locations.map((l, i) => (
              <LocationItem key={`${l}-${i}`}>{l}</LocationItem>
            ))}
          </LocationList>
        ) : message?.content.text?.includes(autolinkerClassName) ? (
          <S.MessageText
            dangerouslySetInnerHTML={{
              // DOMPurify DOMPurify sanitizes HTML and prevents XSS attacks. (converts a "dirty" HTML string to a clean HTML string)
              __html: DOMPurify.sanitize(message?.content.text),
            }}
          />
        ) : (
          <S.MessageText>
            {message?.content?.text || message?.content.subType}
          </S.MessageText>
        )}

        {renderSendingTime(message)}

        {message.optionList &&
          (message.optionList.type === MessageOptionTypes.Referral ? (
            <ReferralOptionList
              messageId={message._id}
              optionList={message.optionList}
              chatItemId={message.chatItemId}
              message={message}
            />
          ) : (
            <OptionList
              index={index}
              chatItemId={message.chatItemId}
              optionList={message.optionList}
            />
          ))}
      </S.MessageContent>
    </S.MessageBox>
  );
});
