import { colors } from 'utils/colors';

const defaultTheme = {
  primaryColor: '#787878',
  secondaryColor: '#d9d9d9',
  imageUrl: null,
  headerColor: '#D9D9D9',
  messageButtonColor: '#D9D9D9',
  buttonSecondaryColor: '#8E8E8E',
  searchResultsColor: colors.silver,
  borderStyle: 'solid',
  borderWidth: '0px',
  borderColor: '#ccc',

  header: {
    color: colors.alto,
  },

  loader: {
    background: '#d3d3d370',
  },

  searchResults: {
    color: colors.dustyGray,
    items: {
      backgroundColor: colors.silver,
    },
  },

  notification: {
    color: colors.silverChalice,
    backgroundColor: colors.alabaster,
  },

  message: {
    backgroundColor: colors.alto,
    primaryColor: colors.dustyGray,
    secondaryColor: colors.black,
    own: {
      color: colors.white,
    },
    chat: {
      color: colors.dustyGray,
      backgroundColor: colors.alto,
    },
    file: {
      backgroundColor: '#B0B0B0',
      color: colors.alto,
    },
    transcriptForm: {
      color: colors.scorpion,
      buttonColor: colors.white,
    },
    interestedJob: {
      color: colors.white,
    },
    jobOffer: {
      color: colors.black,
    },
    button: {
      borderColor: colors.boulder,
      color: colors.black,
      backgroundColor: colors.alto,
    },
    postedDate: colors.alabaster,
    initialColor: '#454545',
  },

  text: {
    color: colors.black,
  },

  button: {
    primaryColor: colors.boulder,
    secondaryColor: colors.white,
  },

  select: {
    option: {
      background: colors.alto,
      color: colors.dustyGray,
    },
  },

  input: {
    backgroundColor: colors.gallery,
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

export type ThemeType = typeof defaultTheme;
