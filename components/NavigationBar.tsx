
import React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import FeatureSelector from './FeatureSelector'
import Link from 'next/link'
import { getServerSession } from "next-auth";
import { options } from '@/app/api/auth/[...nextauth]/options'
import Search from './Search';




const NavigationBar = async () => {
    const session=await getServerSession(options);
    const username=session?.user.firstName

  return (
    <div className='flex w-full items-center justify-between fixed top-0 left-0 h-[80px] bg-white lg:px-16 p-4 z-50 '>
      <div className='flex items-center'>

        <div className='ml-10'>
          <FeatureSelector />
        </div>
      </div>
      
      <Search placeholder='Caută o rețetă...'></Search>

      <DropdownMenu>
        <DropdownMenuTrigger >
          <div className='flex items-center'>
            <span className="material-symbols-outlined text-[3rem] flex justify-center">account_circle</span>
            <span>{username}</span>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Contul meu</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <Link href={`/Account/${session?.user.id}`}>
            <DropdownMenuItem>Contul meu</DropdownMenuItem>
          </Link>
          <Link href="/api/auth/signout">
            <DropdownMenuItem>Delogare</DropdownMenuItem>
          </Link>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default NavigationBar