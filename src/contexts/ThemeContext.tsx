import { createContext, useContext, useEffect, useState } from 'react';
import { api } from 'utils/api';
import { useApiKey } from 'utils/hooks';
import defaultTheme from 'utils/theme/default';

type PropsType = {
  children: React.ReactNode;
};

const ThemeContext = createContext<any>({ theme: null });

const ThemeProvider = ({ children }: PropsType) => {
  const apiKey: any = useApiKey();
  const [apiTheme, setApiTheme] = useState<any>({});

  useEffect(() => {
    console.log('Bot api key: ', apiKey);
    if (apiKey) {
      api.test(apiKey).then((res) => {
        setApiTheme({
          fontColor: res.data.fontColor,
          backgroundColor: res.data.backgroundColor,
          imageUrl: res.data.imageUrl,
        });
      });
    }
  }, [apiKey]);
  const theme = { ...defaultTheme, ...apiTheme };
  return (
    <ThemeContext.Provider value={{ theme }}>{children}</ThemeContext.Provider>
  );
};

const useThemeContext = () => useContext(ThemeContext);

export { ThemeProvider, useThemeContext };
