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
import { Button } from './ui/button'
import Link from 'next/link'
import { Input } from "@/components/ui/input"
import { signUp } from '@/lib/actions/database-actions'
import { useRouter } from 'next/navigation'


const formSchema = z.object({
  lastName: z.string().min(3).max(20),
  firstName:z.string().min(3).max(20),
  email: z.string().email().max(50),
  password:z.string().min(3).max(20),
  rePassword:z.string().min(3).max(20),
})



const SignInForm = () => {
  const router=useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password:"",
      rePassword:"",
    },
  })
  
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      const response=await signUp(values.lastName,values.firstName,values.email,values.password,values.rePassword);
      if(response)
      {
        router.push('/');
      }
    } catch (error) {
      console.log(error);
    }
    finally{
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

        <div className='flex justify-between'>
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem className='w-[47%]'>
                <FormLabel>Last name</FormLabel>
                <FormControl>
                  <Input placeholder="Your last name" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem className='w-[47%]'>
                <FormLabel>First name</FormLabel>
                <FormControl>
                  <Input placeholder="Your last name" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        

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
              <FormLabel className='flex justify-between'><span>Password</span></FormLabel>
              <FormControl>
                <Input placeholder="Enter your password" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="rePassword"
          render={({ field }) => (
            <FormItem >
              <FormControl>
                <Input placeholder="Re enter your password" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          Sign up
        </Button>
      </form>
      <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href={'/sign-in'} className="underline">
              Sign in
            </Link>
          </div>
    </Form>
  )
}

export default SignInForm