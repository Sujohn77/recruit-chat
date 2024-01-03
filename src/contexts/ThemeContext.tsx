import { useEffect, useState } from "react";
import { ThemeProvider } from "styled-components";

import { parseThemeResponse } from "utils/helpers";
import defaultTheme from "utils/theme/default";
import { IApiThemeResponse, IParsedTheme } from "utils/types";

interface IThemeContextProviderProps {
  children: React.ReactNode;
  value: IApiThemeResponse | null;
}

const ThemeContextProvider = ({
  value,
  children,
}: IThemeContextProviderProps) => {
  const [apiTheme, setApiTheme] = useState<IParsedTheme>();

  useEffect(() => {
    !!value && setApiTheme(parseThemeResponse(value));
  }, [value]);

  const theme: typeof defaultTheme = { ...defaultTheme, ...apiTheme };

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export { ThemeContextProvider };
