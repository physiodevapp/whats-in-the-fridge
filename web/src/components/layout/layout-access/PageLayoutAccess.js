import React from 'react'
import './PageLayoutAccess.css'

function PageLayoutAccess({ children, coverImage }) {
  return (
    <div className='access'>
      <img className='cover' src={coverImage} alt="" />
      <div style={{ padding: '0 20%' }}>
        {children}
      </div>
    </div>
  )
}

export default PageLayoutAccess