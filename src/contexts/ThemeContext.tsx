import { useEffect, useState } from "react";
import { ThemeProvider } from "styled-components";

import { parseThemeResponse } from "utils/helpers";
import defaultTheme, { DefaultThemeType } from "utils/theme/default";
import { IApiThemeResponse, IParsedTheme } from "utils/types";

interface IThemeContextProviderProps {
  children: React.ReactNode;
  value: (IApiThemeResponse & IParsedTheme) | null;
}

const ThemeContextProvider = ({
  value,
  children,
}: IThemeContextProviderProps) => {
  const [theme, setTheme] = useState<DefaultThemeType>({
    ...defaultTheme,
  });

  useEffect(() => {
    if (!!value) {
      const parsedTheme = parseThemeResponse(value);
      setTheme((prevTheme) => ({ ...prevTheme, ...parsedTheme }));
    }
  }, [value]);

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export { ThemeContextProvider };
