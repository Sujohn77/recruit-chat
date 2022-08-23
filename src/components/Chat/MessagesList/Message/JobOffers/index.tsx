import { DarkButton } from 'components/Layout/styles';
import { useChatMessanger } from 'contexts/MessangerContext';
import React, { FC, useCallback } from 'react';
import Carousel from 'react-material-ui-carousel';
import i18n from 'services/localization';
import styled from 'styled-components';
import { colors } from 'utils/colors';
import { CHAT_ACTIONS } from 'utils/types';
import { NoMatchJob } from '../NoMatchJob';
import { NotFoundOffer } from './NoFound';
import { Category, JobOfferWrapper, OfferTitle, ReadMore } from './styles';

export const Wrapper = styled.div`
  position: relative;
  font-family: Inter-SemiBold;
  margin: 0 0 16px;
  button {
    opacity: 1;
  }

  div.my-carousel {
    > div:nth-child(2) {
      right: -10px;
      display: none;
    }
    > div:nth-child(3) {
      left: -10px;
      display: none;
    }
  }
`;
export const PrevSlide = styled.div`
  cursor: pointer;
  padding: 0.1em 0 0;
  background: #575757;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 5px;
  top: calc(50% - 20px);
  box-sizing: border-box;
  z-index: 1;
  transform: rotate(-135deg);
`;
export const Switchers = styled.div``;
export const Slide = styled.div`
  width: 1.75vmin;
  height: 1.75vmin;
  margin-right: 0.2em;

  box-sizing: border-box;

  &::before {
    content: '';
    width: 100%;
    height: 100%;
    border-width: 0.25vmin 0.25vmin 0 0;
    border-style: solid;
    border-color: ${colors.alabaster};
    display: block;
  }

  &:after {
    content: '';
    float: left;
    position: relative;
    top: -100%;
    width: 100%;
    height: 100%;
    border-width: 0 0.25vmin 0 0;
    border-style: solid;
    border-color: ${colors.alabaster};
  }
`;
export const NextSide = styled(PrevSlide)`
  right: 5px;
  transform: rotate(45deg);
  left: initial;
`;

export const JobOffer = ({
  category = 'Engineering',
  title,
  handleReadMore,
  handleButtonClick,
}: any) => {
  const readMoreTxt = i18n.t('chat_item_description:read_more');
  const interestedTxt = i18n.t('chat_item_description:interested_in');
  return (
    <JobOfferWrapper>
      <Category>{'Engineering'}</Category>
      <OfferTitle>{title}</OfferTitle>
      <ReadMore onClick={handleReadMore}>{readMoreTxt}</ReadMore>
      <DarkButton onClick={handleButtonClick}>{interestedTxt}</DarkButton>
    </JobOfferWrapper>
  );
};
type PropsType = {
  onSubmit: (id: string | number) => void
}

export const JobOffers: FC<PropsType> = ({onSubmit}) => {
  const { offerJobs, category, setViewJob } = useChatMessanger();
  const [index, setIndex] = React.useState(0);
  const handleChange = (current: number, prev: number) => {
    setIndex(current);
  };
  // const handleSubmitClick = useCallback((id: string | number) => {
  //   triggerAction({
  //     type: CHAT_ACTIONS.INTERESTED_IN,
  //     payload: { item: `${id}` },
  //   });
  // },[]);

  return (
    <Wrapper>
      <Carousel
        index={index}
        onChange={handleChange}
        animation="slide"
        indicators={false}
        autoPlay={false}
        swipe
        className="my-carousel"
      >
        {Array.from({ length: offerJobs.length + 1 }).map((item, index) => {
          return index < offerJobs.length ? (
            <JobOffer
              key={`job-offer-${index}`}
              title={offerJobs[index].title}
              category={category}
              handleReadMore={() => setViewJob(offerJobs[index])}
              handleButtonClick={() => onSubmit(offerJobs[index].id)}
            />
          ) : (
            <NotFoundOffer key={`not-found-offer-${index}`} />
          );
        })}
      </Carousel>
      {index !== 0 && (
        <PrevSlide onClick={() => setIndex(index - 1)}>
          <Slide />
        </PrevSlide>
      )}
      {index !== offerJobs.length && (
        <NextSide onClick={() => setIndex(index + 1)}>
          <Slide />
        </NextSide>
      )}
    </Wrapper>
  );
};
