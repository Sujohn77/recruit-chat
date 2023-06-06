import { CHAT_ACTIONS, IMenuItem } from "utils/types";

export interface IMenuItemProps {
  item: {
    type: CHAT_ACTIONS;
    text: string;
    isDropdown?: boolean;
    options?: string[];
  };
  onClick: (item: IMenuItem) => void;
}
