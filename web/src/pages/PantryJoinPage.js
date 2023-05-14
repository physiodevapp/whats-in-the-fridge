import React from 'react'
import PantryJoin from '../components/pantry/PantryJoin'
import coverImage from './../assets/images/joining.png'

function PantryJoinPage() {
  return (
    <div className='joining-background'>
      <img className='cover' src={coverImage} alt="" />
      <PantryJoin />
    </div>
  )
}

export default PantryJoinPage