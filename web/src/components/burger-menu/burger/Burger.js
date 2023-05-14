import React, { useContext } from 'react'
import { bool, func } from 'prop-types';
import { StyledBurger, HamburgerSpan } from './Burger.styled';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../../button/Button';
import { AuthContext } from '../../../contexts/AuthStore';

function Burger({ open, setOpen, ...props }) {
  const isExpanded = open ? true : false;
  const pathname = useLocation().pathname
  const navigate = useNavigate()
  const {user} = useContext(AuthContext)


  const handleLeftBtn = () => {
    if (/^\/pantries\/[A-Za-z0-9]+\/join/.test(pathname)) {
      // console.log('user home ', user)
      const { id } = user.pantries.find(pantry => (
        pantry.members.find(member => member.defaultOwner && member.grocerDinnerObjId == user.id)
      ))
      navigate(`/pantries/${id}/products`)
    } else {
      navigate(-1)
    }
  }

  return (
    <>
      <StyledBurger aria-label="Toggle menu" hidden={pathname.includes('new') || pathname.endsWith('near') || /^\/pantries\/[A-Za-z0-9]+\/join/.test(pathname)} aria-expanded={isExpanded} open={open} onClick={() => setOpen(!open)} {...props}>
        {/* <span />
      <span />
      <span /> */}
        <HamburgerSpan />
        <HamburgerSpan />
        <HamburgerSpan />
      </StyledBurger>
      <Button faClass={'fa fa-chevron-left'} show={/^\/pantries\/[A-Za-z0-9]+\/join/.test(pathname) || false}
        onClick={handleLeftBtn}
      />
    </>
  )
}

Burger.propTypes = {
  open: bool.isRequired,
  setOpen: func.isRequired,
};

export default Burger