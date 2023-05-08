import { FC, memo, useEffect } from "react";
import moment from "moment";
import DOMPurify from "isomorphic-dompurify";

import { ICONS, IMAGES } from "assets";
import { getMessageProps } from "utils/helpers";
import { autolinkerClassName } from "utils/constants";
import { ILocalMessage, MessageType } from "utils/types";
import { MS_1000 } from "..";
import { Icon } from "../../styles";
import * as S from "../styles";

interface ITextMessageProps {
  message: ILocalMessage;
  isLastMessage?: boolean;
}

export const TextMessage: FC<ITextMessageProps> = memo(
  ({ message, isLastMessage }) => {
    const subType = message.content.subType;
    const messageProps = { ...getMessageProps(message) };

    const isFile = subType === MessageType.FILE;
    const createdAt = moment(message.dateCreated?.seconds! * MS_1000).format(
      "HH:mm A"
    );

    useEffect(() => {
      // for a clickable link in message text
      let listeners: undefined | NodeListOf<Element>;
      const listenersClones: Node[] = [];

      if (message.content.text?.includes(autolinkerClassName)) {
        listeners = document.querySelectorAll(`.${autolinkerClassName}`);
        for (let i = 0; i < listeners.length; i++) {
          listenersClones.push(listeners[i].cloneNode(true));

          listeners[i].addEventListener("click", () => {
            if (listeners?.[i].innerHTML) {
              const newTab = window.open(listeners?.[i].innerHTML, "_blank");
              newTab?.focus?.();
            }
          });
        }
      }

      return () => {
        // remove listeners
        if (message.content.text?.includes(autolinkerClassName)) {
          listeners = document.querySelectorAll(`.${autolinkerClassName}`);
          for (let i = 0; i < listeners.length; i++) {
            listeners[i].replaceChild(listenersClones[i], listeners[i]);
          }
        }
      };
    }, []);

    const renderSendingTime = (message: ILocalMessage) => {
      if (message.localId !== message._id && message.isOwn) {
        if (message._id) {
          return (
            <S.TimeText>{message.dateCreated?.seconds && createdAt}</S.TimeText>
          );
        }
        return <S.MessageUnsendIcon src={IMAGES.CLOCK} />;
      }

      return null;
    };

    return (
      <S.MessageBox {...messageProps} isLastMessage={isLastMessage}>
        <S.MessageContent isFile={isFile}>
          {isFile && <Icon src={ICONS.ATTACHED_FILE} />}

          {message.content.text?.includes(autolinkerClassName) ? (
            <S.MessageText
              dangerouslySetInnerHTML={{
                // DOMPurify DOMPurify sanitizes HTML and prevents XSS attacks. (converts a "dirty" HTML string to a clean HTML string)
                __html: DOMPurify.sanitize(message.content.text),
              }}
            />
          ) : (
            <S.MessageText>
              {message.content.text || message.content.subType}
            </S.MessageText>
          )}

          {renderSendingTime(message)}
        </S.MessageContent>
      </S.MessageBox>
    );
  }
);
