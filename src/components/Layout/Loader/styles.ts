import styled from "styled-components";

interface IWrapperProps {
  absolutePosition?: boolean;
}

export const Wrapper = styled.div<IWrapperProps>`
  display: flex;
  align-items: center;
  gap: 8px;

  ${({ absolutePosition = true }) =>
    absolutePosition &&
    `position: absolute;
    bottom: 10px;
    left: 16px;`}
`;

export const Dot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${({ theme: { message } }) => message.backgroundColor};
  animation: mercuryTypingAnimation 1.8s infinite ease-in-out;

  &:nth-child(1) {
    animation-delay: 200ms;
  }
  &:nth-child(2) {
    animation-delay: 300ms;
  }
  &:nth-child(3) {
    animation-delay: 400ms;
  }

  @keyframes mercuryTypingAnimation {
    0% {
      transform: translateY(0px);
      background-color: #6cad96;
    }
    28% {
      transform: translateY(-7px);
      background-color: #9ecab9;
    }
    44% {
      transform: translateY(0px);
      background-color: #b5d9cb;
    }
  }
`;
