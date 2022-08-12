import { createContext, useContext } from 'react';
import defaultTheme from 'utils/theme/default';

export const ThemeContext = createContext({
  theme: defaultTheme,
});

export const useThemeContext = () => useContext(ThemeContext);
