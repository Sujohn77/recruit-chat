export interface IJobOfferProps {
  title: string;
  handleReadMore: () => void;
  handleButtonClick: () => void;
  category?: string | null;
}
