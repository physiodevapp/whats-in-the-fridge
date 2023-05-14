import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import GooglePlacesAutocomplete, { geocodeByPlaceId, getLatLng } from 'react-google-places-autocomplete';
import pantryService from '../../../services/pantry'
import { Bounce, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function PantryNew() {
  const { register, handleSubmit, control, watch, setError, clearErrors, formState: { errors } } = useForm({ mode: 'onBlur' })
  const [serverError, setServerError] = useState(undefined)
  const navigate = useNavigate()
  const [isCreating, setIsCreating] = useState(false)

  const onProductSubmit = async (pantry) => {
    const toastId = toast.loading("Please wait...")
    setServerError()
    setIsCreating(true)
    document.getElementsByClassName('left-btn')[0].firstElementChild.disabled = true

    setTimeout(async () => {
      try {
        pantry.address = pantry.location.location.address
        pantry.location = {
          coordinates: [
            pantry.location.location.coordinates.lat,
            pantry.location.location.coordinates.lng
          ]
        }
        pantry = await pantryService.create(pantry)

        setIsCreating(false)
        toast.update(toastId, { render: "Everything is ok 👌", type: "success", isLoading: false });
        setTimeout(() => {
          navigate(-1) // or navigate(-1)
        }, 1000);

      } catch (error) {
        console.log('onLoginSubmit error >> ', error)

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

    }, 2000);
  }

  return (
    <>
      <div className="row pt-2 ps-2 pe-2">
        <div className="col">
          <form onSubmit={handleSubmit(onProductSubmit)} className='row g-3'>
            {serverError && <div className='alert alert-danger d-lg-block'>{serverError}</div>}

            {/* NAME INPUT */}
            <div className='col-12'>
              <div className='input-group'>
                <span className='input-group-text' id="name"><i className='fa fa-hashtag fa-fw'></i></span>
                <input
                  {...register('name', {
                    required: 'Pantry name is required',
                    minLength: {
                      value: 10,
                      message: "Wait! That's a 'tiny pantry' length... 😉!"
                    }
                  })}
                  type="text"
                  placeholder='My pantry name'
                  className={`form-control text-center ${errors.name ? 'is-invalid' : ''}`}
                  id="name" />
                {errors.name && <div className='invalid-feedback'>{errors.name?.message}</div>}
              </div>
            </div>

            {/* PANTRY LOCATION */}
            <div className='col-12'>
              {/* <label htmlFor="tags" className="form-label">Specially for...</label> */}
              <div className='input-group wrap-location'>
                <span className='input-group-text'><i className='fa fa-globe fa-fw'></i></span>
                <Controller
                  control={control}
                  name="location"
                  rules={{
                    required: {
                      value: true,
                      message: "Pantry location is required"
                    }
                  }}
                  render={({ field: { onChange, value, ref } }) => (
                    <GooglePlacesAutocomplete
                      ref={ref}
                      selectProps={{
                        className: `form-control p-0 ${errors.location ? 'is-invalid' : ''}`,
                        styles: {
                          control: (baseStyles, state) => ({
                            ...baseStyles,
                            border: 'none',
                            textAlign: 'start'
                          }),
                        },
                        placeholder: 'Where is my pantry?',
                        value: value?.result,
                        onChange: async (result) => {
                          // console.log(result)
                          const places = await geocodeByPlaceId(result.value.place_id)
                          const { lat, lng } = await getLatLng(places[0])
                          onChange({ result, location: { address: result.label, coordinates: { lat, lng } } })
                        },
                      }}
                    />
                  )}
                />
              </div>
              {errors.location && <div className='invalid-feedback' style={{ display: 'block' }}>{errors.location?.message}</div>}
            </div>

            {/* SUBMIT BUTTON */}
            <div className='container bottom-wrap'>
              <div className='row'>
                <div className='col p-0'>
                  <button type="submit" className="btn btn-dark btn-lg" disabled={isCreating}>{!isCreating && 'Create new pantry'}{isCreating && 'Creating...'}</button>
                </div>
              </div>
            </div>

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

export default PantryNew