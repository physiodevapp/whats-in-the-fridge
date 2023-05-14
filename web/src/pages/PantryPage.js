import React, { useContext, useEffect } from 'react'
import ProductList from '../components/product/product-list/ProductList'
import { useNavigate, useParams } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthStore'

function PantryPage() {

  const navigate = useNavigate()
  const { pantryId } = useParams()
  const { getUserFormLocalStorage } = useContext(AuthContext)
  const user = getUserFormLocalStorage()

  const handleClick = () => {
    if (user) {
      navigate(`/pantries/${pantryId}/products/new`)
    } else {
      navigate('/login')
    }
  }

  const handleShareClick = () => {
    navigate(`/pantries/${pantryId}/invitations/new`)
  }

  useEffect(() => {
    const id = user.pantries.find(pantry => (
      pantry.members.find(member => pantry.id == pantryId && (member.role === user.role || member.role === 'vip') && member.grocerDinnerObjId == user.id)
    ))
    // console.log('user ', user)
    // console.log('id ', id)
    if (!id) {
      document.getElementsByClassName('navbar-btn-right')[0].hidden = true
    } else {
      document.getElementsByClassName('navbar-btn-right')[0].hidden = false
    }
  }, [pantryId])

  return (
    <>

      <ProductList />

      <button className='btn btn-outline-dark left-bottom-btn btn-lg' onClick={handleShareClick}>
        <i className="fa fa-share-alt" aria-hidden="true"></i>
      </button>

      <div className='right-bottom-btn'>
        <button type="button" className={`btn btn-outline-dark`} onClick={handleClick}>
          <i className={`fa fa-barcode`} aria-hidden="true"></i>
        </button>
      </div>

    </>

  )
}

export default PantryPage