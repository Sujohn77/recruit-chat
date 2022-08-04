import styled from "styled-components";
import { colors } from "utils/colors";

export const JobOfferWrapper = styled.div`
    background: ${colors.alto};
    border-radius: 10px;
    padding: 20px 18px;
    color: ${colors.black};
    font-size: 14px;
    line-height: 17px;
    margin: 0 18px;
    height: 239px;
    box-sizing: border-box;
`;

export const Category = styled.h3`
  font-size: 14px;
  line-height: 17px;
  font-weight: 500;
  margin: 0 0 24px;
`;

export const OfferTitle = styled.p`
    margin: 0 12px;
    height: 34px;
`;

export const ReadMore = styled.p`
  text-transform: uppercase;
  margin: 55px 12px 17px;
  color: ${colors.black};
  border-bottom: 1px solid ${colors.black};
  width: fit-content;
`;