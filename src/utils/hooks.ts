import { searchAlertCategories } from 'components/Chat/mockData';
import { useCallback } from 'react';
import i18n from 'services/localization';
import { URLSearchParams } from 'url';
import { CHAT_ACTIONS } from './types';

interface IUseTextField {
  lastActionType: string | null;
  searchLocations: string[];
  category: string | null;
  categories: string[];
}

export const useTextField = ({
  lastActionType,
  categories,
  searchLocations,
  category,
}: IUseTextField) => {
  const getTextFieldProps = useCallback(
    ({
      lastActionType,
      categories,
      searchLocations,
      category,
    }: IUseTextField) => {
      if (lastActionType === CHAT_ACTIONS.SET_JOB_ALERT) {
        return {
          searchItems: searchAlertCategories,
          placeHolder: i18n.t('placeHolders:alert_category'),
          headerName: i18n.t('chat_item_description:all_categories'),
        };
      }
      if (category) {
        return {
          searchItems: searchLocations,
          placeHolder: i18n.t('placeHolders:chooseLocation'),
          headerName: i18n.t('chat_item_description:locations_title'),
        };
      }
      return {
        searchItems: categories,
        headerName: i18n.t('chat_item_description:categories_title'),
        placeHolder:
          lastActionType === CHAT_ACTIONS.ANSWER_QUESTIONS
            ? i18n.t('placeHolders:startTyping')
            : i18n.t('placeHolders:message'),
      };
    },
    []
  );

  return getTextFieldProps({
    lastActionType,
    categories,
    searchLocations,
    category,
  });
};

export const useApiKey = () => {
  const url: any = new URL(window.location.href);
  let apiKey: undefined | string = undefined;

  for (const p of url.searchParams.entries()) {
    const [key, value] = p;

    if (key === 'apikey') {
      apiKey = value;
      break;
    }
  }

  return apiKey;
};
