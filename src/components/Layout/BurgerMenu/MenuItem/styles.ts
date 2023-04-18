import styled from "styled-components";

export const MenuItemWrapper = styled.div`
  display: flex;
  padding: 0 6px;
  font-size: 14px;
  line-height: 17px;
  padding: 11px 0;
  cursor: pointer;
  color: ${(props) => props.theme.primaryColor};

  &:before {
    content: "";
    background: ${(props) => props.theme.primaryColor};
    display: inline-block;
    margin-right: 8px;
    width: 16px;
    border-radius: 50%;
  }

  &:not(:last-child) {
    border-bottom: 1px solid #c4c4c4;
  }
`;
