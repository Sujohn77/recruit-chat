import * as ChatStyles from "components/Chat/styles";
import { Chat } from "components/Chat";
import { Message } from "components/Chat/styles";
import React from "react";
import { getMessageColorProps } from "utils/helpers";
const messageProps = getMessageColorProps(true);

// export const FindJob = () => {
//   return (
//     // <Chat>
//     //   <ChatStyles.Message {...messageProps}>Find a job</ChatStyles.Message>
//     // </Chat>
//   );
// };
