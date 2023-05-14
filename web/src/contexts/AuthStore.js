import React, { createContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import grocerDinnerService from '../services/grocerDinner'

const AuthContext = createContext()

const getUserFormLocalStorage = () => {
  const user = localStorage.getItem('current-user')
  if (user) {
    return JSON.parse(user)
  } else {
    return undefined
  }
}

function AuthStore({ children }) {

  const [user, setUser] = useState(getUserFormLocalStorage())
  const navigate = useNavigate()
  const [refreshUser, setRefreshUser] = useState(false)

  useEffect(() => {
    async function fetchData() {
        if (user) {
          try {
            const profile = await grocerDinnerService.get('me')
            handleUserChange({...profile, token: user.token})
          } catch (error) {
            handleUserChange(undefined)
          }
        }
    }
    fetchData()
  }, [refreshUser])

  useEffect(() => {
    const intervalId = setTimeout(() => {
      setRefreshUser(!refreshUser)
    }, 4000);
    return () => clearTimeout(intervalId)
  }, [refreshUser])

  const handleUserChange = (user) => {
    // console.log('handleUserChange >> ', user)
    if (!user) {
      localStorage.removeItem('user-access-token')
      localStorage.removeItem('current-user')
    } else {
      localStorage.setItem('user-access-token', user.token)
      localStorage.setItem('current-user', JSON.stringify(user))
    }
    setUser(user)
    // console.log('handleUserChange >> ', user)
  }

  const logout = () => {
    handleUserChange()
    navigate('/login')
  } 

  return (
    <AuthContext.Provider value={{user, onUserChange: handleUserChange, getUserFormLocalStorage, logout}}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthStore as default, AuthContext }