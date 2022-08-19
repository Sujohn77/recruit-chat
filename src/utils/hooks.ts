import { searchAlertCategories } from 'components/Chat/mockData';
import { ISearchRequisition } from 'contexts/types';
import { useCallback } from 'react';
import i18n from 'services/localization';
import { CHAT_ACTIONS } from './types';

interface IUseTextField {
  lastActionType: string | null;
  locations: string[];
  category: string | null;
  requisitions: ISearchRequisition[];
}

export const useTextField = ({
  lastActionType,
  requisitions,
  locations,
  category,
}: IUseTextField) => {
  const getTextFieldProps = useCallback(
    ({ lastActionType, requisitions, locations, category }: IUseTextField) => {
      if (lastActionType === CHAT_ACTIONS.SET_JOB_ALERT) {
        return {
          searchItems: searchAlertCategories,
          placeHolder: i18n.t('placeHolders:alert_category'),
          headerName: i18n.t('chat_item_description:all_categories'),
        };
      }
      if (category) {
        return {
          searchItems: locations,
          placeHolder: i18n.t('placeHolders:chooseLocation'),
          headerName: i18n.t('chat_item_description:locations_title'),
        };
      }
      return {
        searchItems: requisitions.map((r) => r.title),
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

    if (key === 'apikey') {
      apiKey = value;
      break;
    }
  }

  return apiKey;
};
