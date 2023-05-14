import React, { useContext } from 'react'
import { AuthContext } from '../contexts/AuthStore'
import { Navigate, useLocation } from 'react-router-dom'

function PrivateRoute({ children }) {
  const { user } = useContext(AuthContext)
  const location = useLocation()
  
  if (!user) {
    return <Navigate to="/login" state={{prevRoute: location.pathname}} replace={true} />
  } else {
    return <>{children}</>
  }
}

export default PrivateRoute