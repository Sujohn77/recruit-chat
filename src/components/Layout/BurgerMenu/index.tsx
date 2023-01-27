import { IconButton } from '@mui/material';
import { useChatMessenger } from 'contexts/MessangerContext';
import { map } from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';
import i18n from 'services/localization';
import styled from 'styled-components';
import { colors } from 'utils/colors';
import { CHAT_ACTIONS } from 'utils/types';
import { languages } from '../../../utils/constants';
import { MenuItem } from './MenuItem';

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
interface IMenuItem {
  type: CHAT_ACTIONS;
  text: string;
  isDropdown?: boolean;
  options?: string[];
}
const BurgerMenu = () => {
  const { triggerAction } = useChatMessenger();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const closeMenu = (e: any) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', closeMenu);

    return () => {
      document.addEventListener('mousedown', closeMenu);
    };
  }, [isOpen]);

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

  const handleItemClick = (item: IMenuItem) => {
    triggerAction({
      type: item.type,
      payload: { item: item.text, isChatMessage: true },
    });
    setIsOpen(true);
  };

  const handleBurgerClick = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  const items = map(menuItems, (item, index) => (
    <MenuItem
      key={`menu-item-${index}`}
      item={item}
      onClick={handleItemClick}
    />
  ));

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
      {isOpen && <MenuItems ref={menuRef}>{items}</MenuItems>}
    </div>
  );
};

export default BurgerMenu;
