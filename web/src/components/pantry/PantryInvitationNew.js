import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import pantryService from '../../services/pantry'
import { Bounce, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function PantryInvitationNew() {
  const { pantryId } = useParams()
  const { register, handleSubmit, control, watch, setError, clearErrors, formState: { errors } } = useForm({ mode: 'onBlur' })
  const [serverError, setServerError] = useState(undefined)
  const [isCreating, setIsCreating] = useState(false)
  const navigate = useNavigate()

  const onInvitationSubmit = async (guest) => {
    console.log('submit invitation ', guest)
    // return
    const toastId = toast.loading("Please wait...")
    setServerError()
    setIsCreating(true)
    document.getElementsByClassName('left-btn')[0].firstElementChild.disabled = true

    setTimeout(async () => {
      try {
        await pantryService.invite(pantryId, guest)

        setIsCreating(false)
        toast.update(toastId, { render: "Everything is ok 👌", type: "success", isLoading: false });
        setTimeout(() => {
          navigate(-1) // or navigate(-1)
        }, 1000);
      } catch (error) {
        console.log('onInvitationSubmit error >> ', error)

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
      <div className="row mt-3 pt-2 ps-2 pe-2">
        <div className="col">

          <form onSubmit={handleSubmit(onInvitationSubmit)} className='row g-3'>
            {serverError && <div className='alert alert-danger d-lg-block'>{serverError}</div>}

            {/* GUEST-EMAIL INPUT */}
            <div className='col-12'>
              <div className='input-group'>
                <span className='input-group-text' id="name"><i className='fa fa-envelope fa-fw'></i></span>
                <input
                  {...register('guestEmail', {
                    required: 'Guest email is required',
                    pattern: {
                      value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                      message: 'Invalid email'
                    }
                  })}
                  type="text"
                  placeholder='Guest email'
                  className={`form-control text-center ${errors.guestEmail ? 'is-invalid' : ''}`}
                  id="guestEmail" />

                <button type='submit' className=" btn btn-dark" style={{width: 'auto'}} disabled={isCreating}>{!isCreating && 'Send'}{isCreating && 'Sending...'}</button>
                {errors.guestEmail && <div className='invalid-feedback'>{errors.guestEmail?.message}</div>}

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

export default PantryInvitationNew