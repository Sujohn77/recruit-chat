import { IJobPosition } from 'contexts/types';
import React, { FC } from 'react';

import * as S from './styles';

type PropsType = {
  item: IJobPosition;
  onClick: () => void;
};

export const ViewJob: FC<PropsType> = ({ item, onClick }) => {
  return (
    <S.ViewBody>
      <S.ViewShortInfo>
        <S.TextHeaderTitle>{item.title}</S.TextHeaderTitle>
        <S.ShortItems>
          <S.InfoItem>{item.location}</S.InfoItem>
          <S.InfoItem>{item.postedDate}</S.InfoItem>
          <S.InfoItem>{item.fullTime}</S.InfoItem>
        </S.ShortItems>
        <S.SubmitButton onClick={onClick}>Apply</S.SubmitButton>
      </S.ViewShortInfo>
      <S.ViewText>{item.introDescription}</S.ViewText>
      <S.TextTitle>Job description: </S.TextTitle>
      <S.ViewText>{item.description}</S.ViewText>
      <S.SubmitButton onClick={onClick}>Apply</S.SubmitButton>
    </S.ViewBody>
  );
};
