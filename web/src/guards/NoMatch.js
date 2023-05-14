import React, { useContext } from 'react'
import { AuthContext } from '../contexts/AuthStore'
import { Navigate, useLocation } from 'react-router-dom'

function NoMatch() {

  const { user } = useContext(AuthContext)
  const location = useLocation()

  if (user) {
    const { id } = user.pantries.find(pantry => (
      pantry.members.find(member => member.defaultOwner && member.grocerDinnerObjId == user.id)
    ))
    return (
      <Navigate to={`/pantries/${id}/products`} state={{prevRoute: location.pathname}} replace={true}/>
    )
  } else {
    return (
      <Navigate to={'/login'} replace={true}/>
    )
  }

}

export default NoMatch