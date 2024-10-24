"use client"
import React, { useState } from 'react'
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Input } from './ui/input'
import { Button } from './ui/button'
import Link from 'next/link'
import { signIn } from 'next-auth/react'


const formSchema = z.object({
  email: z.string().email(),
  password:z.string().min(3).max(50),
})



const SignInForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password:"",
    },
  })
  
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try{
      const res= await signIn("credentials",{
        email: values.email,
        password:values.password,
        redirect:true,
        callbackUrl: "/",
      });
      console.log(res)
    }
    catch(error){
      console.log("Error on sign in: "+error);
    }
    finally{
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter your email" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className='flex justify-between'><span>Password</span><span className='underline'>Forgot your password?</span></FormLabel>
              <FormControl>
                <Input placeholder="Enter your password" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          Login
        </Button>
      </form>
      <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href={'/sign-up'} className="underline">
              Sign up
            </Link>
          </div>
    </Form>
  )
}

export default SignInForm