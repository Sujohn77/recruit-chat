import { Chat } from 'components/Chat';

import { SocketProvider } from 'contexts/SocketContext';
import React, { useState } from 'react';
import { Intro } from 'screens/intro';

export const HomeContent = () => {
    const [isSelectedOption, setIsSelectedOption] = useState<boolean | null>(null);

    return (
        <SocketProvider>
            {isSelectedOption && <Chat setIsSelectedOption={setIsSelectedOption} isSelectedOption={isSelectedOption} />}
            <Intro setIsSelectedOption={setIsSelectedOption} isSelectedOption={isSelectedOption} />
        </SocketProvider>
    );
};
