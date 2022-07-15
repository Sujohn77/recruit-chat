import * as React from "react";
import { Button } from "@mui/material";

import styled from "styled-components";
import { colors } from "utils/colors";

export const Wrapper = styled.div`
  background: ${colors.alto};
  border-radius: 10px;
  padding: 24px 28px;
  margin: 0 auto;
  display: flex;
  flex-flow: column;
  gap: 16px;
  width: 306px;
`;
export const Title = styled.p`
  margin: 0 0 24px;
  font-size: 14px;
  line-height: 17px;
  color: ${colors.black};
`;
export const Avatar = styled.div`
  widht: 40px;
  height: 40px;
  border-radius: 50%;
  margin: 0 0 32px;
`;
export const Browse = styled(Button)`
  margin: 0 0 16px;
  color: ${colors.black};
  background: ${colors.silverChalice};
  padding: 11px 0;
  text-align: center;
  width: 100%;
  font-size: 14px;
  line-height: 17px;
`;

export const Cancel = styled(Button)`
  font-size: 14px;
  line-height: 17px;
  border-bottom: 1px solid ${colors.black};
`;

export const Text = styled.p`
  margin: 0 0 24px;
`;
export const BrowseFile = () => {
  return (
    <Wrapper>
      <Avatar />
      <Text>Lorem ipsum dolor sit amet</Text>
      <Text>or</Text>
      <Browse value="Browse" />
      <Cancel value="Cancel" />
    </Wrapper>
  );
};
