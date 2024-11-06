import { useChatMessenger } from "contexts/MessengerContext";
import React, { useCallback, useMemo, useState } from "react";
import Carousel from "react-material-ui-carousel";

import * as S from "./styles";
import { JobOffer } from "./JobOffer";
import { NotFoundOffer } from "./NotFound";

interface IJobOffersProps {
  isLastMess: boolean;
  setSelectedReferralJobId: React.Dispatch<
    React.SetStateAction<number | undefined>
  >;
}

export const JobOffers: React.FC<IJobOffersProps> = ({
  isLastMess,
  setSelectedReferralJobId,
}) => {
  const { offerJobs } = useChatMessenger();
  const [activeIndex, setActiveIndex] = useState(0);

  const handleChange = useCallback((current: number) => {
    setActiveIndex(current);
  }, []);

  const offers = useMemo(
    () =>
      Array.from({ length: offerJobs.length + 1 }).map((item, index) => {
        return index < offerJobs.length ? (
          <JobOffer
            key={offerJobs[index].id}
            jobOffer={offerJobs[index]}
            isLastMess={isLastMess}
            setSelectedReferralJobId={setSelectedReferralJobId}
          />
        ) : (
          <NotFoundOffer key={`not-found-offer-${index}`} />
        );
      }),
    [offerJobs]
  );

  return (
    <S.Wrapper>
      <Carousel
        swipe
        height={242}
        index={activeIndex}
        onChange={handleChange}
        indicators={false}
        autoPlay={false}
        className="my-carousel"
      >
        {offers}
      </Carousel>

      {activeIndex !== 0 && (
        <S.PrevSlide onClick={() => setActiveIndex(activeIndex - 1)}>
          <S.Slide />
        </S.PrevSlide>
      )}

      {activeIndex !== offerJobs.length && (
        <S.NextSide onClick={() => setActiveIndex(activeIndex + 1)}>
          <S.Slide />
        </S.NextSide>
      )}
    </S.Wrapper>
  );
};
