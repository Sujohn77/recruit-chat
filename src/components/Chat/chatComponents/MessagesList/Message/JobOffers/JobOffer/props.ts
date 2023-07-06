import { IRequisition } from "utils/types";

export interface IJobOfferProps {
  jobOffer: IRequisition;
  setShowLoginScreen: (show: boolean) => void;
  isLastMessage: boolean;
  isActive: boolean;
}
