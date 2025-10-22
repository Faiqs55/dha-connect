import ResetPasswordForm from '@/Components/ResetPasswordForm'
import Spinner from '@/Components/Spinner'
import React, { Suspense } from 'react'

const page = () => {
  return (
    <Suspense fallback={<Spinner/>}>
      <ResetPasswordForm/>
    </Suspense>
  )
}

export default page