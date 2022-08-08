import * as React from 'react';
import i18n from 'services/localization';
import styled from 'styled-components';
import { colors } from 'utils/colors';

export const Wrapper = styled.div`
  background: ${colors.alto};
  border-radius: 10px;
  padding: 16px 18px;
  display: flex;
  flex-flow: column;
  gap: 20px;
  width: 249px;
  margin-bottom: 24px;
  box-sizing: border-box;
`;
export const Title = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 17px;
  color: ${colors.scorpion};
  text-align: center;
`;
export const Avatar = styled.div`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  margin: 0 auto;
  background-color: ${colors.white};
`;

export const TranscriptSent = () => {
  const enterEmailTxt = i18n.t('chat_item_description:transcript_sent');
  return (
    <Wrapper>
      <Title>{enterEmailTxt}</Title>
      <Avatar />
    </Wrapper>
  );
};
