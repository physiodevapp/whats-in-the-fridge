import React, { useContext, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../../../contexts/AuthStore'
import { useForm } from 'react-hook-form'
import grocerDinnerService from '../../../services/grocerDinner'

function GrocerDinnerLogin() {
  const navigate = useNavigate()
  const location = useLocation()
  // console.log('location >                             > ', location)
  const { register, handleSubmit, setError, formState: { errors } } = useForm({ mode: 'onBlur', defaultValues: { username: location?.state?.grocerDinner?.username } })
  const [serverError, setServerError] = useState(undefined)
  const { onUserChange } = useContext(AuthContext)

  const onLoginSubmit = async (grocerDinner) => {
    // console.log('location.state ', location.state)
    // return
    try {
      setServerError()
      grocerDinner = await grocerDinnerService.login(grocerDinner)
      // console.log('grocerDinner >> ', grocerDinner)
      onUserChange(grocerDinner)
      const { id } = grocerDinner.pantries.find(pantry => (
        pantry.members.find(member => member.defaultOwner && member.grocerDinnerObjId == grocerDinner.id)
      ))

      // const joinPath = localStorage.getItem('join-path')
      // console.log('joinPath ', joinPath)
      if (/^\/pantries\/[A-Za-z0-9]+\/join/.test(location.state?.prevRoute)) {
        // localStorage.removeItem('join-path')
        navigate(location.state.prevRoute)
      } else {
        navigate(`/pantries/${id}/products`)
      }

    } catch (error) {
      console.log('onLoginSubmit error >> ', error)
      const errors = error.response?.data?.errors
      if (errors) {
        Object.keys(errors)
          .forEach((inputName) => {
            setError(inputName, { message: errors[inputName] })
          })
      } else {
        setServerError(error.response?.data?.message || error.message)
      }
    }
  }

  return (
    <form className='row g-3' onSubmit={handleSubmit(onLoginSubmit)} >
      {serverError && <div className='alert alert-danger d-lg-block'>{serverError}</div>}

      {/* USERNAME */}
      <div className='col-12'>
        <input
          type="text"
          className={`form-control ${errors.username ? 'is-invalid' : ''}`}
          id='username'
          placeholder='my fridge username'
          autoComplete="username"
          {...register('username', {
            required: 'Username is required',
            onChange: (e) => setServerError()
          })}
        />
        {/* {errors.username && <div className='invalid-feedback'>{errors.username?.message}</div>} */}
      </div>

      {/* PASSWORD */}
      <div className='col-12'>
        <input type="password"
          className={`form-control ${errors.password ? 'is-invalid' : ''}`}
          id='userPassword'
          placeholder='password'
          autoComplete="current-password"
          {...register('password', {
            required: 'Password is required',
            onChange: (e) => setServerError()
          })}
        />
        {(errors.password || errors.username) && <div className='invalid-feedback login'>Invalid credentials</div>}
      </div>
      <div className='d-grid'>
        <button type="submit" className='btn btn-primary'>Login</button>
      </div>
    </form>
  )
}

export default GrocerDinnerLogin