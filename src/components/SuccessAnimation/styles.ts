import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  justify-content: center;
  position: relative;
`;

export const Circle = styled.div`
  box-shadow: 0 0 1px rgba(0, 0, 0, 0);
  border: 3px solid ${({ color }) => color};
  border-radius: 50%;
  display: block;
  width: 40px;
  height: 40px;
  position: relative;
  opacity: 0;
  animation-name: appear;
  animation-duration: 300ms;
  animation-timing-function: cubic-bezier(0.65, 0.05, 0.08, 0.99);
  animation-iteration-count: infinte;
  animation-delay: 0.5s;
  animation-fill-mode: forwards;
  transform: perspective(1px) translateZ(0);

  &:before {
    content: "";
    position: absolute;
    border: ${({ color }) => color} solid 7px;
    border-radius: 50%;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    opacity: 0;
    animation-duration: 1s;
    animation-name: ripple-out;
    animation-delay: 0.7s;
  }

  @keyframes appear {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @keyframes ripple-out {
    20% {
      opacity: 0.5;
    }
    100% {
      top: -15px;
      right: -15px;
      bottom: -15px;
      left: -15px;
      opacity: 0;
    }
  }
`;

export const Tick = styled.div`
  position: absolute;
  top: 9px;
  left: 7px;

  opacity: 0;
  display: block;
  transform-origin: (50%, 50%);
  transform: scale(0) perspective(1px) translateZ(0);
  transition: opacity 200ms ease;
  box-shadow: 0 0 1px rgba(0, 0, 0, 0);
  animation-name: pop;
  animation-duration: 600ms;
  animation-timing-function: cubic-bezier(0.65, 0.05, 0.08, 0.99);
  animation-iteration-count: infinte;
  animation-delay: 0.5s;
  animation-fill-mode: forwards;

  @keyframes pop {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }
`;
