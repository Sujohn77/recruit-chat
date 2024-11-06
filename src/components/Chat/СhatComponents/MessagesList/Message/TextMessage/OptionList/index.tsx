import { FC } from "react";

import { ILocalMessage } from "utils/types";
import { MessageOptionTypes } from "utils/constants";
import { ReferralJobOptions } from "./ReferralJobOptions";
import { ReferralQuestion } from "./ReferralQuestion";
import { MessageOptions } from "./MessageOptions";
import { ConsentOptions } from "./ConsentOptions";
import { DefOptions } from "./DefaultQuestion";

interface IOptionListProps {
  message: ILocalMessage;
  isLastMess: boolean;
  setSelectedReferralJobId: React.Dispatch<
    React.SetStateAction<number | undefined>
  >;
}

export const OptionList: FC<IOptionListProps> = (props) => {
  if (!props.message?.optionList) {
    return null;
  }

  switch (props.message.optionList.type) {
    case MessageOptionTypes.AvailableJobs:
      return <ReferralJobOptions {...props} />;
    case MessageOptionTypes.Referral:
      return <ReferralQuestion {...props} />;
    case MessageOptionTypes.Consent:
      return <ConsentOptions {...props} />;
    case MessageOptionTypes.DefaultOptions:
      return <DefOptions {...props} />;
    default:
      return <MessageOptions {...props} />;
  }
};
