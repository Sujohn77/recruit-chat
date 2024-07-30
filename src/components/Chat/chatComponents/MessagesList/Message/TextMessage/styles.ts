import styled from "styled-components";

export const LocationList = styled.ul`
  margin: 0;
  padding: 0px 0px 0px 10px;
  list-style-type: none;
`;

export const LocationItem = styled.li`
  color: ${({ theme }) => theme.messageTextColor};
`;

export const LinkWrapper = styled.span`
  text-decoration: underline;
  text-decoration-color: ${({ theme }) => theme.linkColor};
  color: ${({ theme }) => theme.linkColor};
  cursor: pointer;
`;

export const SendingTime = styled.span<{ isOwn?: boolean }>`
  position: absolute;
  right: ${({ isOwn }) => (isOwn ? 14 : 77)}px;
  bottom: 8px;
`;
