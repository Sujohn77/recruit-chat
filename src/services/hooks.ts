import { useAuthContext } from 'contexts/AuthContext';
import { useEffect, useState } from 'react';
import Api, { apiInstance, authInstance } from 'services';
import { APP_VERSION } from './auth';

import { IApiMessage, LocationType } from './types';
import { handleRefreshToken } from './utils';

const apiInstanse = new Api();

export const sendMessage = (message: IApiMessage, accessToken: string) => {
  authInstance.setAuthHeader(accessToken);
  handleRefreshToken(() => apiInstanse.sendMessage(message));
};

export const apiPayload = {
  appKey: '117BD5BC-857D-428B-97BE-A5EC7256E281',
  codeVersion: APP_VERSION,
};

const data = {
  pageSize: 20,
  page: 1,
  keyword: '',
  ...apiPayload,
};

export const useRequisitions = (accessToken: string | null) => {
  const { subscriberID } = useAuthContext();
  const [requisitions, setRequisitions] = useState<
    { title: string; category: string }[]
  >([]);
  const [locations, setLocations] = useState<LocationType[]>([]);

  useEffect(() => {
    const getCategories = async (accessToken: string) => {
      apiInstance.setAuthHeader(accessToken);
      const response = await apiInstance.searchRequisitions(data);

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
    subscriberID && accessToken && getCategories(accessToken);
  }, [accessToken, subscriberID]);

  return { requisitions, locations };
};
