import { useChatMessenger } from "contexts/MessengerContext";
import React, { useCallback, useState } from "react";
import Carousel from "react-material-ui-carousel";

import * as S from "./styles";
import { JobOffer } from "./JobOffer";
import { NotFoundOffer } from "./NotFound";

interface IJobOffersProps {
  setShowLoginScreen: (show: boolean) => void;
  isLastMessage: boolean;
}

export const JobOffers: React.FC<IJobOffersProps> = ({
  setShowLoginScreen,
  isLastMessage,
}) => {
  const { offerJobs } = useChatMessenger();
  const [activeIndex, setActiveIndex] = useState(0);

  const handleChange = useCallback((current: number) => {
    setActiveIndex(current);
  }, []);

  return (
    <S.Wrapper>
      <Carousel
        index={activeIndex}
        onChange={handleChange}
        animation={undefined}
        indicators={false}
        autoPlay={false}
        swipe
        className="my-carousel"
      >
        {Array.from({ length: offerJobs.length + 1 }).map((item, index) => {
          return index < offerJobs.length ? (
            <JobOffer
              key={offerJobs[index].id}
              jobOffer={offerJobs[index]}
              // isActive={activeIndex === index}
              // isLastMessage={isLastMessage}
              // setShowLoginScreen={setShowLoginScreen}
            />
          ) : (
            <NotFoundOffer key={`not-found-offer-${index}`} />
          );
        })}
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
