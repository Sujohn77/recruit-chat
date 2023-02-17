import { useAuthContext } from 'contexts/AuthContext';
import { useChatMessenger } from 'contexts/MessangerContext';
import React, { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import i18n from 'services/localization';
import { useTheme } from 'styled-components';
import { ICONS } from 'utils/constants';
import { ThemeType } from 'utils/theme/default';
import { CHAT_ACTIONS } from 'utils/types';
import * as S from './styles';
import { IOption } from './types';

const messages = {
    options: [
        {
            icon: ICONS.SEARCH_ICON,
            message: i18n.t('buttons:find_job'),
            type: CHAT_ACTIONS.FIND_JOB,
            size: '16px',
        },
        {
            icon: ICONS.QUESTION,
            message: i18n.t('buttons:ask_questions'),
            type: CHAT_ACTIONS.ASK_QUESTION,
            size: '16px',
        },
    ],
};

type PropsType = {
    setIsEmailForm: Dispatch<SetStateAction<boolean>>;
    text: string;
    isOptions?: boolean;
    setIsSelectedOption: Dispatch<SetStateAction<boolean>>;
};

export const DefaultMessages: FC<PropsType> = ({ setIsEmailForm, text, isOptions = true, setIsSelectedOption }) => {
    const theme = useTheme() as ThemeType;
    const [initialOption, setInitialOption] = useState<IOption | null>(null);
    const { subscriberID, isVerified } = useAuthContext();
    const { triggerAction } = useChatMessenger();

    useEffect(() => {
        if (isVerified && initialOption) {
            const { message: item, type } = initialOption;
            triggerAction({ type, payload: { item, isChatMessage: true } });
            setInitialOption(null);
        }
    }, [isVerified, triggerAction, initialOption]);

    const onClick = (option: IOption) => {
        const { message: item, type } = option;

        if (subscriberID) {
            setIsSelectedOption(true);
            triggerAction({ type, payload: { item, isChatMessage: true } });
        } else {
            setInitialOption(option);
        }
        setIsEmailForm(!subscriberID);
    };

    const chooseOptions = messages.options.map((opt, index) => (
        <S.Message key={`chat-option-${index}`} onClick={() => onClick(opt)}>
            {opt.icon && <S.Image src={opt.icon} size={opt.size} alt={''} />}
            <S.Text>{opt.message}</S.Text>
        </S.Message>
    ));

    return (
        <S.Wrapper>
            <S.IntroImage src={theme?.imageUrl || ICONS.LOGO} size="34px" alt="rob-face" isRounded />

            <S.InfoContent>
                <S.Question>{text}</S.Question>
                {isOptions && <S.Options>{chooseOptions}</S.Options>}
            </S.InfoContent>
        </S.Wrapper>
    );
};
