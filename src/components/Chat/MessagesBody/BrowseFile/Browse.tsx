import React from "react";
import styled from "styled-components";
import { colors } from "utils/colors";

const Input = styled.input`
  margin: 0 0 16px;
  color: ${colors.black};
  background: ${colors.silverChalice};
  padding: 11px 0;
  text-align: center;
  width: 100%;
  font-size: 14px;
  line-height: 17px;
`;

export const Browse = () => {
  return (
    <div>
      <Input type="file" id="myfile" name="myfile" multiple />
    </div>
  );
};
