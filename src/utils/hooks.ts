import { ISearchRequisition } from "contexts/types";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import map from "lodash/map";

import { searchAlertCategories } from "components/Chat/mockData";
import { CHAT_ACTIONS } from "./types";

interface IUseTextField {
  lastActionType: CHAT_ACTIONS | null;
  locations: string[];
  category: string | null;
  requisitions: ISearchRequisition[];
}

// TODO: refactor/test
export const useTextField = ({
  lastActionType,
  requisitions,
  locations,
  category,
}: IUseTextField) => {
  const { t } = useTranslation();

  const getTextFieldProps = useCallback(
    ({ lastActionType, requisitions, locations }: IUseTextField) => {
      if (lastActionType === CHAT_ACTIONS.SET_ALERT_CATEGORIES) {
        return {
          searchItems: searchAlertCategories,
          placeHolder: t("placeHolders:alert_category"),
          headerName: t("chat_item_description:all_categories"),
        };
      }

      if (lastActionType === CHAT_ACTIONS.SET_LOCATIONS) {
        return {
          searchItems: locations,
          placeHolder: t("placeHolders:chooseLocation"),
          headerName: t("chat_item_description:locations_title"),
        };
      }

      return {
        searchItems: map(requisitions, (r) => r.title),
        headerName: t("chat_item_description:categories_title"),
        placeHolder:
          lastActionType === CHAT_ACTIONS.ANSWER_QUESTIONS // TODO: test
            ? t("placeHolders:startTyping")
            : t("placeHolders:message"),
      };
    },
    []
  );

  return getTextFieldProps({
    lastActionType,
    requisitions,
    locations,
    category,
  });
};

export const useApiKey = () => {
  const url: any = new URL(window.location.href);
  let apiKey: undefined | string = undefined;

  for (const p of url.searchParams.entries()) {
    const [key, value] = p;

    if (key === "apikey") {
      apiKey = value;
      break;
    }
  }

  return apiKey;
};
