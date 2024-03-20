/* eslint-disable react-hooks/exhaustive-deps */
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import map from "lodash/map";
import { ApiResponse } from "apisauce";

import { IRequisitionsResponse, LocationType } from "./types";
import { apiInstance } from "services/api";
import { IRequisition } from "utils/types";
import { isDevMode } from "utils/constants";

export interface IRequisitionType {
  title: string;
  category: string;
}

const searchParams = {
  pageSize: 25,
  keyword: "*",
  minDatePosted: "2016-11-13T00:00:00",
  uniqueTitles: true,
};

export const useRequisitions = (
  searchRequisitionsTrigger: any,
  setIsChatLoading: Dispatch<SetStateAction<boolean>>,
  page: number,
  setPage: Dispatch<SetStateAction<number>>
) => {
  const [requisitions, setRequisitions] = useState<IRequisitionType[]>([]);
  const [locations, setLocations] = useState<LocationType[]>([]);

  useEffect(() => {
    (async function () {
      if (searchRequisitionsTrigger !== 1) {
        setIsChatLoading(true);
        try {
          const response: ApiResponse<IRequisitionsResponse> =
            await apiInstance.searchRequisitions({
              ...searchParams,
              page,
            });
          if (response?.data?.requisitions?.length) {
            if (page !== 0) {
              setRequisitions((prevValue) => [
                ...prevValue,
                ...map(response?.data?.requisitions, (c: IRequisition) => ({
                  title: c.title,
                  category: c.categories![0],
                })),
              ]);

              if (response?.data?.requisitions.length) {
                setLocations((prevValue) => [
                  ...prevValue,
                  ...map(response?.data?.requisitions, (r) => r.location),
                ]);
              }
            } else {
              setRequisitions(
                map(response?.data?.requisitions, (c: IRequisition) => ({
                  title: c.title,
                  category: c.categories![0],
                }))
              );

              if (response?.data?.requisitions.length) {
                setLocations(
                  map(response?.data?.requisitions, (r) => r.location)
                );
              }
            }
          }
        } catch (err) {
          isDevMode && console.log("searchRequisitions error:", err);
        } finally {
          setIsChatLoading(false);
        }
      }
    })();
  }, [searchRequisitionsTrigger, page]);

  useEffect(() => {
    setPage(0);
  }, [searchRequisitionsTrigger]);

  const setJobPositions = (requisitions: IRequisition[]) => {
    if (page !== 0) {
      setRequisitions((prevValue) => [
        ...prevValue,
        ...map(requisitions, (c: IRequisition) => ({
          title: c.title,
          category: c.categories![0],
        })),
      ]);

      if (requisitions.length) {
        setLocations((prevValue) => [
          ...prevValue,
          ...map(requisitions, (r) => r.location),
        ]);
      }
    } else {
      setRequisitions(
        map(requisitions, (c: IRequisition) => ({
          title: c.title,
          category: c.categories![0],
        }))
      );

      if (requisitions.length) {
        setLocations(map(requisitions, (r) => r.location));
      }
    }
  };

  const searchRequisitions = async () => {
    setIsChatLoading(true);
    try {
      const response = await apiInstance.searchRequisitions({
        ...searchParams,
        page,
      });
      if (response?.data?.requisitions?.length) {
        setJobPositions(response.data.requisitions);
        return response.data.requisitions;
      }
    } catch (err) {
      isDevMode && console.log("searchRequisitions", err);
    } finally {
      setIsChatLoading(false);
    }
  };

  return {
    requisitions,
    locations,
    setJobPositions,
    searchRequisitions,
    setPage,
    setRequisitions,
    setLocations,
  };
};

export const useIsTabActive = (): boolean => {
  const [isTabVisible, setIsTabVisible] = useState(true);

  const handleVisibilityChange = useCallback(() => {
    setIsTabVisible(document.visibilityState === "visible");
  }, []);

  useEffect(() => {
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return isTabVisible;
};
