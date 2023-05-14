import React, { useContext } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthStore'

function Button({ faClass, onClick: handleClick, show, position }) {

  const pathname = useLocation().pathname
  const { getUserFormLocalStorage } = useContext(AuthContext)
  const navigate = useNavigate()

  // console.log('button >> ', faClass, show)

  const handleAuthClick = () => {
    if (getUserFormLocalStorage()) {
      handleClick()
    } else {
      navigate('/login')
    }
  }

  return (
    <button type="button" className={`btn btn-outline-dark ${position === 'right' ? 'navbar-btn-right': ''}`}
      hidden={show ? false : (
        !pathname.includes('new') && !pathname.includes('near'))
      } onClick={handleAuthClick}>
      <i className={`${faClass}`} aria-hidden="true"></i>
    </button>
  )
}

Button.defaultProps = {
  show: true,
  faClass: '',
  onClick: undefined
}

export default Button