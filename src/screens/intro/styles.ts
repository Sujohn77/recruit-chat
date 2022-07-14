
import styled from 'styled-components';
import { colors } from '../../utils/colors';

const borderWidth = '1.5px';

export const Flex = styled.div`
  display: flex;
  gap: 30px;
  justify-content: space-between;
`;
export const Wrapper = styled.div`
  position: relative;
`;

export const Close = styled.div`
    position: absolute;
    right: 20px;
    top: 10px;
    &:before, &:after {
        content: "";  
        height: 15px;
        width: ${borderWidth}; 
        background: #000;
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
  box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.2);
  padding: 10px 10px;
  color: ${colors.shamrock};
  border: 1px solid ${colors.shamrock};
  font-size: calc(10px + 1vmin);
  margin: 0 0 10px;
  text-align: center;
  cursor: pointer;

  display: flex;
  gap: 10px;
`;

export const Question = styled(Message)`
  padding: 20px 60px 20px 20px;
  border: none;
  color: ${colors.zambesi};
  font-weight: 600;
`;

export const Text = styled.span`

`;

export const Image = styled.img`

`;

export const InfoContent = styled.div`
  
`;

export const Options = styled(Flex)`
  margin-left: auto;
  width: fit-content;
  gap: 15px;
`;