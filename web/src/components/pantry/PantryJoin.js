import React, { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import pantryService from '../../services/pantry'
import { Bounce, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from '../../contexts/AuthStore';


function PantryJoin() {
  // console.log('try to join')

  const { user } = useContext(AuthContext)
  const { pantryId } = useParams()
  const { register, handleSubmit, control, watch, setError, clearErrors, formState: { errors } } = useForm({ mode: 'onBlur' })
  const [serverError, setServerError] = useState(undefined)
  const [isCreating, setIsCreating] = useState(false)
  const navigate = useNavigate()

  const onJoinSubmit = async (token) => {
    const data = {
      guestEmail: user.email,
      token: token.token
    }
    console.log('submit data ', data)
    // return
    const toastId = toast.loading("Please wait...")
    setServerError()
    setIsCreating(true)
    document.getElementsByClassName('left-btn')[0].firstElementChild.disabled = true

    setTimeout(async () => {
      try {
        console.log('join data ', data)
        await pantryService.join(pantryId, data)

        setIsCreating(false)
        toast.update(toastId, { render: "Everything is ok 👌", type: "success", isLoading: false });
        setTimeout(() => {
          const { id } = user.pantries.find(pantry => (
            pantry.members.find(member => member.defaultOwner && member.grocerDinnerObjId == user.id)
          ))
          navigate(`/pantries/${id}/products`)
        }, 1000);
      } catch (error) {
        console.log('onJoinSubmit error >> ', error)

        toast.update(toastId, { render: error.response?.data?.message || error.message, type: "error", isLoading: false });
        setTimeout(() => {
          toast.dismiss()
          setIsCreating(false)
        }, 2000);
        document.getElementsByClassName('left-btn')[0].firstElementChild.disabled = false

        if (errors) {
          Object.keys(errors)
            .forEach((inputName) => {
              setError(inputName, { message: errors[inputName] })
            })
        } else {
          setServerError(error.response?.data?.message || error.message)
        }
      }
    }, 2000)
  }

  return (
    <>
      <div className="row pt-2 ps-2 pe-2">
        <div className="col">

          <form onSubmit={handleSubmit(onJoinSubmit)} className='row g-3'>
            {serverError && <div className='alert alert-danger d-lg-block'>{serverError}</div>}

            {/* TOKEN INPUT */}
            <div className='col-12'>
              <div className='input-group'>
                <span className='input-group-text' id="name"><i className='fa fa-key fa-fw'></i></span>
                <input
                  {...register('token', {
                    required: 'Token is required'
                  })}
                  type="text"
                  placeholder='The code you received by email'
                  className={`form-control text-center ${errors.token ? 'is-invalid' : ''}`}
                  id="token" />

                <button type='submit' className=" btn btn-dark" style={{width: 'auto'}} disabled={isCreating}>{!isCreating && 'Check'}{isCreating && 'Checking...'}</button>
                {errors.token && <div className='invalid-feedback'>{errors.token?.message}</div>}

              </div>
            </div>

            {/* SUBMIT BUTTON */}
            {/* <div className='container bottom-wrap'>
              <div className='row'>
                <div className='col p-0'>
                  <button type="submit" className="btn btn-dark btn-lg" disabled={isCreating}>{!isCreating && 'Send'}{isCreating && 'Sending...'}</button>
                </div>
              </div>
            </div> */}

          </form>

        </div>
      </div>

      <ToastContainer
        position={`${isCreating ? 'top-center' : 'bottom-center'}`}
        autoClose={4000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        closeButton={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce} />
    </>
  )
}

export default PantryJoin