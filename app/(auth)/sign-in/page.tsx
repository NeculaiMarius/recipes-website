import React from 'react'
import Image from 'next/image'
import SignInForm from '@/components/SignInForm'



const SignIn = () => {
  return (
    <div className="w-full h-screen lg:grid lg:grid-cols-2 ">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-balance text-muted-foreground">
              Enter your email below to login to your account
            </p>
          </div>
            <SignInForm />
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <Image
          src=''
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
  
}

export default SignIn