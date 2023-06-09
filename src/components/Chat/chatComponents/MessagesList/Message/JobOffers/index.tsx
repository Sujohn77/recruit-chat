import { useChatMessenger } from "contexts/MessengerContext";
import React, { useCallback, useState } from "react";
import Carousel from "react-material-ui-carousel";

import * as S from "./styles";
import { JobOffer } from "./JobOffer";
import { NotFoundOffer } from "./NotFound";
import { CHAT_ACTIONS } from "utils/types";

export const JobOffers: React.FC = () => {
  const { offerJobs, category, setViewJob, dispatch } = useChatMessenger();
  const [index, setIndex] = useState(0);

  const handleChange = useCallback((current: number, prev: number) => {
    setIndex(current);
  }, []);

  const handleSubmitClick = useCallback((id: string | number) => {
    dispatch({
      type: CHAT_ACTIONS.INTERESTED_IN,
      payload: { item: `${id}` },
    });
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
            <JobOffer
              key={offerJobs[index].id}
              title={offerJobs[index].title}
              category={category}
              handleReadMore={() => setViewJob(offerJobs[index])}
              handleButtonClick={() => handleSubmitClick(offerJobs[index].id)}
            />
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
