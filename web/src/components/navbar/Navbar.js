import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/AuthStore";
import { useLocation } from "react-router-dom";


function Navbar({ leftBtn, rightBnt }) {

  const { user } = useContext(AuthContext)
  const [title, setTitle] = useState()
  const location = useLocation()
  const pantryId = useLocation().pathname.split('/')[2]

  useEffect(() => {
    setTitle(() => {
      let newTitle;
      if (location.pathname.includes('/pantries/new')) {
        newTitle = `Let's create a pantry`
      } else if (location.pathname.endsWith('/products/new')) {
        newTitle = `Let's barcode!`
      } else if (location.pathname.endsWith('/near') > 0) {
        newTitle = `Look at near groceries!`
      } else if (location.pathname.endsWith('/invitations/new')) {
        newTitle = `Let's invite someone else!` 
      } else if (/^\/pantries\/[A-Za-z0-9]+\/join/.test(location.pathname)){
        newTitle = `Let's check de code!` 
      } else {
        newTitle = user?.pantries?.find(pantry => pantry.id === pantryId)?.name
      }
      // console.log('navbar useeffect user', user)
      return newTitle
    })
  }, [user, location, pantryId])

  return (

    <>
      {user && <nav className="navbar bg-body-tertiary">
        <div className={`container ${!leftBtn ? 'justify-content-center' : ''}`}>
          <div className="row align-items-center" style={{ width: '100vw' }}>

            <div className={`left-btn ${leftBtn ? 'col-2' : ''} d-flex justify-content-center`}>
              {leftBtn}
            </div>

            <div className={`${leftBtn && rightBnt ? 'col-8' : leftBtn || rightBnt ? 'col-10' : 'col-12'} navbar-title ${leftBtn && rightBnt ? 'text-center' : 'text-start'}`}>
              {title}
            </div>

            <div className={`right-btn ${rightBnt ? 'col-2' : ''} d-flex justify-content-center`}>
              {rightBnt}
            </div>

          </div>
        </div>
      </nav>}
    </>

  )
}

Navbar.defaultProps = {
  leftBtn: undefined,
  rightBnt: undefined
}

export default Navbar