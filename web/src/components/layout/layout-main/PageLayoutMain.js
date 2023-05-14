import React from 'react'

import './PageLayoutMain.css'
import { useLocation } from 'react-router-dom'

function PageLayoutMain({ children, navbarElement }) {

  const pathname = useLocation().pathname

  return (
    <div className='page-layout'>
      <div className='navbar-container' hidden={pathname.includes('login')}>
        {navbarElement}
      </div>
      <div className='container'>
        {children}
      </div>
    </div>
  )
}

export default PageLayoutMain