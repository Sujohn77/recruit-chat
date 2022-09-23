import { useEffect, useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { api, IApiThemeResponse } from 'utils/api';
import { parseThemeResponse } from 'utils/helpers';
import { useApiKey } from 'utils/hooks';
import defaultTheme from 'utils/theme/default';

type PropsType = {
  children: React.ReactNode;
  value: IApiThemeResponse | null;
};

const ThemeContextProvider = ({ value, children }: PropsType) => {
  const apiKey = useApiKey();
  const [apiTheme, setApiTheme] = useState<any>({});

  useEffect(() => {
    !!value && setApiTheme(parseThemeResponse(value));
  }, [value])

  useEffect(() => {
    if (apiKey) {
      api.test(apiKey).then((res) => {
        setApiTheme(parseThemeResponse(res.data));
      });
    }
  }, [apiKey]);
  const theme: typeof defaultTheme = { ...defaultTheme, ...apiTheme };
  // console.log(theme);
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export { ThemeContextProvider };
