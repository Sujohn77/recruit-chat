import { useChatMessenger } from "contexts/MessengerContext";
import React, { useCallback, useState } from "react";
import Carousel from "react-material-ui-carousel";

import * as S from "./styles";
import { JobOffer } from "./JobOffer";
import { NotFoundOffer } from "./NotFound";

export const JobOffers: React.FC = () => {
  const { offerJobs } = useChatMessenger();
  const [index, setIndex] = useState(0);

  const handleChange = useCallback((current: number) => {
    setIndex(current);
  }, []);

  return (
    <S.Wrapper>
      <Carousel
        index={index}
        onChange={handleChange}
        animation={undefined}
        indicators={false}
        autoPlay={false}
        swipe
        className="my-carousel"
      >
        {Array.from({ length: offerJobs.length + 1 }).map((item, index) => {
          return index < offerJobs.length ? (
            <JobOffer key={offerJobs[index].id} jobOffer={offerJobs[index]} />
          ) : (
            <NotFoundOffer key={`not-found-offer-${index}`} />
          );
        })}
      </Carousel>

      {index !== 0 && (
        <S.PrevSlide onClick={() => setIndex(index - 1)}>
          <S.Slide />
        </S.PrevSlide>
      )}

      {index !== offerJobs.length && (
        <S.NextSide onClick={() => setIndex(index + 1)}>
          <S.Slide />
        </S.NextSide>
      )}
    </S.Wrapper>
  );
};
