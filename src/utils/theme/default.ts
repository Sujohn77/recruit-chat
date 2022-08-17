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

  searchResuls: {
    header: {
      color: colors.dustyGray,
      background: colors.alto,
    },
    items: {
      background: colors.silver,
    },
  },

  notification: {
    color: colors.black,
    backgroundColor: colors.alabaster,
  },

  message: {
    initial: {
      color: colors.dustyGray,
    },
    own: {
      color: colors.white,
      background: colors.boulder,
    },
    chat: {
      color: colors.dustyGray,
      background: colors.alto,
    },
    file: {
      background: '#B0B0B0',
      color: colors.alto,
    },
    browse: {
      color: colors.dustyGray,
      buttonColor: colors.black,
    },
    emailForm: {
      color: colors.scorpion,
      buttonColor: colors.white,
    },
    interestedJob: {
      color: colors.white,
    },
    jobOffer: {
      color: colors.black,
    },
  },

  text: {
    postedDate: colors.alabaster,
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
