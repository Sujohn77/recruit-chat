import styled from "styled-components";
import { DarkButton } from "components/Layout/styles";

export const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const TextWrapper = styled.div`
  margin-bottom: 20px;
`;

export const Text = styled.span`
  display: block;
  text-align: center;
`;

export const ButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  margin-top: 10px;
  width: 80%;
`;

export const Button = styled(DarkButton)`
  font-weight: 500 !important;
  margin-bottom: 8px !important;
  min-height: 35px !important;
  padding: 8px !important;
  width: 40%;
  height: auto;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
