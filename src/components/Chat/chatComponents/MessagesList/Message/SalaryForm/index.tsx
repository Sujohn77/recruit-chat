import { useChatMessenger } from "contexts/MessengerContext";
import { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import map from "lodash/map";

import { DefaultInput } from "components/Layout/Input";
import { DarkButton } from "components/Layout/styles";
import { currencies } from "utils/constants";
import { getMessageProps } from "utils/helpers";
import { CHAT_ACTIONS, ILocalMessage } from "utils/types";
import * as S from "./styles";

type PropsType = { message: ILocalMessage };

export const SalaryForm: FC<PropsType> = ({ message }) => {
  const { t } = useTranslation();
  const { triggerAction, error } = useChatMessenger();
  const messagesProps = getMessageProps(message);

  const [salary, setSalary] = useState("");
  const [currency, setCurrency] = useState("$");

  const optionItems = map(currencies, (opt, index) => (
    <S.Option
      selected={currency === opt}
      key={`currency-${index}`}
      onClick={() => setCurrency(opt)}
    >
      {opt}
    </S.Option>
  ));

  return (
    <S.Wrapper {...messagesProps}>
      <DefaultInput
        value={salary}
        onChange={(e: any) => setSalary(e.target.value)}
        placeHolder={"0"}
        error={error}
      />
      <S.Options>{optionItems}</S.Options>
      <DarkButton
        onClick={() =>
          Number(salary) > 400 &&
          Number(salary) < 15000 &&
          triggerAction({
            type: CHAT_ACTIONS.SET_SALARY,
            payload: { item: `${salary} ${currency}` },
          })
        }
      >
        {t("buttons:sent")}
      </DarkButton>
    </S.Wrapper>
  );
};
