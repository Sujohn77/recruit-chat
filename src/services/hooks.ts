import {  useEffect, useState } from 'react';
import Api, { apiInstance } from 'services';
import { APP_VERSION } from './auth';

import { IApiMessage, LocationType } from './types';
import { handleRefreshToken } from './utils';

const apiInstanse = new Api();

export const sendMessage = (message: IApiMessage, accessToken: string) => {
  apiInstanse.setAuthHeader(accessToken);
  handleRefreshToken(() => apiInstanse.sendMessage(message));
};

export const apiPayload = { appKey: '117BD5BC-857D-428B-97BE-A5EC7256E281', codeVersion: APP_VERSION };

const data = {
  pageSize: 20,
  page: 1,
  keyword: '',
  ...apiPayload,
};

// TODO: refactor
export const useRequisitions = (accessToken: string | null) => {
  const [requisitions, setRequisitions] = useState<{ title: string; category: string }[]>([]);
  const [locations, setLocations] = useState<LocationType[]>([]);

  useEffect(() => {
    const getCategories = async (accessToken: string) => {
      let response = null;

      apiInstance.setAuthHeader(accessToken);
      response = await apiInstance.searchRequisitions(data);

      if (response?.data?.requisitions?.length) {
        const requisitions = response.data.requisitions;
        setLocations(requisitions.map((r) => r.location));
        setRequisitions(
          response.data.requisitions?.map((c: any) => ({
            title: c.title,
            category: c.categories[0],
          })) as any
        );
      }
    };
    accessToken && getCategories(accessToken);
  }, [accessToken]);

  return { requisitions, locations };
};
