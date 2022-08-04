import { ACCESS_TOKEN } from 'firebase/config';
import { useEffect, useState } from 'react';
import Api, { apiInstance, APP_VERSION } from 'services';

import { IApiMessage } from './types';
import { handleRefreshToken } from './utils';

const apiInstanse = new Api();



export const sendMessage = (message: IApiMessage) => { 
    apiInstanse.setAuthHeader(ACCESS_TOKEN);
    handleRefreshToken(() => apiInstanse.sendMessage(message))
}

export const useCategories = () => {
    const [categories, setCategories] = useState<string[]>([]);
    
    useEffect(() => {
        const getCategories = async () => {
            const data = {
                pageSize: 20,
                page: 1,
                keyword: "",
                appKey: "117BD5BC-857D-428B-97BE-A5EC7256E281",
                codeVersion: APP_VERSION,
            };
            apiInstance.setAuthHeader(ACCESS_TOKEN);
            const response = await apiInstance.searchRequisitions(data);
        
            response.data && setCategories(response.data.requisitions.map((c:any)=>c.title) as any);
        };
        getCategories();
    }, [])

    return categories;
}

