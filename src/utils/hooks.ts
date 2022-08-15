import { searchAlertCategories } from 'components/Chat/mockData';
import { useCallback } from 'react';
import i18n from 'services/localization';
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
        placeHolder: i18n.t('placeHolders:message'),
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
