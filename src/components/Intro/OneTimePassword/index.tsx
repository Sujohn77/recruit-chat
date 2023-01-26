import { TextMessage } from 'components/Chat/MessagesList/Message/TextMessage';
import * as React from 'react';
import { ImageButton, IntroImage, Message } from 'screens/intro/styles';
import { useTheme } from 'styled-components';
import { ICONS } from 'utils/constants';
import { generateLocalId } from 'utils/helpers';
import { ThemeType } from 'utils/theme/default';
import { MessageType } from 'utils/types';
import { OtpForm } from './OtpForm';
import * as S from './styles';

export const OneTimePassword = () => {
  const theme = useTheme() as ThemeType;
  return (
    <S.Wrapper>
      <S.IntroImageButton>
        <IntroImage
          src={theme?.imageUrl || ICONS.LOGO}
          size="20px"
          alt="rob-face"
        />
      </S.IntroImageButton>
      <S.OtpContent>
        <TextMessage
          message={{
            _id: generateLocalId(),
            content: {
              subType: MessageType.TEXT,
              text: 'We have sent you a temporary code by email. Enter it in the box below!',
            },
          }}
        />
        <OtpForm />
      </S.OtpContent>
    </S.Wrapper>
  );
};
