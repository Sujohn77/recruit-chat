import { Button } from "@mui/material";
import * as React from "react";
import styled from "styled-components";
import { colors } from "utils/colors";

export const Wrapper = styled.div`
  background: ${colors.alto};
  border-radius: 10px;
  padding: 24px 28px;
  margin: 0 auto;
  display: flex;
  flex-flow: column;
  gap: 20px;
  // width: 306px;
  margin-bottom: 24px;
`;
export const Title = styled.p`
  margin: 0;
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
export const SetJobAlert = styled(Button)`
  margin: 0 0 16px;
  color: ${colors.boulder};
  border: 1px solid ${colors.boulder};
`;
export const RefineJobSearch = styled(Button)`
  background: ${colors.boulder};
  border-radius: 100px;
`;

export const NoMatchJob = () => {
  return (
    <Wrapper>
      <Title>Sorry, No match yet</Title>
      {/* <Avatar />
      <SetJobAlert value="Set Job Alert" />
      <RefineJobSearch value="Refine job search" /> */}
    </Wrapper>
  );
};
