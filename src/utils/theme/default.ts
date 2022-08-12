import { DefaultTheme } from 'styled-components';
import { colors } from 'utils/colors';
const PRIMARY_COLOR = '#379970';
const REVERSED_COLOR = 'rgba(255, 255, 255, 0.5)';

const defaultTheme: DefaultTheme = {
  primary: PRIMARY_COLOR,
  reversed: REVERSED_COLOR,

  loader: {
    background: '#d3d3d370',
  },

  message: {
    own: {
      color: colors.white,
      background: colors.boulder,
    },
    chat: {
      color: colors.dustyGray,
      background: colors.alto,
    },
  },

  text: {
    own: colors.white,
    bot: colors.dustyGray,
    link: PRIMARY_COLOR,
    error: colors.torchRed,
    title: colors.black,
    file: {
      color: colors.white,
      background: '#B0B0B0',
    },
  },

  button: {
    border: colors.boulder,
    chat: {
      color: colors.dustyGray,
      background: colors.alto,
    },

    own: {
      color: colors.black,
      background: colors.alto,
    },
  },

  select: {
    option: {
      background: colors.alto,
      color: colors.dustyGray,
    },
  },

  input: {
    background: '#EFEFEF',
    color: colors.silverChalice,
  },

  forms: {
    browse: {
      colors: colors.black,
      background: '#A6A6A6',
    },
  },
};
export default defaultTheme;
