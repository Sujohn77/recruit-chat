import { Button } from 'components/Layout/styles';
import { useChatMessanger } from 'contexts/MessangerContext';
import React, { FC } from 'react';
import Carousel from 'react-material-ui-carousel';
import styled from 'styled-components';
import { Category, JobOfferWrapper, OfferTitle, ReadMore } from './styles';

export const Wrapper = styled.div`
  position: relative;
  font-family: Inter-SemiBold;
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
    border-color: #fafafa;
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
    border-color: #fafafa;
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
  const readMoreTxt = 'Read more';
  const interestedTxt = 'I’m interested';
  return (
    <JobOfferWrapper>
      <Category>{category}</Category>
      <OfferTitle>{title}</OfferTitle>
      <ReadMore onClick={handleReadMore}>{readMoreTxt}</ReadMore>
      <Button isBackground onClick={handleButtonClick}>
        {interestedTxt}
      </Button>
    </JobOfferWrapper>
  );
};

const offers = [
  'DevOps Junior Engineer',
  'DevOps Middle Engineer',
  'DevOps Senior Engineer',
];

export const JobOffers: FC = () => {
  const { offerJobs, category } = useChatMessanger();
  const [index, setIndex] = React.useState(0);

  const handleChange = (current: number, prev: number) => {
    setIndex(current);
  };
  const handleReadMore = () => {};
  const handleButtonClick = () => {};
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
        {offerJobs.map((item, index) => (
          <JobOffer
            key={`job-offer-${index}`}
            title={item}
            category={category}
            handleReadMore={handleReadMore}
            handleButtonClick={handleButtonClick}
          />
        ))}
      </Carousel>
      {index !== 0 && (
        <PrevSlide onClick={() => setIndex(index - 1)}>
          <Slide />
        </PrevSlide>
      )}
      {index !== offers.length - 1 && (
        <NextSide onClick={() => setIndex(index + 1)}>
          <Slide />
        </NextSide>
      )}
    </Wrapper>
  );
};
