import React, { FC } from 'react';

import * as S from './styles';
import i18n from 'services/localization';
import { Button } from 'components/Layout/styles';
import { ICONS } from 'utils/constants';

import { CHAT_ACTIONS, ILocalMessage } from 'utils/types';
import { getMessageProps } from 'utils/helpers';
import { useChatMessanger } from 'contexts/MessangerContext';

type PropsType = { message: ILocalMessage };

export const HiringHelp: FC<PropsType> = ({ message }) => {
  const { triggerAction } = useChatMessanger();

  const messagesProps = getMessageProps(message);
  const title = i18n.t('chat_item_description:hiring_help_title');
  const helpTxt = i18n.t('chat_item_description:hiring_help_text');
  const helpfulTxt = i18n.t('chat_item_description:hiring_helpful_text');

  const onClick = () => {
    triggerAction({ type: CHAT_ACTIONS.HELP });
  };

  const handleFeedBackClick = () => {};

  return (
    <S.Wrapper {...messagesProps}>
      <S.Section>
        <S.Title>{title}</S.Title>
        <Button onClick={onClick}>{helpTxt}</Button>
      </S.Section>
      <S.Text>{helpfulTxt}</S.Text>
      <S.FeedBackIcons>
        <FeedBackIcon isReversed onClick={handleFeedBackClick} />
        <FeedBackIcon onClick={handleFeedBackClick} />
      </S.FeedBackIcons>
    </S.Wrapper>
  );
};

interface IFeedBackIconProps {
  isReversed?: boolean;
  onClick: () => void;
}
export const FeedBackIcon: FC<IFeedBackIconProps> = ({
  isReversed = false,
  onClick,
}) => {
  return (
    <S.FeedbackIconWrapper isReversed={isReversed} onClick={onClick}>
      <img src={ICONS.FINGER_UP} alt="down" width={22} height={20} />
    </S.FeedbackIconWrapper>
  );
};
