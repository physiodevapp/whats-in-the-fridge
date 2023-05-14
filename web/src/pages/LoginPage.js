import React from 'react'
import loginImage from '../assets/images/login3.png'
import GrocerDinnerLogin from '../components/grocerdinner/grocerdinner-login/GrocerDinnerLogin'
import PageLayoutAccess from '../components/layout/layout-access/PageLayoutAccess'

function LoginPage() {
  return (
    <PageLayoutAccess coverImage={loginImage}>
      <GrocerDinnerLogin></GrocerDinnerLogin>
    </PageLayoutAccess>
  )
}


export default LoginPage