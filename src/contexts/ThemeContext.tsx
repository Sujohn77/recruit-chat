import { useEffect, useState } from "react";
import { ThemeProvider } from "styled-components";

import { api, IApiThemeResponse } from "utils/api";
import { LOG, parseThemeResponse } from "utils/helpers";
import { useApiKey } from "utils/hooks";
import defaultTheme from "utils/theme/default";

interface IThemeContextProviderProps {
  children: React.ReactNode;
  value: IApiThemeResponse | null;
}

const ThemeContextProvider = ({
  value,
  children,
}: IThemeContextProviderProps) => {
  const apiKey = useApiKey();
  const [apiTheme, setApiTheme] = useState<any>({});

  useEffect(() => {
    !!value && setApiTheme(parseThemeResponse(value));
  }, [value]);

  useEffect(() => {
    if (apiKey) {
      api
        .test(apiKey)
        .then((res) => {
          setApiTheme(parseThemeResponse(res.data));
        })
        .catch((error) => LOG(error, "ThemeContextProvider ERROR"));
    }
  }, [apiKey]);

  const theme: typeof defaultTheme = { ...defaultTheme, ...apiTheme };

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export { ThemeContextProvider };
