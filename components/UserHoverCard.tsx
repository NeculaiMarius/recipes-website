import { HoverCard } from '@radix-ui/react-hover-card'
import React from 'react'
import Link from 'next/link'
import { Avatar, AvatarFallback } from './ui/avatar'
import { HoverCardContent, HoverCardTrigger } from './ui/hover-card'

const UserHoverCard = ({nume,prenume,email,id}:{nume:string,prenume:string,id:number,email:string}) => {
  return (
    <HoverCard openDelay={10} closeDelay={10}>
      <HoverCardTrigger>
        <span className="hover:text-emerald-700 hover:underline cursor-pointer">{nume + " " + prenume}</span> 
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-2">
            <Link href={`/Account/${id}`}>
              <Avatar className="h-8 w-8">
                <AvatarFallback>{(nume[0]+prenume[0]).toUpperCase()}</AvatarFallback>
              </Avatar>
            </Link>
            <div>
              <Link href={`/Account/${id}`}>
                <h4 className="text-sm font-medium">{nume+" "+prenume}</h4>
              </Link>
              <p className='text-xs text-muted-foreground'>{email}</p>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}

export default UserHoverCard