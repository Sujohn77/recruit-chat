import { FC } from "react";

import { ILocalMessage } from "utils/types";
import { MessageOptionTypes } from "utils/constants";
import { ReferralJobOptions } from "./ReferralJobOptions";
import { ReferralOptions } from "./ReferralOptions";
import { MessageOptions } from "./MessageOptions";

interface IOptionListProps {
  message: ILocalMessage;
  isLastMess: boolean;
}

export const OptionList: FC<IOptionListProps> = (props) => {
  if (!props.message?.optionList) {
    return null;
  }

  switch (props.message.optionList.type) {
    case MessageOptionTypes.AvailableJobs:
      return <ReferralJobOptions {...props} />;
    case MessageOptionTypes.Referral:
      return <ReferralOptions {...props} />;
    default:
      return <MessageOptions {...props} />;
  }
};
