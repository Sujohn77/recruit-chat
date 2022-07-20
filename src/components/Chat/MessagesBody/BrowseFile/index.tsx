import * as React from "react";
import { Button } from "@mui/material";

import styled from "styled-components";
import { colors } from "utils/colors";

export const Wrapper = styled.div`
  background: ${colors.alto};
  border-radius: 10px;
  padding: 32px 17px 16px;
  margin: 0 auto;
  display: flex;
  flex-flow: column;
  width: 220px;
  align-items: center;
  color: ${colors.dustyGray};
  border-radius: 10px;
`;
export const Title = styled.p`
  margin: 0 0 24px;
  font-size: 14px;
  line-height: 17px;
  color: ${colors.black};
`;
export const Avatar = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin: 0 0 16px;
  background: ${colors.white};
`;
export const Browse = styled.label`
  margin: 11px 0 16px;
  color: ${colors.black};
  background: ${colors.silverChalice};
  padding: 11px 0;
  text-align: center;
  width: 100%;
  font-size: 14px;
  line-height: 17px;
  border-radius: 100px;
  font-weight: 500;
`;

export const Cancel = styled(Button)`
  font-size: 14px;
  line-height: 17px;
  border-bottom: 1px solid ${colors.black};
`;

export const Text = styled.p`
  margin: 0 0 16px;
`;

export const BrowseFile = () => {
  return (
    <Wrapper>
      <Avatar />
      <Text>Lorem ipsum dolor sit amet</Text>
      <Text>or</Text>
      <Browse htmlFor="myfile">Browse</Browse>
      <input type="file" id="myfile" name="myfile" multiple hidden />
      <Cancel value="Cancel" />
    </Wrapper>
  );
};
