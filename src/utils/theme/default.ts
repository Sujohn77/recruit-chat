import { COLORS } from "utils/colors";

const defaultTheme = {
  primaryColor: COLORS.BOULDER,
  secondaryColor: COLORS.ALTO,
  imageUrl: null || "",
  headerColor: COLORS.ALTO,
  messageButtonColor: COLORS.ALTO,
  buttonSecondaryColor: COLORS.GRAY_2,
  searchResultsColor: COLORS.SILVER,
  borderStyle: "solid",
  borderWidth: "0px",
  borderColor: COLORS.SILVER,
  chatbotName: "",
  header: {
    color: COLORS.ALTO,
  },

  loader: {
    background: COLORS.DESERT_STORM,
  },

  searchResults: {
    color: COLORS.DUSTY_GRAY,
    items: {
      backgroundColor: COLORS.SILVER,
    },
  },

  notification: {
    color: COLORS.SILVER_CHALICE,
    backgroundColor: COLORS.ALABASTER,
  },

  message: {
    backgroundColor: COLORS.ALTO,
    primaryColor: COLORS.DUSTY_GRAY,
    secondaryColor: COLORS.BLACK,
    own: {
      color: COLORS.WHITE,
    },
    chat: {
      color: COLORS.DUSTY_GRAY,
      backgroundColor: COLORS.ALTO,
    },
    file: {
      backgroundColor: COLORS.SILVER_CHALICE,
      color: COLORS.ALTO,
    },
    transcriptForm: {
      color: COLORS.SCORPION,
      buttonColor: COLORS.WHITE,
    },
    interestedJob: {
      color: COLORS.WHITE,
    },
    jobOffer: {
      color: COLORS.BLACK,
    },
    button: {
      borderColor: COLORS.BOULDER,
      color: COLORS.BLACK,
      backgroundColor: COLORS.ALTO,
    },
    postedDate: COLORS.ALABASTER,
    initialColor: COLORS.TUNDORA,
  },

  text: {
    color: COLORS.BLACK,
  },

  button: {
    primaryColor: COLORS.BOULDER,
    secondaryColor: COLORS.WHITE,
  },

  select: {
    option: {
      background: COLORS.ALTO,
      color: COLORS.DUSTY_GRAY,
    },
  },

  input: {
    backgroundColor: COLORS.GALLERY,
    color: COLORS.SILVER_CHALICE,
  },

  forms: {
    browse: {
      colors: COLORS.BLACK,
      background: COLORS.SILVER_CHALICE_2,
    },
  },
};

export default defaultTheme;
export type ThemeType = typeof defaultTheme;
