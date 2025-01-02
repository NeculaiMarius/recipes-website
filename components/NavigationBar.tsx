
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import Link from 'next/link'



const NavigationBar = ({ username }: { username?: string }) => {
  return (
    <div className='flex w-full items-center justify-between fixed top-0 left-0 h-[80px] bg-white px-4 z-50'>
      <div className='flex items-center'>
        <Sheet>
          <SheetTrigger className='flex items-center p-3'>
            <span className="material-symbols-outlined bold-symbol text-4xl">menu</span></SheetTrigger>
          <SheetContent side={'left'}>
            <SheetHeader>
              <SheetTitle>Filtre</SheetTitle>
              <SheetDescription>
                Descoperă rețetele potrivite pentru tine cu ajutorul filtrelor
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>

        <FeatureSelector />
      </div>
      
      <p>BRAND NAME</p>

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
          <Link href="/My-account">
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