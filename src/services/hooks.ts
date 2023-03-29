import { useEffect, useState } from 'react';
import Api, { apiInstance } from 'services';
import { IRequisition } from '../utils/types';
import { APP_VERSION } from './auth';

import { IApiMessage, LocationType } from './types';
import { handleRefreshToken } from './utils';

const apiInstanse = new Api();

export const sendMessage = (message: IApiMessage) => {
    handleRefreshToken(() => apiInstanse.sendMessage(message));
};

export const apiPayload = {
    appKey: '117BD5BC-857D-428B-97BE-A5EC7256E281',
    codeVersion: APP_VERSION,
};

const requisitionParams = {
    pageSize: 20,
    page: 1,
    keyword: '*',
    ...apiPayload,
};

export const useRequisitions = () => {
    const [requisitions, setRequisitions] = useState<{ title: string; category: string }[]>([]);
    const [locations, setLocations] = useState<LocationType[]>([]);

    const setJobPositions = (requisitions: IRequisition[]) => {
        setRequisitions(
            requisitions?.map((c: any) => ({
                title: c.title,
                category: c.categories[0],
            })) as any
        );
        setLocations(requisitions.map((r) => r.location));
    };

    useEffect(() => {
        const getCategories = async () => {
            try {
                const response = await apiInstance.searchRequisitions(requisitionParams);

                if (response?.data?.requisitions?.length) {
                    const requisitions = response.data.requisitions;
                    setJobPositions(requisitions);
                }
            } catch (err) {
                process.env.NODE_ENV === 'development' && console.log(err);
            }
        };
        getCategories();
    }, []);

    return { requisitions, locations, setJobPositions };
};
