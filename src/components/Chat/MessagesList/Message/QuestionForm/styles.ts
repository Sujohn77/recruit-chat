import { FormInput } from 'components/Layout/Input/styles';
import { Button } from 'components/Layout/styles';
import styled from 'styled-components';
import { colors } from 'utils/colors';
import { IMAGES } from 'utils/constants';

export const Wrapper = styled.div`
  background: ${colors.alto};
  border-radius: 10px;
  padding: 17px 20px 26px;
  width: 250px;
  color: ${colors.dustyGray};
  border-radius: 10px;
  margin-bottom: 24px;
  position: relative;
`;

export const Title = styled.p`
  margin: 0 0 24px;
  font-size: 14px;
  line-height: 17px;
  color: ${colors.black};
  text-align: center;
`;

export const SubmitButton = styled(Button)`
  margin: 21px 0 0;
`;

export const QuestionInput = styled(FormInput)`
  margin: 0 0 14px !important;
  width: 100% !important;
`;
