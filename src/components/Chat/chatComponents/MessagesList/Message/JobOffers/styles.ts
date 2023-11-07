import styled from "styled-components";
import { COLORS } from "utils/colors";

export const Wrapper = styled.div`
  position: relative;
  /* font-family: Inter-SemiBold; */
  margin: 0 0 16px;
  button {
    opacity: 1;
  }

  div.my-carousel {
    > div:nth-child(2) {
      right: -10px;
      display: none;
    }
    > div:nth-child(3) {
      left: -10px;
      display: none;
    }
  }
`;

export const PrevSlide = styled.div`
  cursor: pointer;
  padding: 0.1em 0 0;
  background: #575757;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 5px;
  top: calc(50% - 20px);
  box-sizing: border-box;
  z-index: 1;
  transform: rotate(-135deg);
`;

export const Slide = styled.div`
  width: 9px;
  height: 9px;
  margin-right: 0.2em;

  box-sizing: border-box;

  &::before {
    content: "";
    width: 100%;
    height: 100%;
    border-width: 1.5px 1.5px 0 0;
    border-style: solid;
    border-color: ${COLORS.ALABASTER};
    display: block;
  }

  &:after {
    content: "";
    float: left;
    position: relative;
    top: -100%;
    width: 100%;
    height: 100%;
    border-width: 0 1.5px 0 0;
    border-style: solid;
    border-color: ${COLORS.ALABASTER};
  }
`;

export const NextSide = styled(PrevSlide)`
  right: 5px;
  transform: rotate(45deg);
  left: initial;
`;
