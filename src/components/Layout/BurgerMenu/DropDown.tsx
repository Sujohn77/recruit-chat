import React, { FC } from 'react';
import styled from 'styled-components';
import { colors } from 'utils/colors';

export const Wrapper = styled.div`
  background: ${colors.alto};
  position: absolute;
  border-radius: 5px;
  padding: 0 17px;
  animation: fade-in 0.1s ease-in forwards;
  right: -85px;
  top: -36px;
  opacity: 0;
  z-index: 1;
  cursor: pointer;
  @keyframes fade-in {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`;

type PropsType = {
  options: string[];
  onClick: (value: string) => void;
};
export const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;
export const Option = styled.li`
  padding: 11px 21px 10px;
  &:not(:last-child) {
    border-bottom: 1px solid ${colors.silverDark};
  }
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;
  text-transform: uppercase;
  margin: 0;
  color: ${colors.dustyGray};
`;
export const DropDown: FC<PropsType> = ({ options, onClick }) => {
  const items = options.map((opt, index) => (
    <Option key={`lang-option-${index}`} onClick={() => onClick(opt)}>
      {opt}
    </Option>
  ));
  return (
    <Wrapper>
      <List>{items}</List>
    </Wrapper>
  );
};
