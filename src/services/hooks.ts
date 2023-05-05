import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import map from "lodash/map";

import { APP_VERSION } from "./auth";
import { handleRefreshToken } from "./utils";
import { IApiMessage, LocationType } from "./types";
import Api, { apiInstance } from "services";
import { IRequisition } from "utils/types";
import { isDevMode } from "utils/constants";

type RequisitionType = {
  title: string;
  category: string;
};

const apiInstanse = new Api();

export const sendMessage = (message: IApiMessage) => {
  handleRefreshToken(() => apiInstanse.sendMessage(message));
};

const requisitionParams = {
  pageSize: 20,
  page: 1,
  keyword: "*",
  appKey: "117BD5BC-857D-428B-97BE-A5EC7256E281",
  codeVersion: APP_VERSION,
};

export const useRequisitions = (
  searchRequisitionsTrigger: any,
  setIsChatLoading: Dispatch<SetStateAction<boolean>>
) => {
  const [requisitions, setRequisitions] = useState<RequisitionType[]>([]);
  const [locations, setLocations] = useState<LocationType[]>([]);

  const setJobPositions = (requisitions: IRequisition[]) => {
    setRequisitions(
      map(requisitions, (c: IRequisition) => ({
        title: c.title,
        category: c.categories![0],
      }))
    );
    if (requisitions.length) {
      setLocations(map(requisitions, (r) => r.location));
    }
  };

  const searchRequisitions = useCallback(async () => {
    setIsChatLoading(true);
    try {
      const response = await apiInstance.searchRequisitions(requisitionParams);
      if (response?.data?.requisitions?.length) {
        setJobPositions(response.data.requisitions);
      }
    } catch (err) {
      isDevMode && console.log("searchRequisitions", err);
    } finally {
      setIsChatLoading(false);
    }
  }, []);

  useEffect(() => {
    (async function () {
      setIsChatLoading(true);
      try {
        const response = await apiInstance.searchRequisitions(
          requisitionParams
        );
        if (response?.data?.requisitions?.length) {
          setJobPositions(response.data.requisitions);
        }
      } catch (err) {
        isDevMode && console.log("searchRequisitions error:", err);
      } finally {
        setIsChatLoading(false);
      }
    })();
  }, [searchRequisitionsTrigger]);

  return { requisitions, locations, setJobPositions, searchRequisitions };
};
