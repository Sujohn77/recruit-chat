import React from "react";
import styled from "styled-components";

import { colors } from "../../../utils/colors";

import { Close } from "../../../screens/intro/styles";
import { setOption } from "redux/slices";
import { useDispatch } from "react-redux";

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
  font-weight: 700;
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

const defaultTitle = "Career bot";

export const HeadLine = ({ title = defaultTitle }) => {
  const dispatch = useDispatch();
  return (
    <Wrapper>
      <Avatar />
      <Title>{title}</Title>
      <CloseChat onClick={() => dispatch(setOption(null))} />
    </Wrapper>
  );
};
