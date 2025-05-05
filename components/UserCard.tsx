import React from 'react'
import { Avatar, AvatarFallback } from './ui/avatar'
import FollowButton from './Buttons/FollowButton'
import { User } from '@/interfaces/users'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { MdWorkspacePremium } from 'react-icons/md'

const UserCard = ({account,userId}:{account:User,userId:string}) => {
  console.log(account.rol)
  return (
    <div key={account.id} className="flex items-center justify-between py-1">
      <div className="flex items-center gap-2">
        <Link href={`/Account/${account.id}`}>
          <Avatar className={cn("h-8 w-8 ",account.rol=='premium'?"outline outline-2 outline-blue-600 ":"")} >
            <AvatarFallback>{(account.nume[0]+account.prenume[0]).toUpperCase()}</AvatarFallback>
          </Avatar>
        </Link>
        <div>
          <Link href={`/Account/${account.id}`}>
            <h4 className="text-sm font-medium flex">
              {account.nume+" "+account.prenume} 
              {account.rol=='premium' && <MdWorkspacePremium size={20} className="text-blue-600"/>}
            </h4>
          </Link>
          <p className='text-xs text-muted-foreground'>{account.email}</p>
          <p className="text-xs text-muted-foreground">{account.urmaritori} urmăritori</p>
        </div>
      </div>
      <div className="w-20 h-8 text-sm">
        <FollowButton id_user={userId as string} followed={account.followed} id_followed_user={account.id} />
      </div>
    </div>
  )
}

export default UserCard