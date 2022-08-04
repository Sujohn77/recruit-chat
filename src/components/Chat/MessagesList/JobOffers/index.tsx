import { Button } from 'components/Layout/styles';
import { useChatMessanger } from 'contexts/MessangerContext';
import React, { FC } from 'react';
import Carousel from 'react-material-ui-carousel';
import styled from 'styled-components';
import { Category, JobOfferWrapper, OfferTitle, ReadMore } from './styles';

// type PropsType = {
//   offers: any[];
//   category: string;
//   onClick: () => void;
// };

export const Wrapper = styled.div`
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
  background: #575757;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: -10px;
  top: 50%;
  box-sizing: border-box;

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
    border-width: 0.3vmin 0.3vmin 0 0;
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
    border-width: 0 0.3vmin 0 0;
    border-style: solid;
    border-color: #fafafa;
  }
`;
export const NextSide = styled(PrevSlide)`
  right: -10px;
  transform: rotate(45deg);
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
      <Category>{'Engineering'}</Category>
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
  const { category } = useChatMessanger();
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
        {offers.map((item, index) => (
          <JobOffer
            key={`job-offer-${index}`}
            title={item}
            category={category}
            handleReadMore={handleReadMore}
            handleButtonClick={handleButtonClick}
          />
        ))}
      </Carousel>
      <PrevSlide>
        <Slide />
      </PrevSlide>
      <NextSide>
        <Slide />
      </NextSide>
    </Wrapper>
  );
};
