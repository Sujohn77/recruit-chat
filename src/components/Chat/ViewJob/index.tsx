import React, { FC } from 'react';
import { IRequisition } from 'utils/types';

import * as S from './styles';

type PropsType = {
  item: IRequisition | null;
  onClick: () => void;
};

export const ViewJob: FC<PropsType> = ({ item, onClick }) => {
  if (!item) {
    return null;
  }
  return (
    <S.ViewBody>
      <S.ViewShortInfo>
        <S.TextHeaderTitle>{item.title}</S.TextHeaderTitle>
        <S.ShortItems>
          <S.InfoItem>{item.location.city}</S.InfoItem>
          <S.InfoItem>{item.datePosted}</S.InfoItem>
          <S.InfoItem>{item.hiringType}</S.InfoItem>
        </S.ShortItems>
        <S.SubmitButton onClick={onClick}>Apply</S.SubmitButton>
      </S.ViewShortInfo>
      <S.ViewText>Company: {item.company}</S.ViewText>
      <S.ViewText>Status: {item.status}</S.ViewText>
      <S.TextTitle>Job description: </S.TextTitle>
      <S.ViewText>{item.description}</S.ViewText>
      <S.SubmitButton onClick={onClick}>Apply</S.SubmitButton>
    </S.ViewBody>
  );
};
