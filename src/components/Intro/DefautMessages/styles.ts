import { Button } from '@mui/material';
import { MessageBox } from 'components/Chat/MessagesList/Message/styles';
import styled from 'styled-components';
import { colors } from 'utils/colors';

const borderWidth = '1.5px';
const animationDuration = '0.4s';
export const Flex = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
`;

export const Wrapper = styled(Flex)`
    margin-left: 16px;
    margin-bottom: 18px;
`;

export const Close = styled.div<{ height?: string; color?: string }>`
    position: absolute;
    right: 16px;
    top: 10px;
    cursor: pointer;
    width: 18px;
    height: 18px;
    &:before,
    &:after {
        content: '';
        height: ${({ height = '17px' }) => height};
        width: ${borderWidth};
        background: ${({ color }) => color};
        display: inline-block;
        position: absolute;
        top: 1px;
        left: 9px;
    }
    &:before {
        transform: rotate(-45deg);
    }
    &:after {
        transform: rotate(45deg);
    }
`;

export const Message = styled.div`
    border-radius: 20px;
    padding: 11px 16px;
    white-space: nowrap;
    overflow: hidden;
    background: ${({ theme: { message } }) => message.chat.backgroundColor}!important;

    font-size: calc(8px + 1vmin);
    margin: 0 0 10px;
    text-align: center;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    span {
        color: ${({ theme }) => theme?.message.initialColor}!important;
    }
    animation: opacity 0.3s ease-in;

    &:nth-child(2) {
        animation: opacity 0.6s ease-in;
    }

    @keyframes opacity {
        0% {
            opacity: 0;
        }
        100% {
            opacity: 1;
        }
    }
`;

export const Question = styled(MessageBox)`
    width: 225px;
    padding: 0px 16px;
    line-height: 41px;
    border: none;
    /* overflow: hidden; */
    color: ${({ theme: { message } }) => message.chat.color};
    font-weight: 500;
    height: 41px;
    box-sizing: border-box;
    margin-bottom: 12px;
    animation: fade 0.3s ease-in;
    @keyframes fade {
        0% {
            transform: scale(0.85) translate(-30px);
            opacity: 0;
        }

        100% {
            transform: scale(1) translate(0);
            opacity: 1;
        }
    }
`;

export const Text = styled.span`
    font-size: 14px;
    font-family: Inter-Medium;
    color: ${(props) => props.theme.initialColor};
`;

export const Image = styled.img<{ size?: string }>`
    width: ${({ size = '20px' }) => size};
    height: ${({ size = '20px' }) => size};
`;
export const IntroImage = styled(Image)<{ isRounded?: boolean }>`
    max-width: 34px;
    border-radius: ${(props) => props.isRounded && '50%'};
    border: ${(props) => `1px solid ${props.theme.primaryColor}`};
    box-sizing: border-box;
`;
export const IntroImageBackground = styled.div<{ source: string }>`
    width: 20px;
    height: 20px;
    background: ${({ source }) => source} no-repeat;
    background-size: cover;
`;
export const Options = styled(Flex)`
    margin-left: auto;
    width: fit-content;
    gap: 8px;
    animation: fade 0.4s ease-in;
    margin: 22px 0 0;
`;

export const InfoContent = styled.div`
    @keyframes fadeInfoOut {
        0% {
            height: 100%;
            width: 259px;
        }
        100% {
            height: 0;
            width: 0;
        }
    }
    height: 100%;
    overflow: hidden;
`;

export const ImageButton = styled(Button)`
    min-width: 34px !important;
    height: 34px;
    width: 34px;
    flex-shrink: 1;
    border-radius: 50% !important;
    background: ${colors.alto}!important;
    text-aling: center !important;
    line-height: 34px;
    box-sizing: border-box;
`;
