import React from 'react'
import PantryInvitationNew from '../components/pantry/PantryInvitationNew'
import coverImage from './../assets/images/inviting.png'

function PantryInvitationNewPage() {
  return (
    <div className='inviting-background'>
      <img className='cover' src={coverImage} alt="" />
      <PantryInvitationNew />
    </div>
  )
}

export default PantryInvitationNewPage