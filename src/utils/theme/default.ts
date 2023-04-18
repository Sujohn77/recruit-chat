import { colors } from "utils/colors";

const defaultTheme = {
  primaryColor: colors.boulder,
  secondaryColor: colors.alto,
  imageUrl: null,
  headerColor: colors.alto,
  messageButtonColor: colors.alto,
  buttonSecondaryColor: colors.gray2,
  searchResultsColor: colors.silver,
  borderStyle: "solid",
  borderWidth: "0px",
  borderColor: "#ccc",
  chatbotName: "",
  header: {
    color: colors.alto,
  },

  loader: {
    background: "#d3d3d370",
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
      backgroundColor: colors.silverChalice,
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
    initialColor: colors.tundora,
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
      background: colors.silverChalice2,
    },
  },
};

export default defaultTheme;
export type ThemeType = typeof defaultTheme;
