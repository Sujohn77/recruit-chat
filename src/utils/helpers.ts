import { colors } from "./colors";

// interface IGetMessageColorProps {
//     isOwn?: boolean;
// }

interface IMessageProps {
    color: string;
    backColor: string
    isOwn: boolean;
}

export const getMessageColorProps = (isOwn?: boolean):IMessageProps  => {
  if (isOwn) {
    return {
      color: colors.white,
      backColor: colors.boulder,
      isOwn
    };
  }
  return {
    color: colors.dustyGray,
    backColor: colors.alto,
    isOwn: !!isOwn
  };
};