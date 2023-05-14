import React, { useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import productService from '../../../services/product'
import { useNavigate, useParams } from 'react-router-dom'
import moment from 'moment'
import CreatableSelect from 'react-select/creatable';
import { Bounce, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ProductNew() {
  const { pantryId } = useParams()
  const [barcode, setBarcode] = useState('')
  const [productImg, setProductImg] = useState(undefined)
  const videoRef = useRef()
  const { register, handleSubmit, control, watch, setError, clearErrors, formState: { errors } } = useForm({ mode: 'onBlur' })
  const [serverError, setServerError] = useState(undefined)
  const navigate = useNavigate()
  const [productSelectOptions, setProductSelectOptions] = useState([])
  const [isCreating, setIsCreating] = useState(false)

  // console.log("formState errors >> ", errors);
  // console.debug(`Tags: ${watch('tags')}`);
  // console.log(`Selected location is: ${watch('location')}`)

  useEffect(() => {
    productService.list(pantryId)
      .then((products) => {
        const tags = products.reduce((tags, product) => {
          const newTags = product.tags.filter((tag) => !tags.includes(tag) && tag)
          tags.push(...newTags)
          return tags
        }, [])

        setProductSelectOptions(tags.map(tag => ({ value: tag, label: `${tag}` })));
      })
      .catch(console.error)

    try {
      /************* START VIDEO **************** */
      (async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: {
              ideal: "environment"
            }
          },
          audio: false
        });
        videoRef.current.srcObject = stream;
        await videoRef.current.play();

        /*********** GET BARCODE ********** */
        // eslint-disable-next-line no-undef
        const barcodeDetector = new BarcodeDetector({ formats: ['ean_13'] });
        (function searchBarcode() {
          window.setTimeout(async () => {
            try {
              const barcodes = await barcodeDetector.detect(videoRef.current);
              if (barcodes.length <= 0) {
                searchBarcode()
              } else {
                setBarcode(barcodes[0].rawValue)
                return
              };
            } catch (error) {
              console.log(error)
            }
          }, 1000)
        })()

      })()


    } catch (error) {
      console.error(error)
    }

    // TOD UNMOUNT GETRACKS
    return async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: {
            ideal: "environment"
          }
        },
        audio: false
      });

      if (stream) {
        stream.getTracks().forEach(function (track) {
          if (track.readyState == 'live' && track.kind === 'video') {
            track.stop();
          }
        });
      }
    }

  }, [pantryId])

  /*********** FORM FUNCTIONS *********** */

  const handleChange = (event) => {
    event.preventDefault()
    // console.log(event.target.name)
    if (event.target.name === 'barcode') {
      setBarcode(event.target.value)
    }
  }

  const onProductSubmit = async (product) => {
    const toastId = toast.loading("Please wait...")
    setServerError()
    setIsCreating(true)
    document.getElementsByClassName('left-btn')[0].firstElementChild.disabled = true

    setTimeout(async () => {
      try {
        setServerError()
        product.barcode.toString()
        // console.log('expiryDate ', product.expiryDate)
        product.expiryDate = moment(product.expiryDate, 'DD-MM-YY').toDate()
        console.log(product)
        // return
        product = await productService.create(pantryId, product)
        if (productImg) {
          // const file = new File([productImg], product.id, { type: "image/jpeg" })
          // console.log('productImg will be uploaded >> ', file)
          // return 
          const fileForm = new FormData()
          fileForm.append('urlImage', productImg)
          const urlImage = await productService.imgUpload(pantryId, product.id, fileForm)
          // console.log('uploaded urlImage >> ', urlImage)
          product.urlImage = urlImage.urlImage
          product = await productService.update(pantryId, product.id, product)
          // console.log('product updated with image >> ', product)
        }

        setIsCreating(false)
        toast.update(toastId, { render: "Everything is ok 👌", type: "success", isLoading: false });
        setTimeout(() => {
          navigate(`/pantries/${pantryId}/products`) // or navigate(-1)
        }, 1000);
  
      } catch (error) {
        console.log('onLoginSubmit error >> ', error)

        toast.update(toastId, { render: error.response?.data?.message || error.message, type: "error", isLoading: false });
        setTimeout(() => {
          toast.dismiss()
          setIsCreating(false)
        }, 2000);
        document.getElementsByClassName('left-btn')[0].firstElementChild.disabled = false
  
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
      
    }, 2000);

  }
  /*********** END FORM FUNCTIONS *********** */

  /************** TAKE PHOTO ******************** */
  function takePhoto() {
    const constraints = { facingMode: 'environment', "video": { width: { exact: 400 } }, advanced: [{ focusMode: "continuous" }] };
    navigator.mediaDevices.getUserMedia({ video: constraints })
      .then((mediastream) => {
        videoRef.srcObject = mediastream;
        const videoTrack = mediastream.getVideoTracks()[0];
        const imageCapturer = new ImageCapture(videoTrack);
        imageCapturer.takePhoto()
          .then((blob) => {
            console.log("Photo taken: " + blob.type + ", " + blob.size + "B", blob)
            // console.log('URL Photo >> ', URL.createObjectURL(blob))

            const file = new File([blob], "producId", { type: "image/jpeg" })
            setProductImg(file)
            // console.log('file >> ', file)

            toast.success(<span>Your tasty food was captured! <span style={{ fontSize: '1.4rem' }}>🥗</span></span>);
          })
          .catch((error) => {
            console.error("takePhoto() failed: ", error);
          });

      })
      .catch(e => { console.error('getUserMedia() failed: ', e); });
  }
  /************** END >> TAKE PHOTO ************* */

  return (
    <>
      <div className="video-wrapper-outline mt-3"></div>
      <div className="video-wrapper mt-3"></div>
      <div className="row row-camera">
        <div className="col">
          <video ref={videoRef}></video>
        </div>
      </div>
      <div className="row row-form-product pt-2 ps-2 pe-2">
        <div className="col">
          <form onSubmit={handleSubmit(onProductSubmit)} className='row g-3'>
            {/* {serverError && <div className='alert alert-danger d-lg-block'>{serverError}</div>} */}
            {/* BARCODE INPUT */}
            <div className="col-6">
              <label htmlFor="barcode" className="form-label">Barcode</label>
              <div className="input-group">
                <span className="input-group-text" id="barcode"><i className="fa fa-barcode fa-fw" aria-hidden="true"></i></span>
                <input
                  value={barcode}
                  {...register('barcode', {
                    required: {
                      value: true,
                      message: 'or type'
                    },
                    min: 0,
                    max: {
                      value: 9999999999999,
                      message: '(Invalid)'
                    },
                    pattern: {
                      value: /^(\d{13})?$/,
                      message: '(Invalid)'
                    },
                    onChange: (event) => handleChange(event)
                  })}
                  type="number"
                  placeholder='EAN-13'
                  className={`form-control text-center ${errors.barcode ? 'is-invalid' : ''}`}
                  id="barcode"
                  aria-describedby="barcodeHelp"
                />
              </div>
              <div id="barcodeHelp" className="form-text">☝️Try camera... {errors.barcode && errors.barcode?.message && <span className='invalid-feedback' style={{ display: 'contents', fontSize: 'inherit', fontStyle: 'italic' }}>{errors.barcode?.message}</span>}</div>
            </div>

            {/* EXPIRY-DATE */}
            <div className="col-6">
              <label htmlFor="expiryDate" className="form-label">Expiry Date</label>
              <div className="input-group">
                <span className="input-group-text" id="expiryDate"><i className="fa fa-calendar fa-fw" aria-hidden="true"></i></span>
                <input
                  {...register('expiryDate', {
                    required: 'Expiry date is required',
                    pattern: {
                      value: /(^0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-(\d{2}$)/,
                      message: "Remember 'xx-xx-xx' 😉"
                    }
                  })}
                  type="datetime"
                  placeholder='01-06-23'
                  className={`form-control text-center ${errors.expiryDate ? 'is-invalid' : ''}`}
                  id="datetime"
                  aria-describedby="expiryDateHelp"
                />
              </div>
              <div id="expiryDateHelp" className="form-text">{errors.expiryDate && <span className='invalid-feedback' style={{ display: 'contents', fontSize: 'inherit', fontStyle: 'normal' }}>{errors.expiryDate?.message}</span>}</div>
            </div>

            {/* NAME INPUT */}
            <div className='col-12'>
              <div className='input-group'>
                <span className='input-group-text' id="name"><i className='fa fa-cutlery fa-fw'></i></span>
                <input
                  {...register('name', {
                    required: 'Food name is required',
                    maxLength: {
                      value: 20,
                      message: "Wait! That's tooo 'tasty' length... 😋!"
                    }
                  })}
                  type="text"
                  placeholder='My tasty food name!'
                  className={`form-control text-center ${errors.name ? 'is-invalid' : ''}`}
                  id="name" />
                {errors.name && <div className='invalid-feedback'>{errors.name?.message}</div>}
              </div>
            </div>

            {/* TAG SELECT */}
            <div className='col-12'>
              {/* <label htmlFor="tags" className="form-label">Specially for...</label> */}
              <div className='input-group wrap-tags'>
                <span className="input-group-text" id="tags"><i className="fa fa-tag fa-fw" aria-hidden="true"></i></span>
                <Controller
                  control={control}
                  name="tags"
                  rules={{
                    required: {
                      value: true,
                      message: 'One food tag is required at least'
                    },
                    validate: (options) => {
                      return (options.length && options.length < 3) || "Two many tags!"
                    }
                  }}
                  render={({ field: { onChange, value, ref } }) => (
                    <CreatableSelect
                      inputRef={ref}
                      isMulti
                      placeholder='Up to 2 tags (be creative!...)'
                      className={`form-control p-0 ${errors.tags ? 'is-invalid' : ''}`}
                      options={productSelectOptions}
                      // https://react-select.com/styles
                      styles={{
                        control: (baseStyles, state) => ({
                          ...baseStyles,
                          border: 'none',
                          maxWidth: '100%'
                        }),
                      }}
                      value={productSelectOptions.find(option => option?.value === value)}
                      onChange={(options) => {
                        if (options.length > 2) {
                          // clearErrors('tags')
                          setError('tags', { type: 'maxLength', message: "Too many tags!" })
                        } else {
                          clearErrors('tags')
                        }
                        onChange(options.map(option => option.value))
                      }}
                    />
                  )}
                />
              </div>
              {errors.tags && <div className='invalid-feedback' style={{ display: 'block' }}>{errors.tags?.root?.message || errors.tags?.message}</div>}
            </div>

            <div className='container bottom-wrap'>
              <div className='row'>
                <div className='col ps-0'>
                  <button type="submit" className="btn btn-dark btn-lg" disabled={isCreating}>{!isCreating && 'Feed the pantry'}{isCreating && 'Feeding...'}</button>
                </div>
                <div className='col-2 p-0'>
                  <button type="button" className={`btn btn-outline-dark btn-lg ${productImg ? 'image-taken' : ''}`} disabled={isCreating} onClick={takePhoto}>
                    <i className={`fa fa-camera`} aria-hidden="true"></i>
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      
      <ToastContainer
        position={`${isCreating ? 'top-center' : 'bottom-center'}`}
        autoClose={`${isCreating ? 4000 : 1000}`}
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

export default ProductNew