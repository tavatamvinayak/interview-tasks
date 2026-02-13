'use client'

import { loginWithGoogle } from '@/app/actions/auth'

export default function LoginPage() {
  return (
    <div className='h-screen flex justify-center items-center'>
      <button className='border px-5 py-2 cursor-pointer' onClick={loginWithGoogle}>
        Sign in with Google
      </button>
    </div>
  )
}