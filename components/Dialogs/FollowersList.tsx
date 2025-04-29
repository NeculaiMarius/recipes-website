"use client"
import { getFollowersUsers, getLikesUsers } from '@/app/stores/UserStore';
import { User } from '@/interfaces/users';
import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import UserCard from '../UserCard';
import { FaHeart } from 'react-icons/fa';

const FollowersList = ({userId,noFollowers,sessionId}:{sessionId:string,userId:string,noFollowers:number}) => {
  const [users,setUsers]=useState<User[]>([]);
  const [open, setOpen] = useState(false)

  useEffect(() => {
    async function fetchUsers() {
      try {
        const users = await getFollowersUsers(userId);
        setUsers(users);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    }

    fetchUsers();
  }, [userId]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
            <p className='font-bold text-right max-md:text-center hover:bg-white px-1 hover:text-emerald-800 rounded-md cursor-pointer'>
              Urmăritori 
            </p>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Urmărit de {noFollowers} utilizatori</DialogTitle>
                {/* <DialogDescription>Persoanele care au apreciat</DialogDescription> */}
              </DialogHeader>
              <div className="max-h-[60vh] overflow-y-auto pr-1">
                <div className="flex flex-col gap-2 h-[400px] overflow-auto">
                  {users.map((user) => (
                    <UserCard account={user} userId={userId} key={user.id}></UserCard>
                  ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>
  )
}

export default FollowersList