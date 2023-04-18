import { FC } from "react";
import parse from "html-react-parser";

import * as S from "./styles";
import { IRequisition } from "utils/types";
import { getFormattedDate } from "utils/helpers";

interface IViewJobProps {
  item: IRequisition | null;
  onClick: () => void;
}

// TODO: add translation
export const ViewJob: FC<IViewJobProps> = ({ item, onClick }) => {
  return !item ? null : (
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
