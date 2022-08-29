import { ACCESS_TOKEN } from '../firebase/config';
import { useEffect, useState } from 'react';
import Api, { apiInstance, APP_VERSION } from 'services';

import { IApiMessage, LocationType } from './types';
import { handleRefreshToken } from './utils';

const apiInstanse = new Api();

export const sendMessage = (message: IApiMessage, accessToken?: string) => {
  apiInstanse.setAuthHeader(accessToken || ACCESS_TOKEN);
  handleRefreshToken(() => apiInstanse.sendMessage(message));
};

export const useRequisitions = (accessToken?: string) => {
  const [requisitions, setRequisitions] = useState<{ title: string; category: string }[]>([]);
  const [locations, setLocations] = useState<LocationType[]>([]);

  useEffect(() => {
    const getCategories = async () => {
      const data = {
        pageSize: 20,
        page: 1,
        keyword: '',
        appKey: '117BD5BC-857D-428B-97BE-A5EC7256E281',
        codeVersion: APP_VERSION,
      };
      apiInstance.setAuthHeader(accessToken || ACCESS_TOKEN);
      const response = await apiInstance.searchRequisitions(data);
      if (response.data?.requisitions?.length) {
        const requisitions = response.data.requisitions;
        setLocations(
          requisitions.map((r) => {
            return r.location;
          })
        );
        setRequisitions(
          response.data.requisitions?.map((c: any) => ({
            title: c.title,
            category: c.categories[0],
          })) as any
        );
      }
    };
    getCategories();
  }, [accessToken]);

  return { requisitions, locations };
};
