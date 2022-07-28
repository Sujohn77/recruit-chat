
import { Button } from '@mui/material';
import styled from 'styled-components';
import { colors } from '../../utils/colors';

const borderWidth = '1.5px';
const introQuestionShadow = '5px 5px 25px 10px rgb(0 0 0 / 8%);';
const messageShadow = '5px 5px 25px 10px rgb(0 0 0 / 8%);'

export const Flex = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
export const Wrapper = styled.div`
  position: relative;
  width: 365px;
`;

export const Close = styled.div<{height?: string}>`
    position: absolute;
    right: 20px;
    top: 10px;
    cursor: pointer;
    &:before, &:after {
        content: "";  
        height: ${({height = '17px'}) => height};
        width: ${borderWidth}; 
        background: ${({color = '#000'}) => color};
        display: inline-block;
        position: absolute;
        top: 0px;
    }
    &:before {
        transform: rotate(-45deg);
    }
    &:after {
        transform: rotate(45deg);
    }
`;

export const Message = styled.div`
  border-radius: 25px;  
  box-shadow: ${messageShadow};
  padding: 10px 10px;
  color: ${colors.shamrock};
  border: 1px solid ${colors.shamrock};
  font-size: calc(8px + 1vmin);
  margin: 0 0 10px;
  text-align: center;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
`;

export const Question = styled(Message)`
  box-shadow: ${introQuestionShadow};
  padding: 20px 60px 20px 20px;
  border: none;
  color: ${colors.zambesi};
  font-weight: 600;
`;

export const Text = styled.span`
  font-size: 13px;
`;

export const Image = styled.img<{size?: string}>`
    width: ${({size = '20px'}) => size};
    height: ${({size = '20px'}) => size};
    border-radius: 50%;
    
`;
export const IntroImage = styled(Image)`
  animation: pulsing 2.5s infinite ease-in-out;
  
  @keyframes pulsing {
    0% {
      transform: scale(1);
      box-shadow: 0px 0px 0px 0px rgb(0 0 0 / 60%)
    }
   
    50% {
      box-shadow: 0px 0px 0px 10px rgb(0 0 0 / 0%)
    }
    75% {
      transform: scale(1.1);
    }
  
    100% {
      box-shadow: 0px 0px 0px 8px rgb(0 0 0 / 0%)
      transform: scale(1);
    }
  }
`;
export const Options = styled(Flex)`
  margin-left: auto;
  width: fit-content;
  gap: 5px;
`;

export const InfoContent = styled.div`
`;

export const ImageButton = styled(Button)`
  width: 60px;
  border-radius: 50%!important;
 
`;