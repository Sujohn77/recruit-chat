import React, { Dispatch, FC, SetStateAction } from 'react';
import styled from 'styled-components';

import { colors } from '../../../utils/colors';

import { Close } from '../../../screens/intro/styles';

import { useChatMessanger } from 'contexts/MessangerContext';

export const Wrapper = styled.div`
  height: 60px;
  background: #d9d9d9;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  padding: 14px 12px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  position: relative;
`;

export const Avatar = styled.div`
  width: 32px;
  height: 32px;
  background: ${colors.white};
  margin-right: 12px;
  border-radius: 50%;
`;

export const Title = styled.h3`
  font-family: Inter-Bold;
  font-size: 16px;
  line-height: 19px;
  margin: 0;
`;

export const CloseChat = styled(Close)`
  position: relative;
  margin-left: auto;
  height: 12px;
  width: 12px;
  top: initial;
  right: initial;
  cursor: pointer;
`;

const defaultTitle = 'Career bot';

type PropsType = {
  title?: string;
  setIsSelectedOption: Dispatch<SetStateAction<boolean>>;
};

export const ChatHeader: FC<PropsType> = ({
  title = defaultTitle,
  setIsSelectedOption,
}) => {
  return (
    <Wrapper>
      <Avatar />
      <Title>{title}</Title>
      <CloseChat
        onClick={() => {
          setIsSelectedOption(false);
        }}
      />
    </Wrapper>
  );
};
