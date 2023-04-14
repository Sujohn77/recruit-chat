import styled from "styled-components";

export const InputWrapper = styled.div`
  width: 270px;
  padding: 1px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: baseline;
  max-height: 71px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 7px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: rgba(0, 0, 0, 0.5);
    -webkit-box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
  }

  & input {
    height: 30px;
    box-sizing: border-box;
    padding: 4px 6px;
    width: 0;
    min-width: 30px;
    flex-grow: 1;
    margin: 0;
  }
`;

export const TagWrapper = styled.div`
  display: flex;
  align-items: baseline;
  background: ${({ theme: { message } }) => message.backgroundColor};
  border-radius: 100px;
  box-sizing: border-box;
  padding: 7px 12px;
  gap: 12px;
  outline: 0;
  overflow: hidden;
  align-items: center;
  padding-right: 5px;
  color: ${({ theme: { message } }) => message.primaryColor};
  font-size: 14px;
  line-height: 17px;

  div {
    cursor: pointer;
    position: relative;
    width: 16px;
    height: 16px;
    top: -1px;
    right: 5px;
  }

  & span {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  & svg {
    font-size: 12px;
    cursor: pointer;
    padding: 4px;
  }
`;
