import React, { useContext } from 'react';
import { bool } from 'prop-types';
import { StyledBehind } from './Behind.styled';
import { theme } from '../themes/Themes';

function Behind({ open, setOpen, ...props }) {
  const isHidden = open ? true : false;
  return (
    <StyledBehind open={open} aria-hidden={!isHidden} {...props}></StyledBehind>
  )
}

export default Behind