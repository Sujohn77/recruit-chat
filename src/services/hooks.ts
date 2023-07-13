/* eslint-disable react-hooks/exhaustive-deps */
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import map from "lodash/map";

import { LocationType } from "./types";
import { apiInstance } from "services/api";
import { IRequisition } from "utils/types";
import { isDevMode } from "utils/constants";

interface IRequisitionType {
  title: string;
  category: string;
}

const requisitionParams = {
  // page: 1,
  pageSize: 20,
  keyword: "*",
  appKey: "117BD5BC-857D-428B-97BE-A5EC7256E281",
  codeVersion: "1.0.3",
};

export const useRequisitions = (
  searchRequisitionsTrigger: any,
  setIsChatLoading: Dispatch<SetStateAction<boolean>>
) => {
  const [requisitions, setRequisitions] = useState<IRequisitionType[]>([]);
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
