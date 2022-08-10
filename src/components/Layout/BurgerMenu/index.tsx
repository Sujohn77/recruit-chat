import { IconButton } from '@mui/material';
import { useChatMessanger } from 'contexts/MessangerContext';
import { map } from 'lodash';
import { useCallback, useState } from 'react';
import i18n from 'services/localization';
import styled from 'styled-components';
import { colors } from 'utils/colors';
import { CHAT_ACTIONS } from 'utils/types';
import { ICONS, languages } from '../../../utils/constants';
import sizes from '../../../utils/sizes';
import { DropDown } from './DropDown';
import { IMenuItem, MenuItem } from './MenuItem';

const BurgerButton = styled.div`
  height: 20px;
  width: 10px;
  display: flex;
  justify-content: space-around;
  flex-flow: column nowrap;
  align-items: center;
  align-self: center;
  margin-right: 10px;
  cursor: pointer;
  top: 40%;
  right: 5%;
  @media (max-width: ${sizes.M}) {
    display: flex;
    margin-right: 0;
  }
`;

const MobileMenu = styled.img`
  width: 16px;
  height: 16px;
  opacity: 1;
`;

export const MenuItems = styled.div`
  padding: 0 10px;
  background: ${colors.gallery};
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 5px;
  position: absolute;
  bottom: 50px;
  left: 20px;
  animation: fade-in 0.1s ease-in forwards;
  opacity: 0;
  z-index: 2;
  @keyframes fade-in {
    0% {
      opacity: 0;
      transform: scale(0.9);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

const BurgerMenu = () => {
  const { triggerAction, changeLang } = useChatMessanger();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    {
      type: CHAT_ACTIONS.SAVE_TRANSCRIPT,
      text: i18n.t('chat_menu:save_transcript'),
    },
    {
      type: CHAT_ACTIONS.CHANGE_LANG,
      text: i18n.t('chat_menu:change_lang'),
      isDropdown: true,
      options: languages,
    },
    {
      type: CHAT_ACTIONS.FIND_JOB,
      text: i18n.t('chat_menu:find_job'),
    },
    {
      type: CHAT_ACTIONS.ASK_QUESTION,
      text: i18n.t('chat_menu:ask_question'),
    },
  ];

  const handleItemClick = ({ type, text }: IMenuItem) => {
    triggerAction({ type, payload: { item: text } });
    setIsOpen(false);
  };

  const handleBurgerClick = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  const items = map(menuItems, (item, index) =>
    item.isDropdown ? (
      <MenuItem
        key={`menu-item-${index}`}
        item={item}
        onClick={handleItemClick}
        onDropDownClick={(lang: string) => changeLang(lang)}
      />
    ) : (
      <MenuItem
        key={`menu-item-${index}`}
        item={item}
        onClick={handleItemClick}
      />
    )
  );

  return (
    <div onClick={handleBurgerClick}>
      <IconButton
        size="large"
        edge="start"
        color="inherit"
        aria-label="menu"
        sx={{ mr: 1 }}
      >
        <svg viewBox="0 0 100 80" width="16" height="16">
          <rect y="0" width="100" height="14" rx="10"></rect>
          <rect y="35" width="100" height="14" rx="10"></rect>
          <rect y="70" width="100" height="14" rx="10"></rect>
        </svg>
      </IconButton>
      {isOpen && <MenuItems>{items}</MenuItems>}
    </div>
  );
};

export default BurgerMenu;
