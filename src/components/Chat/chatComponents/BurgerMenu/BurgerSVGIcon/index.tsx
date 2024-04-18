import React from "react";
import { IconButton } from "@mui/material";

export const BurgerSVGIcon: React.FC = () => (
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
);
