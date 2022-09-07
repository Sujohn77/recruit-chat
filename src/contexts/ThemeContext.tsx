import { useEffect, useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { api } from 'utils/api';
import { useApiKey } from 'utils/hooks';
import defaultTheme from 'utils/theme/default';

type PropsType = {
  children: React.ReactNode;
};

const ThemeContextProvider = ({ children }: PropsType) => {
  const apiKey = useApiKey();
  const [apiTheme, setApiTheme] = useState<any>({});

  useEffect(() => {
    if (apiKey) {
      api.test(apiKey).then((res) => {
        setApiTheme({
          primaryColor: res.data.client_primary_colour,
          secondaryColor: res.data.client_secondary_color,
          imageUrl: res.data.chatbot_logo_URL,
          borderStyle: res.data.chatbot_border_style,
          borderWidth: res.data.chatbot_border_thickness,
          borderColor: res.data.chatbot_border_color,
        });
      });
    }
  }, [apiKey]);
  const theme: typeof defaultTheme = { ...defaultTheme, ...apiTheme };
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export { ThemeContextProvider };
