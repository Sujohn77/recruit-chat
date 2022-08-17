import { createContext, useContext, useEffect, useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { api } from 'utils/api';
import { useApiKey } from 'utils/hooks';
import defaultTheme from 'utils/theme/default';

type PropsType = {
  children: React.ReactNode;
};

const ThemeContextProvider = ({ children }: PropsType) => {
  const apiKey: any = useApiKey();
  const [apiTheme, setApiTheme] = useState<any>({});

  useEffect(() => {
    console.log('Bot api key: ', apiKey);
    if (apiKey) {
      api.test(apiKey).then((res) => {
        setApiTheme({
          header: {
            color: res.data.fontColor,
          },
          primaryColor: res.data.backgroundColor,
          imageUrl: res.data.imageUrl,
        });
      });
    }
  }, [apiKey]);
  const theme: typeof defaultTheme = { ...defaultTheme, ...apiTheme };
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export { ThemeContextProvider };
