import React, { FC } from 'react';
import { getFormattedDate } from 'utils/helpers';
import { IRequisition } from 'utils/types';
import parse from 'html-react-parser';
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
          <S.InfoItem>{getFormattedDate(item.datePosted!)}</S.InfoItem>
          <S.InfoItem>{item.hiringType}</S.InfoItem>
        </S.ShortItems>
        <S.SubmitButton onClick={onClick}>Apply</S.SubmitButton>
      </S.ViewShortInfo>
      <S.ViewText>
        {item.company && (
          <p>
            <b>Company: </b>
            {item.company}
          </p>
        )}
        {item.status && (
          <p>
            <b>Status: </b>
            {item.status}
          </p>
        )}
      </S.ViewText>
      <S.TextTitle>Job description: </S.TextTitle>
      <S.ViewDescription>{parse(item.description)}</S.ViewDescription>
      <S.SubmitButton onClick={onClick}>Apply</S.SubmitButton>
    </S.ViewBody>
  );
};
