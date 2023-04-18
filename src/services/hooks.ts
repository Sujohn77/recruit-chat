import { useEffect, useState } from "react";
import map from "lodash/map";

import { APP_VERSION } from "./auth";
import { handleRefreshToken } from "./utils";
import { IApiMessage, LocationType } from "./types";
import Api, { apiInstance } from "services";
import { IRequisition } from "utils/types";

type RequisitionType = {
  title: string;
  category: string;
};

const apiInstanse = new Api();

export const sendMessage = (message: IApiMessage) => {
  handleRefreshToken(() => apiInstanse.sendMessage(message));
};

export const apiPayload = {
  appKey: "117BD5BC-857D-428B-97BE-A5EC7256E281",
  codeVersion: APP_VERSION,
};

const requisitionParams = {
  pageSize: 20,
  page: 1,
  keyword: "*",
  ...apiPayload,
};

export const useRequisitions = () => {
  const [requisitions, setRequisitions] = useState<RequisitionType[]>([]);
  const [locations, setLocations] = useState<LocationType[]>([]);

  const setJobPositions = (requisitions: IRequisition[]) => {
    setRequisitions(
      requisitions?.map((c: any) => ({
        title: c.title,
        category: c.categories[0],
      })) as any
    );
    if (requisitions.length) {
      setLocations(map(requisitions, (r) => r.location));
    }
  };

  useEffect(() => {
    (async function () {
      try {
        const response = await apiInstance.searchRequisitions(
          requisitionParams
        );
        if (response?.data?.requisitions?.length) {
          const requisitions = response.data.requisitions;
          setJobPositions(requisitions);
        }
      } catch (err) {
        process.env.NODE_ENV === "development" && console.log(err);
      }
    })();
  }, []);

  return { requisitions, locations, setJobPositions };
};
