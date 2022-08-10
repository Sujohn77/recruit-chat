import React, { Dispatch, FC, SetStateAction } from 'react';
import styled from 'styled-components';

import { colors } from '../../../utils/colors';

import { Close, Flex } from '../../../screens/intro/styles';
import { useChatMessanger } from 'contexts/MessangerContext';
import { BackButton } from '../ViewJob/styles';

export const ChatHeaderWrapper = styled.div`
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

export const ViewTitle = styled.h3`
  margin: 0 auto;
  font-size: 14px;
  line-height: 17px;
  font-family: Inter;
  font-weight: 500;
`;

export const CloseChat = styled(Close)`
  position: relative;
  margin-left: auto;
  height: 12px;
  width: 12px;
  top: initial;
  right: 10px;
  cursor: pointer;
`;

export const ViewHeader = styled(Flex)``;

const defaultTitle = 'Career bot';

type PropsType = {
  title?: string;
  setIsSelectedOption: Dispatch<SetStateAction<boolean>>;
};

export const ChatHeader: FC<PropsType> = ({
  title = defaultTitle,
  setIsSelectedOption,
}) => {
  const { viewJob, setViewJob } = useChatMessanger();

  const handleBackButton = () => {
    setViewJob(null);
  };

  return (
    <ChatHeaderWrapper>
      {viewJob && (
        <Flex>
          <BackButton onClick={handleBackButton} />
          <ViewTitle>{title}</ViewTitle>
        </Flex>
      )}
      {!viewJob && (
        <>
          <Avatar />
          <Title>{title}</Title>
          <CloseChat
            onClick={() => {
              setIsSelectedOption(false);
            }}
          />
        </>
      )}
    </ChatHeaderWrapper>
  );
};
