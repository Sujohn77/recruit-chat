import styled from "styled-components";
import { DarkButton } from "components/Layout/styles";

export const MessWrapper = styled.div``;

export const BtnWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  margin-top: 10px;
  width: 100%;
`;

export const Button = styled(DarkButton)`
  font-weight: 500 !important;
  margin-bottom: 8px !important;
  min-height: 35px !important;
  padding: 8px !important;
  width: 100%;
  height: auto;
`;
